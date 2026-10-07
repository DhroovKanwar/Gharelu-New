import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Search, AlertCircle } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/common/PageHeader";
import Section from "../components/common/Section";
import Button from "../components/common/Button";
import { cn } from "../utils/cn";
import { lookupOrdersByPhone } from "../services/orderService";

const STATUS_LABELS = {
  new: "Order placed",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};

const Field = ({ label, className, ...props }) => (
  <label className={cn("block", className)}>
    <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-brand-dark">
      {label}
    </span>
    <input
      className="w-full rounded-2xl border border-brand-line bg-white px-5 py-3.5 text-brand-dark outline-none transition-shadow placeholder:text-brand-text/50 focus:ring-2 focus:ring-brand-accent"
      {...props}
    />
  </label>
);

const OrderCard = ({ order }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    className="rounded-[1.75rem] border border-brand-line bg-brand-secondary p-6 sm:p-8"
    data-testid="track-order-card"
  >
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-line pb-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent">Order number</p>
        <p className="mt-1 font-heading text-xl font-extrabold text-brand-dark">#{order.orderNumber}</p>
        {order.scheduledDate && (
          <p className="mt-1 text-xs text-brand-text">
            Scheduled for {order.scheduledDate}
            {order.scheduledTime ? ` · ${order.scheduledTime}` : ""}
          </p>
        )}
      </div>
      <span className="flex items-center gap-2 rounded-full bg-brand-primary/50 px-4 py-2 text-sm font-semibold text-brand-accent">
        <Package size={16} /> {STATUS_LABELS[order.status] || order.status}
      </span>
    </div>

    <ul className="mt-5 space-y-3">
      {(order.items || []).map((item, i) => (
        <li key={i} className="flex items-center justify-between text-sm">
          <span className="text-brand-dark">
            {item.productName}
            {item.sizeLabel ? ` (${item.sizeLabel})` : ""} × {item.quantity}
          </span>
          <span className="font-semibold text-brand-dark">₹{item.lineTotal}</span>
        </li>
      ))}
    </ul>

    <div className="mt-5 flex justify-between border-t border-brand-line pt-4">
      <span className="font-semibold text-brand-dark">Total</span>
      <span className="font-heading text-xl font-extrabold text-brand-dark">₹{order.total}</span>
    </div>
    <p className="mt-3 text-xs text-brand-text">
      Payment: {order.paymentMethod === "cod" ? "Cash on delivery" : "Online"} ·{" "}
      {order.paymentStatus === "paid" ? "Paid" : "Pending"}
    </p>
  </motion.div>
);

export default function TrackOrder() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOrders(null);

    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      const results = await lookupOrdersByPhone(phone);
      setOrders(results);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Track / Order History"
        title={["Find your", "orders"]}
        subtitle="Enter the mobile number you used while ordering to see its status and details."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Track Order" }]}
      />

      <Section>
        <div className="mx-auto max-w-xl">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 rounded-[1.75rem] border border-brand-line bg-brand-bg p-6 sm:flex-row sm:items-end sm:p-8"
            data-testid="track-order-form"
          >
            <Field
              label="Mobile number"
              type="tel"
              placeholder="98765 43210"
              className="flex-1"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              data-testid="track-order-phone"
            />
            <Button type="submit" icon={<Search size={18} />} disabled={loading} data-testid="track-order-submit">
              {loading ? "Searching…" : "Find orders"}
            </Button>
          </form>

          {error && (
            <p className="mt-4 flex items-center gap-2 text-sm font-medium text-red-500" data-testid="track-order-error">
              <AlertCircle size={16} /> {error}
            </p>
          )}
        </div>

        {orders && (
          <div className="mx-auto mt-10 max-w-2xl space-y-6">
            {orders.length === 0 ? (
              <p className="text-center text-brand-text" data-testid="track-order-empty">
                No orders found for this number. Double-check the mobile number you used at checkout.
              </p>
            ) : (
              orders.map((order) => <OrderCard key={order.orderNumber} order={order} />)
            )}
          </div>
        )}
      </Section>
    </MainLayout>
  );
}
