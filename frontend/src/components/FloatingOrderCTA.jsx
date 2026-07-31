import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

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
    const t = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        isMobile ? (
          <motion.div
            key="cta-mobile"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: [0, -3, 0] }}
            exit={{ opacity: 0, y: 60 }}
            transition={{
              opacity: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
              y: { duration: 3.2, repeat: Infinity, repeatType: "loop", ease: "easeInOut", delay: 0.5 },
            }}
            className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 md:hidden"
            data-testid="floating-order-cta-mobile"
          >
            <Link
              to="/order"
              className="inline-flex w-full max-w-[420px] items-center justify-center gap-2 rounded-full bg-brand-accent px-6 py-3.5 font-heading text-base font-bold text-white shadow-[0_16px_40px_-12px_rgba(215,134,159,0.7)] transition-all duration-300 hover:scale-[1.03] hover:bg-brand-dark hover:shadow-[0_20px_50px_-12px_rgba(215,134,159,0.85)]"
              data-testid="floating-order-cta-btn-mobile"
            >
              Order Now <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="cta-desktop"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: [0, -4, 0] }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              opacity: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
              y: { duration: 4, repeat: Infinity, repeatType: "loop", ease: "easeInOut", delay: 0.5 },
            }}
            className="pointer-events-none fixed inset-x-0 top-[92px] z-40 hidden justify-center px-4 md:flex"
            data-testid="floating-order-cta-desktop"
          >
            <Link
              to="/order"
              className="pointer-events-auto inline-flex items-center justify-center gap-2 rounded-full bg-brand-accent px-8 py-3.5 font-heading text-base font-bold text-white shadow-[0_16px_40px_-12px_rgba(215,134,159,0.65)] transition-all duration-300 hover:scale-[1.03] hover:bg-brand-dark hover:shadow-[0_22px_55px_-12px_rgba(215,134,159,0.85)]"
              data-testid="floating-order-cta-btn"
            >
              Order Now <ArrowRight size={18} />
            </Link>
          </motion.div>
        )
      )}
    </AnimatePresence>
  );
};

export default FloatingOrderCTA;
