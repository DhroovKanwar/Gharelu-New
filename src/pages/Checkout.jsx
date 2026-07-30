import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, CreditCard, Smartphone, Wallet, ArrowRight, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/common/PageHeader";
import Section from "../components/common/Section";
import Button from "../components/common/Button";
import { useCart } from "../context/CartContext";
import { cn } from "../utils/cn";

const Field = ({ label, className, ...props }) => (
  <label className={cn("block", className)}>
    <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-brand-dark">{label}</span>
    <input
      className="w-full rounded-2xl border border-brand-line bg-brand-bg px-5 py-3.5 text-brand-dark outline-none transition-shadow placeholder:text-brand-text/50 focus:ring-2 focus:ring-brand-accent"
      {...props}
    />
  </label>
);

const PAYMENTS = [
  { id: "card", label: "Card", icon: CreditCard },
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "cod", label: "Cash on Delivery", icon: Wallet },
];

export default function Checkout() {
  const { items, subtotal, count, clearCart } = useCart();
  const navigate = useNavigate();
  const [payment, setPayment] = useState("card");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", pincode: "", date: "" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const delivery = subtotal >= 1500 || subtotal === 0 ? 0 : 99;
  const total = subtotal + delivery;

  const placeOrder = async (e) => {
    e.preventDefault();
    const required = ["name", "email", "phone", "address", "city", "pincode"];
    if (required.some((k) => !form[k].trim())) {
      toast.error("Please complete all delivery details.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    const order = {
      id: "GB" + Math.floor(100000 + Math.random() * 900000),
      items,
      subtotal,
      delivery,
      total,
      payment,
      customer: form,
      date: new Date().toISOString(),
    };
    // API-ready: leadService / orderService.create(order)
    setTimeout(() => {
      localStorage.setItem("gb_last_order", JSON.stringify(order));
      clearCart();
      setLoading(false);
      navigate("/order-success");
    }, 700);
  };

  if (count === 0) {
    return (
      <MainLayout>
        <PageHeader eyebrow="Checkout" title="Your box is empty" breadcrumb={[{ label: "Home", to: "/" }, { label: "Checkout" }]} />
        <Section>
          <div className="flex flex-col items-center gap-5 py-10 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-brand-secondary text-brand-accent"><ShoppingBag size={30} /></div>
            <p className="text-brand-text">Add a few treats before heading to checkout.</p>
            <Button as="a" to="/catalogue" icon={<ArrowRight size={18} />}>Browse Cakes</Button>
          </div>
        </Section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader eyebrow="Almost there" title="Checkout" breadcrumb={[{ label: "Home", to: "/" }, { label: "Cart", to: "/catalogue" }, { label: "Checkout" }]} />

      <Section className="pt-14 md:pt-16">
        <form onSubmit={placeOrder} className="grid grid-cols-1 gap-10 lg:grid-cols-12" data-testid="checkout-form">
          {/* Details */}
          <div className="space-y-10 lg:col-span-7">
            <div>
              <h2 className="font-heading text-2xl font-extrabold tracking-tight text-brand-dark">Contact</h2>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Full Name" placeholder="Your name" value={form.name} onChange={set("name")} data-testid="checkout-name" />
                <Field label="Phone" placeholder="Mobile number" value={form.phone} onChange={set("phone")} data-testid="checkout-phone" />
                <Field label="Email" type="email" placeholder="you@email.com" className="sm:col-span-2" value={form.email} onChange={set("email")} data-testid="checkout-email" />
              </div>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-extrabold tracking-tight text-brand-dark">Delivery</h2>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Address" placeholder="House / street" className="sm:col-span-2" value={form.address} onChange={set("address")} data-testid="checkout-address" />
                <Field label="City" placeholder="City" value={form.city} onChange={set("city")} data-testid="checkout-city" />
                <Field label="Pincode" placeholder="Pincode" value={form.pincode} onChange={set("pincode")} data-testid="checkout-pincode" />
                <Field label="Preferred Date" type="date" className="sm:col-span-2" value={form.date} onChange={set("date")} data-testid="checkout-date" />
              </div>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-extrabold tracking-tight text-brand-dark">Payment</h2>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {PAYMENTS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPayment(p.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border px-5 py-4 text-left text-sm font-medium transition-colors",
                      payment === p.id ? "border-brand-accent bg-brand-secondary text-brand-dark" : "border-brand-line text-brand-dark hover:border-brand-accent",
                    )}
                    data-testid={`payment-${p.id}`}
                  >
                    <p.icon size={18} className="text-brand-accent" /> {p.label}
                  </button>
                ))}
              </div>
              <p className="mt-3 flex items-center gap-2 text-xs text-brand-text"><Lock size={13} /> This is a demo checkout — no real payment is processed.</p>
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
              <h3 className="font-heading text-xl font-extrabold text-brand-dark">Order Summary</h3>
              <ul className="mt-5 space-y-4">
                {items.map((i) => (
                  <li key={i.lineId} className="flex items-center gap-4">
                    <img src={i.image} alt={i.name} className="h-16 w-14 shrink-0 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="font-heading text-sm font-bold text-brand-dark">{i.name}</p>
                      <p className="text-xs text-brand-text">{i.size ? `${i.size} · ` : ""}Qty {i.qty}</p>
                    </div>
                    <span className="font-heading font-bold text-brand-dark">₹{i.price * i.qty}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-2 border-t border-brand-line pt-5 text-sm">
                <div className="flex justify-between text-brand-text"><span>Subtotal</span><span className="text-brand-dark">₹{subtotal}</span></div>
                <div className="flex justify-between text-brand-text"><span>Delivery</span><span className="text-brand-dark">{delivery === 0 ? "Free" : `₹${delivery}`}</span></div>
                <div className="flex justify-between pt-3 text-base font-bold">
                  <span className="text-brand-dark">Total</span>
                  <span className="font-heading text-xl font-extrabold text-brand-dark" data-testid="checkout-total">₹{total}</span>
                </div>
              </div>
              <Button type="submit" disabled={loading} size="lg" className="mt-6 w-full" icon={<ArrowRight size={18} />} data-testid="place-order">
                {loading ? "Placing order…" : `Place Order · ₹${total}`}
              </Button>
            </motion.div>
          </div>
        </form>
      </Section>
    </MainLayout>
  );
}
