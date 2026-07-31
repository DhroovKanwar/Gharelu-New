import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Cake, Zap, Leaf, Truck } from "lucide-react";

const STORAGE_KEY = "gb_order_cta_dismissed_at";
const HIDE_HOURS = 24;

const isDismissed = () => {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!ts || Number.isNaN(ts)) return false;
    return Date.now() - ts < HIDE_HOURS * 60 * 60 * 1000;
  } catch {
    return false;
  }
};

const FloatingOrderCTA = () => {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (isDismissed()) return;
    // Slight delay so it slides in after page enters
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      /* noop */
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        isMobile ? (
          /* ────────────────  MOBILE  ──────────────── */
          <motion.div
            key="cta-mobile"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: [0, -3, 0] }}
            exit={{ opacity: 0, y: 60 }}
            transition={{
              opacity: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
              y: {
                duration: 3.2,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                delay: 0.5,
              },
            }}
            className="fixed inset-x-4 bottom-4 z-40 md:hidden"
            data-testid="floating-order-cta-mobile"
          >
            <div className="relative flex items-center gap-3 rounded-[20px] border border-brand-primary bg-white px-4 py-3 shadow-[0_18px_45px_-18px_rgba(215,134,159,0.55)]">
              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss"
                className="absolute -top-2 -right-2 grid h-7 w-7 place-items-center rounded-full border border-brand-line bg-white text-brand-dark shadow-sm transition-colors hover:border-brand-accent hover:text-brand-accent"
                data-testid="floating-order-cta-close"
              >
                <X size={14} />
              </button>

              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-secondary text-brand-accent">
                <Cake size={20} strokeWidth={1.75} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate font-heading text-sm font-extrabold tracking-tight text-brand-dark">
                  Order Fresh Cakes
                </p>
                <p className="mt-0.5 truncate text-[11px] font-medium uppercase tracking-[0.18em] text-brand-accent">
                  Pure • Premium • Eggless
                </p>
              </div>

              <Link
                to="/order"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-accent px-4 py-2.5 font-heading text-sm font-bold text-white shadow-sm transition-all duration-300 hover:scale-[1.03] hover:bg-brand-dark hover:shadow-md"
                data-testid="floating-order-cta-btn-mobile"
              >
                Order Now <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        ) : (
          /* ────────────────  DESKTOP  ──────────────── */
          <motion.div
            key="cta-desktop"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: [0, -4, 0] }}
            exit={{ opacity: 0, y: -30 }}
            transition={{
              opacity: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
              y: {
                duration: 4,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                delay: 0.5,
              },
            }}
            className="pointer-events-none fixed inset-x-0 top-[92px] z-40 hidden justify-center px-4 md:flex"
            data-testid="floating-order-cta-desktop"
          >
            <div className="pointer-events-auto relative w-full max-w-[480px] rounded-[22px] border border-brand-primary bg-white p-6 shadow-[0_28px_70px_-24px_rgba(215,134,159,0.5)]">
              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss"
                className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-brand-dark/70 transition-colors hover:bg-brand-secondary hover:text-brand-accent"
                data-testid="floating-order-cta-close"
              >
                <X size={16} />
              </button>

              <div className="flex items-start gap-3 pr-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-secondary text-brand-accent">
                  <Cake size={22} strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="font-heading text-lg font-extrabold tracking-tight text-brand-dark md:text-xl">
                    Ready to Order Your Dream Cake?
                  </h3>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-accent">
                    Pure • Premium • Eggless
                  </p>
                </div>
              </div>

              <Link
                to="/order"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-accent px-6 py-3.5 font-heading text-base font-bold text-white shadow-[0_10px_25px_-10px_rgba(215,134,159,0.7)] transition-all duration-300 hover:scale-[1.03] hover:bg-brand-dark hover:shadow-[0_16px_35px_-10px_rgba(215,134,159,0.8)]"
                data-testid="floating-order-cta-btn"
              >
                Order Now <ArrowRight size={18} />
              </Link>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-brand-line pt-4 text-[11px] font-semibold text-brand-dark">
                <span className="inline-flex items-center gap-1.5">
                  <Truck size={13} className="text-brand-accent" /> Same Day Delivery
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Zap size={13} className="text-brand-accent" /> Freshly Baked
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Leaf size={13} className="text-brand-accent" /> 100% Eggless
                </span>
              </div>
            </div>
          </motion.div>
        )
      )}
    </AnimatePresence>
  );
};

export default FloatingOrderCTA;
