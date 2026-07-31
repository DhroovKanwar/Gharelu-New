import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GAP = 8;

/**
 * Sticky title that appears just below the navbar showing the currently
 * visible category. Uses only the driven `active` prop from the parent
 * (which is tracked via IntersectionObserver in Catalogue.jsx).
 */
export const StickyCategoryTitle = ({ active, count = 0 }) => {
  const [navBottom, setNavBottom] = useState(80);
  const [showAt, setShowAt] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const nav = document.querySelector('[data-testid="navbar"]');
    if (!nav) return;

    const update = () => {
      const rect = nav.getBoundingClientRect();
      const bottom = Math.max(0, Math.round(rect.bottom));
      setNavBottom(bottom);
      // Only show sticky title once user scrolls past the initial toolbar area
      setShowAt(window.scrollY > 340);
    };

    const schedule = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        update();
      });
    };

    update();
    const timers = [setTimeout(schedule, 60), setTimeout(schedule, 300), setTimeout(schedule, 900)];
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    const observers = [];
    if ("ResizeObserver" in window) {
      const roNav = new ResizeObserver(schedule);
      roNav.observe(nav);
      observers.push(roNav);
      const roBody = new ResizeObserver(schedule);
      roBody.observe(document.body);
      observers.push(roBody);
    }

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observers.forEach((o) => o.disconnect());
      timers.forEach((t) => clearTimeout(t));
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {showAt && active && (
        <motion.div
          key="sticky-cat-title"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{ top: `${navBottom + GAP}px` }}
          className="pointer-events-none fixed inset-x-0 z-[850] flex justify-center px-4"
          data-testid="sticky-category-title"
        >
          <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-brand-line bg-brand-bg/95 px-5 py-2.5 shadow-[0_14px_36px_-16px_rgba(215,134,159,0.4)] backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="font-heading text-sm font-extrabold uppercase tracking-[0.2em] text-brand-dark"
                data-testid="sticky-category-name"
              >
                {active}
              </motion.p>
            </AnimatePresence>
            {count > 0 && (
              <span className="rounded-full bg-brand-secondary px-2 py-0.5 text-[10px] font-bold text-brand-accent">
                {count}
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCategoryTitle;
