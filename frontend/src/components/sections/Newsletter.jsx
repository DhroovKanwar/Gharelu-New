import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { leadService } from "../../services/api";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await leadService.subscribe(email);
      toast.success("Welcome to the table! Check your inbox soon.");
      setEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="newsletter" className="py-24 md:py-32" data-testid="newsletter-section">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2.5rem] bg-brand-primary px-8 py-16 md:px-16 md:py-24"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-accent/30 blur-3xl" />
          <div className="relative max-w-2xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-brand-accent">
              Join the inner circle
            </p>
            <h2 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-dark sm:text-5xl lg:text-6xl">
              Sweet things, straight to your inbox
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-brand-dark/70 sm:text-lg">
              Early access to seasonal collections, quiet drops and members-only
              treats. No spam — just the good stuff.
            </p>

            <form onSubmit={onSubmit} className="mt-9 flex max-w-lg flex-col gap-3 sm:flex-row" data-testid="newsletter-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-full border border-transparent bg-brand-bg px-6 py-4 text-brand-dark outline-none transition-shadow placeholder:text-brand-text/50 focus:ring-2 focus:ring-brand-accent"
                data-testid="newsletter-email"
              />
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand-dark px-8 py-4 font-heading font-semibold text-white transition-colors hover:bg-brand-accent disabled:opacity-60"
                data-testid="newsletter-submit"
              >
                {loading ? "Joining…" : "Subscribe"} <ArrowRight size={18} />
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
