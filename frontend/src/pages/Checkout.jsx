import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Lock,
  CreditCard,
  Smartphone,
  Wallet,
  ArrowRight,
  ShoppingBag,
  Truck,
  Store,
  UtensilsCrossed,
  Package,
  Loader2,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/common/PageHeader";
import Section from "../components/common/Section";
import Button from "../components/common/Button";
import { useCart } from "../context/CartContext";
import { useOrder } from "../context/OrderContext";
import { cn } from "../utils/cn";
import {
  isValidEmail,
  isValidPhone,
  isValidPincode,
} from "../utils/validators";
import {
  createPaymentOrder,
  runPaymentInNewWindow,
  verifyPayment,
} from "../services/paymentService";

const Field = ({ label, className, ...props }) => (
  <label className={cn("block", className)}>
    <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-brand-dark">
      {label}
    </span>
    <input
      className="w-full rounded-2xl border border-brand-line bg-brand-bg px-5 py-3.5 text-brand-dark outline-none transition-shadow placeholder:text-brand-text/50 focus:ring-2 focus:ring-brand-accent"
      {...props}
    />
  </label>
);

const PAYMENTS = [
  {
    id: "online",
    label: "Pay Online",
    icon: CreditCard,
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    icon: Wallet,
  },
];

const DELIVERY_MODES = [
  { id: "delivery", label: "Delivery", icon: Truck },
  { id: "pickup", label: "Pickup", icon: Store },
];

const PICKUP_TYPES = [
  { id: "dine-in", label: "Dine-in", icon: UtensilsCrossed },
  { id: "parcel", label: "Parcel", icon: Package },
];

const API_BASE = process.env.REACT_APP_BACKEND_URL || "";

const todayISO = () => new Date().toISOString().split("T")[0];
const currentTimeHHMM = () => new Date().toTimeString().slice(0, 5);

export default function Checkout() {
  const { items, subtotal, count, clearCart, removeItem } = useCart();
  const navigate = useNavigate();
  const { mode: startOrderMode } = useOrder();
  // Delivery is for hampers only; every other menu item is pickup only, and
  // the two can't share one order (the backend enforces the same rules).
  const isHamperItem = (i) => /hamper/i.test(String(i.slug || i.productSlug || i.id || ""));
  const hamperCount = items.filter(isHamperItem).length;
  const mixedCart = hamperCount > 0 && hamperCount < items.length;
  const pickupOnly = items.length > 0 && hamperCount === 0;
  // Carries over the Delivery/Pickup choice made on the "Start an Order" page.
  // Falls back to "delivery" so something is always selected even if that
  // page was skipped or the choice didn't come through.
  const [deliveryMode, setDeliveryMode] = useState(
    pickupOnly || startOrderMode === "pickup" ? "pickup" : "delivery",
  );
  const [pickupType, setPickupType] = useState("dine-in");
  const [payment, setPayment] = useState("online");
  // Cash on Delivery is only offered for pickup orders.
  const availablePayments = PAYMENTS.filter((p) => p.id !== "cod" || deliveryMode === "pickup");
  const [loading, setLoading] = useState(false);
  // True only while the popup payment window is open and we're waiting on
  // its result — the full-page overlay this drives is what stops the form
  // from being edited/resubmitted mid-payment.
  const [paymentLocked, setPaymentLocked] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    date: todayISO(),
    time: currentTimeHHMM(),
  });

  useEffect(() => {
    if (deliveryMode === "delivery" && payment === "cod") setPayment("online");
  }, [deliveryMode, payment]);

  useEffect(() => {
    if (pickupOnly && deliveryMode !== "pickup") setDeliveryMode("pickup");
  }, [pickupOnly, deliveryMode]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Delivery fee comes from the backend (Shiprocket rate for the pincode).
  // There is no fallback fee: until a valid pincode is entered and the quote
  // arrives, delivery shows a prompt/error and ordering is disabled.
  const [quote, setQuote] = useState(null);
  const [quoteError, setQuoteError] = useState("");
  const [quoting, setQuoting] = useState(false);

  useEffect(() => {
    setQuote(null);
    setQuoteError("");
    if (deliveryMode !== "delivery" || !isValidPincode(form.pincode) || items.length === 0) {
      setQuoting(false);
      return undefined;
    }
    const controller = new AbortController();
    setQuoting(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/cart/validate`, {
          method: "POST",
          signal: controller.signal,
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            delivery_mode: "delivery",
            pincode: form.pincode.trim(),
            items: items.map((item) => ({
              product_slug: item.slug || item.productSlug || item.id,
              size_label: item.size || null,
              quantity: item.qty || item.quantity,
            })),
          }),
        });
        const json = await res.json();
        if (res.ok) {
          setQuote(json.data.deliveryFee);
        } else {
          setQuoteError(json?.errors?.pincode?.[0] || json?.message || "Couldn't calculate delivery for this pincode.");
        }
      } catch (err) {
        if (!controller.signal.aborted) setQuoteError("Couldn't calculate delivery. Please try again.");
      } finally {
        if (!controller.signal.aborted) setQuoting(false);
      }
    }, 400);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [deliveryMode, form.pincode, items]);

  const needsQuote = deliveryMode === "delivery" && subtotal > 0;
  const delivery = needsQuote ? (quote ?? 0) : 0;
  const deliveryReady = !needsQuote || quote !== null;
  const total = Math.round((subtotal + delivery) * 100) / 100;

  const placeOrder = async (e) => {
    e.preventDefault();

    if (mixedCart) {
      toast.error("Please order hampers and other menu items separately.");
      return;
    }

    const required = ["firstName", "lastName", "email", "phone"];

    if (deliveryMode === "delivery") {
      required.push("address", "city", "state", "pincode");
    }

    if (required.some((k) => !form[k].trim())) {
      toast.error("Please complete all required details.");
      return;
    }

    if (!isValidEmail(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!isValidPhone(form.phone)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (deliveryMode === "delivery" && !isValidPincode(form.pincode)) {
      toast.error("Please enter a valid 6-digit pincode.");
      return;
    }

    // Open the payment popup synchronously, still inside the click's user
    // gesture — opening it later (after an await) is what gets it killed by
    // popup blockers. It sits with a "connecting…" placeholder (see
    // PaymentWindow.jsx) until we have real order data to hand it.
    let paymentWindow = null;
    if (payment === "online") {
      paymentWindow = window.open(
        "/payment-window",
        "gb_payment_window",
        "width=460,height=700",
      );
      if (!paymentWindow) {
        toast.error("Please allow popups for this site to pay online.");
        return;
      }
    }

    setLoading(true);

    try {
      // 1. FIRST create the real order in Laravel.
      const orderResponse = await fetch(`${API_BASE}/api/v1/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone,

          delivery_mode: deliveryMode,

          pickup_type:
            deliveryMode === "pickup"
              ? pickupType === "dine-in"
                ? "dine_in"
                : "parcel"
              : null,

          address_line_1: deliveryMode === "delivery" ? form.address : null,

          address_line_2: null,

          city: deliveryMode === "delivery" ? form.city : null,

          state: deliveryMode === "delivery" ? form.state : null,

          pincode: deliveryMode === "delivery" ? form.pincode : null,

          landmark: null,

          scheduled_date: form.date,
          scheduled_time: form.time,

          payment_method: payment,

          notes: null,

          idempotency_key: crypto.randomUUID(),

          items: items.map((item) => ({
            product_slug: item.slug || item.productSlug || item.id,
            size: item.size || null,
            quantity: item.qty || item.quantity,
          })),
        }),
      });

      const createdOrder = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(
          createdOrder?.message || "Unable to create your order.",
        );
      }

      const orderId = createdOrder.data.orderNumber;

      // 2. COD — order is already created in Laravel.
      if (payment === "cod") {
        const apiOrder = createdOrder.data;

        const finalOrder = {
          ...apiOrder,

          id: apiOrder.orderNumber,

          items: (apiOrder.items || []).map((item, index) => ({
            lineId: `${apiOrder.orderNumber}-${index}`,
            name: item.productName,
            image: item.productImage,
            size: item.sizeLabel,
            qty: item.quantity,
            price: item.unitPrice,
          })),

          subtotal: apiOrder.subtotal,
          delivery: apiOrder.deliveryFee,
          total: apiOrder.total,

          deliveryMode: apiOrder.deliveryMode,
          pickupType: apiOrder.pickupType,
          payment: apiOrder.paymentMethod,

          customer: apiOrder.customer,

          date: apiOrder.scheduledDate,
          time: apiOrder.scheduledTime,

          payment_status: apiOrder.paymentStatus,
        };

        localStorage.setItem("gb_last_order", JSON.stringify(finalOrder));

        clearCart();
        setLoading(false);
        navigate("/order-success");
        return;
      }

      // 3. Ask Laravel to create the REAL Razorpay order.
      const razorpayOrder = await createPaymentOrder({
        orderId,
      });

      // 4. Hand the payment window everything it needs and lock this page
      // until it reports back success / failure / cancellation — nothing
      // here can be edited or resubmitted while paymentLocked is true (see
      // the overlay in the JSX below).
      setPaymentLocked(true);

      const result = await runPaymentInNewWindow(paymentWindow, {
        name: "Gharelu Bake",
        description: `Order ${orderId} · ${count} item${count > 1 ? "s" : ""}`,
        customer: {
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          contact: form.phone,
        },
        razorpayOrder,
      });

      if (result.status === "success") {
        const verification = await verifyPayment({
          ...result.payload,
          orderId,
        });

        if (!verification?.verified) {
          throw new Error("We couldn't verify your payment. Please contact support.");
        }

        const apiOrder = createdOrder.data;

        const finalOrder = {
          ...apiOrder,

          // OrderSuccess frontend format
          id: apiOrder.orderNumber,

          items: (apiOrder.items || []).map((item, index) => ({
            lineId: `${apiOrder.orderNumber}-${index}`,
            name: item.productName,
            image: item.productImage,
            size: item.sizeLabel,
            qty: item.quantity,
            price: item.unitPrice,
          })),

          subtotal: apiOrder.subtotal,
          delivery: apiOrder.deliveryFee,
          total: apiOrder.total,

          deliveryMode: apiOrder.deliveryMode,
          pickupType: apiOrder.pickupType,
          payment: apiOrder.paymentMethod,

          customer: apiOrder.customer,

          date: apiOrder.scheduledDate,
          time: apiOrder.scheduledTime,

          razorpay_payment_id: result.payload.razorpay_payment_id,
          razorpay_order_id: result.payload.razorpay_order_id,
          payment_status: "paid",
        };

        localStorage.setItem("gb_last_order", JSON.stringify(finalOrder));

        clearCart();
        setLoading(false);
        setPaymentLocked(false);
        navigate("/order-success");
      } else if (result.status === "cancelled") {
        toast.error("Payment was cancelled.");
        setLoading(false);
        setPaymentLocked(false);
      } else {
        toast.error(result.reason || "Payment could not be completed. Please try again.");
        setLoading(false);
        setPaymentLocked(false);
      }
    } catch (err) {
      console.error("Checkout error:", err);

      paymentWindow?.close();
      setPaymentLocked(false);
      toast.error(err?.message || "Something went wrong. Please try again.");

      setLoading(false);
    }
  };
  if (count === 0) {
    return (
      <MainLayout>
        <PageHeader
          eyebrow="Checkout"
          title="Your box is empty"
          breadcrumb={[{ label: "Home", to: "/" }, { label: "Checkout" }]}
        />
        <Section>
          <div className="flex flex-col items-center gap-5 py-10 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-brand-secondary text-brand-accent">
              <ShoppingBag size={30} />
            </div>
            <p className="text-brand-text">
              Add a few treats before heading to checkout.
            </p>
            <Button as="a" to="/catalogue" icon={<ArrowRight size={18} />}>
              Browse Cakes
            </Button>
          </div>
        </Section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Almost there"
        title="Checkout"
        breadcrumb={[
          { label: "Home", to: "/" },
          { label: "Cart", to: "/catalogue" },
          { label: "Checkout" },
        ]}
      />

      <Section className="pt-14 md:pt-16">
        <form
          onSubmit={placeOrder}
          className="grid grid-cols-1 gap-10 lg:grid-cols-12"
          data-testid="checkout-form"
        >
          {/* Details */}
          <div className="space-y-10 lg:col-span-7">
            <div>
              <h2 className="font-heading text-2xl font-extrabold tracking-tight text-brand-dark">
                Contact
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field
                  label="First Name"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={set("firstName")}
                  data-testid="checkout-first-name"
                />
                <Field
                  label="Last Name"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={set("lastName")}
                  data-testid="checkout-last-name"
                />
                <Field
                  label="Phone"
                  placeholder="Mobile number"
                  className="sm:col-span-2"
                  value={form.phone}
                  onChange={set("phone")}
                  data-testid="checkout-phone"
                />
                <Field
                  label="Email"
                  type="email"
                  placeholder="you@email.com"
                  className="sm:col-span-2"
                  value={form.email}
                  onChange={set("email")}
                  data-testid="checkout-email"
                />
              </div>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-extrabold tracking-tight text-brand-dark">
                Delivery
              </h2>

              {mixedCart && (
                <p className="mt-4 rounded-2xl bg-brand-secondary px-4 py-3 text-sm text-brand-dark" data-testid="mixed-cart-note">
                  Hampers can be delivered, while other menu items are pickup only. Please place them as separate orders — remove one kind from your box to continue.
                </p>
              )}
              {pickupOnly && (
                <p className="mt-4 rounded-2xl bg-brand-secondary px-4 py-3 text-sm text-brand-dark" data-testid="pickup-only-note">
                  Menu items are available for pickup only. Delivery is offered for hampers.
                </p>
              )}

              <div className={cn("mt-5 grid gap-3", pickupOnly ? "grid-cols-1" : "grid-cols-2")}>
                {DELIVERY_MODES.filter((m) => !pickupOnly || m.id === "pickup").map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setDeliveryMode(m.id)}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-2xl border px-5 py-3.5 text-sm font-medium transition-colors",
                      deliveryMode === m.id
                        ? "border-brand-accent bg-brand-secondary text-brand-dark"
                        : "border-brand-line text-brand-dark hover:border-brand-accent",
                    )}
                    data-testid={`delivery-mode-${m.id}`}
                  >
                    <m.icon size={18} className="text-brand-accent" /> {m.label}
                  </button>
                ))}
              </div>

              {deliveryMode === "pickup" && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {PICKUP_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setPickupType(t.id)}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-2xl border px-5 py-3.5 text-sm font-medium transition-colors",
                        pickupType === t.id
                          ? "border-brand-accent bg-brand-secondary text-brand-dark"
                          : "border-brand-line text-brand-dark hover:border-brand-accent",
                      )}
                      data-testid={`pickup-type-${t.id}`}
                    >
                      <t.icon size={18} className="text-brand-accent" />{" "}
                      {t.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {deliveryMode === "delivery" && (
                  <>
                <Field
                  label="Address"
                  placeholder="House / street"
                  className="sm:col-span-2"
                  value={form.address}
                  onChange={set("address")}
                  data-testid="checkout-address"
                />
                <Field
                  label="City"
                  placeholder="City"
                  value={form.city}
                  onChange={set("city")}
                  data-testid="checkout-city"
                />
                <Field
                  label="State"
                  placeholder="State"
                  value={form.state}
                  onChange={set("state")}
                  data-testid="checkout-state"
                />
                <Field
                  label="Pincode"
                  placeholder="6-digit pincode"
                  value={form.pincode}
                  inputMode="numeric"
                  maxLength={6}
                  pattern="[1-9][0-9]{5}"
                  onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value.replace(/D/g, "").slice(0, 6) }))}
                  data-testid="checkout-pincode"
                />
                  </>
                )}
                <Field
                  label="Preferred Date"
                  type="date"
                  value={form.date}
                  onChange={set("date")}
                  data-testid="checkout-date"
                />
                <Field
                  label="Preferred Time"
                  type="time"
                  value={form.time}
                  onChange={set("time")}
                  data-testid="checkout-time"
                />
              </div>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-extrabold tracking-tight text-brand-dark">
                Payment
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {availablePayments.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPayment(p.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border px-5 py-4 text-left text-sm font-medium transition-colors",
                      payment === p.id
                        ? "border-brand-accent bg-brand-secondary text-brand-dark"
                        : "border-brand-line text-brand-dark hover:border-brand-accent",
                    )}
                    data-testid={`payment-${p.id}`}
                  >
                    <p.icon size={18} className="text-brand-accent" /> {p.label}
                  </button>
                ))}
              </div>
              <p className="mt-3 flex items-center gap-2 text-xs text-brand-text">
                <Lock size={13} /> This is a demo checkout — no real payment is
                processed.
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:sticky lg:top-28 rounded-[1.75rem] border border-brand-line bg-brand-secondary p-7"
            >
              <h3 className="font-heading text-xl font-extrabold text-brand-dark">
                Order Summary
              </h3>
              <ul className="mt-5 space-y-4">
                {items.map((i) => (
                  <li key={i.lineId} className="flex items-center gap-4">
                    <img
                      src={i.image}
                      alt={i.name}
                      className="h-16 w-14 shrink-0 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-heading text-sm font-bold text-brand-dark">
                        {i.name}
                      </p>
                      <p className="text-xs text-brand-text">
                        {i.size ? `${i.size} · ` : ""}Qty {i.qty}
                      </p>
                    </div>
                    <span className="font-heading font-bold text-brand-dark">
                      ₹{i.price * i.qty}
                    </span>
                    {mixedCart && !isHamperItem(i) && (
                      <button
                        type="button"
                        onClick={() => removeItem(i.lineId)}
                        className="inline-flex shrink-0 items-center gap-1 rounded-full border border-brand-line px-2.5 py-1 text-xs font-semibold text-brand-dark transition-colors hover:border-brand-accent hover:text-brand-accent"
                        aria-label={`Remove ${i.name}`}
                        data-testid={`checkout-remove-${i.lineId}`}
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-2 border-t border-brand-line pt-5 text-sm">
                <div className="flex justify-between text-brand-text">
                  <span>Subtotal</span>
                  <span className="text-brand-dark">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-brand-text">
                  <span>Delivery</span>
                  <span className="text-brand-dark">
                    {!needsQuote
                      ? "₹0"
                      : quoting
                        ? "Calculating…"
                        : quote !== null
                          ? `₹${quote}`
                          : quoteError
                            ? "Unavailable"
                            : "Enter pincode"}
                  </span>
                </div>
                <div className="flex justify-between pt-3 text-base font-bold">
                  <span className="text-brand-dark">Total</span>
                  <span
                    className="font-heading text-xl font-extrabold text-brand-dark"
                    data-testid="checkout-total"
                  >
                    ₹{total}
                  </span>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading || !deliveryReady || mixedCart}
                size="lg"
                className="mt-6 w-full"
                icon={<ArrowRight size={18} />}
                data-testid="place-order"
              >
                {paymentLocked
                  ? "Waiting for payment…"
                  : loading
                    ? "Placing order…"
                    : !deliveryReady
                      ? "Enter pincode for delivery fee"
                      : `Place Order · ₹${total}`}
              </Button>
              {quoteError && needsQuote && <p className="mt-3 text-center text-xs text-red-600">{quoteError}</p>}
            </motion.div>
          </div>
        </form>
      </Section>

      {paymentLocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[2000] flex flex-col items-center justify-center gap-4 bg-brand-bg/90 px-6 text-center backdrop-blur-sm"
          data-testid="payment-lock-overlay"
        >
          <Loader2 size={40} className="animate-spin text-brand-accent" />
          <p className="font-heading text-lg font-bold text-brand-dark">
            Waiting for your payment…
          </p>
          <p className="flex max-w-sm items-center justify-center gap-2 text-sm text-brand-text">
            <ShieldCheck size={16} className="shrink-0 text-brand-accent" />
            Complete it in the new payment window. This page is locked until we hear back — please don't close or refresh it.
          </p>
        </motion.div>
      )}
    </MainLayout>
  );
}
