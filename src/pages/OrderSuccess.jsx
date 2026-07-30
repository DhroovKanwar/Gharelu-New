import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Package, ArrowRight, Mail } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import Section from "../components/common/Section";
import Button from "../components/common/Button";

export default function OrderSuccess() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      setOrder(JSON.parse(localStorage.getItem("gb_last_order")));
    } catch {
      setOrder(null);
    }
  }, []);

  return (
    <MainLayout>
      <Section className="pt-20">
        <div className="mx-auto max-w-2xl text-center" data-testid="order-success">
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-brand-accent text-white"
          >
            <Check size={44} strokeWidth={3} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 font-heading text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl"
          >
            Order confirmed!
          </motion.h1>
          <p className="mt-4 text-base text-brand-text sm:text-lg">
            Thank you for choosing Gharelu.Bake. Your treats are being lovingly prepared.
          </p>

          {order && (
            <div className="mt-10 rounded-[1.75rem] border border-brand-line bg-brand-secondary p-8 text-left">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-line pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent">Order number</p>
                  <p className="mt-1 font-heading text-2xl font-extrabold text-brand-dark" data-testid="order-number">#{order.id}</p>
                </div>
                <span className="flex items-center gap-2 rounded-full bg-brand-primary/50 px-4 py-2 text-sm font-semibold text-brand-accent">
                  <Package size={16} /> Preparing
                </span>
              </div>
              <ul className="mt-5 space-y-3">
                {order.items.map((i) => (
                  <li key={i.lineId} className="flex items-center justify-between text-sm">
                    <span className="text-brand-dark">{i.name}{i.size ? ` (${i.size})` : ""} × {i.qty}</span>
                    <span className="font-semibold text-brand-dark">₹{i.price * i.qty}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex justify-between border-t border-brand-line pt-4">
                <span className="font-semibold text-brand-dark">Total paid</span>
                <span className="font-heading text-xl font-extrabold text-brand-dark">₹{order.total}</span>
              </div>
              <p className="mt-5 flex items-center gap-2 text-sm text-brand-text">
                <Mail size={15} className="text-brand-accent" /> A confirmation has been sent to {order.customer?.email}.
              </p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button as="a" to="/catalogue" icon={<ArrowRight size={18} />}>Continue shopping</Button>
            <Button as="a" to="/" variant="outline">Back home</Button>
          </div>
        </div>
      </Section>
    </MainLayout>
  );
}
