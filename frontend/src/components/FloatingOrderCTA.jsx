import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const GAP_BELOW_NAV = 16;

const FloatingOrderCTA = () => {
  const location = useLocation();

const showOnPages = [
  "/",
  "/menu",
  "/customize-cake",
];

  const shouldShow = showOnPages.includes(location.pathname);

  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [navBottom, setNavBottom] = useState(92);
  const rafRef = useRef(null);

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

  // Dynamically track the navbar's bottom edge (handles sticky, scroll, resize, mobile menu open)
  useEffect(() => {
    if (isMobile) return; // desktop-only positioning; mobile is bottom-fixed

    const update = () => {
      const nav = document.querySelector('[data-testid="navbar"]');
      if (!nav) return;
      const rect = nav.getBoundingClientRect();
      const bottom = Math.max(0, Math.round(rect.bottom));
      setNavBottom(bottom);
    };

    const schedule = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        update();
      });
    };

    // Initial + staggered updates to catch late layout shifts
    // (announcement bar, image/font loads, async content above the navbar)
    update();
    const timers = [
      setTimeout(schedule, 50),
      setTimeout(schedule, 200),
      setTimeout(schedule, 600),
      setTimeout(schedule, 1200),
    ];

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);

    const nav = document.querySelector('[data-testid="navbar"]');
    const observers = [];
    if ("ResizeObserver" in window) {
      // Observe navbar itself (its own size)
      if (nav) {
        const roNav = new ResizeObserver(schedule);
        roNav.observe(nav);
        observers.push(roNav);
      }
      // Observe document.body so any layout change ABOVE the navbar
      // (announcement bar collapse/appear, banners, images) recalculates
      const roBody = new ResizeObserver(schedule);
      roBody.observe(document.body);
      observers.push(roBody);
    }

    // MutationObserver on body to catch DOM changes affecting layout
    let mo;
    if ("MutationObserver" in window) {
      mo = new MutationObserver(schedule);
      mo.observe(document.body, { childList: true, subtree: false });
    }

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
      observers.forEach((o) => o.disconnect());
      if (mo) mo.disconnect();
      timers.forEach((t) => clearTimeout(t));
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile]);

  return (
    <AnimatePresence>
      {shouldShow && visible && (
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
            className="fixed inset-x-0 bottom-4 z-[900] flex justify-center px-4 md:hidden"
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
            style={{ top: `${navBottom + GAP_BELOW_NAV}px`, transition: "top 300ms ease" }}
            className="pointer-events-none fixed inset-x-0 z-[900] hidden justify-center px-4 md:flex"
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
