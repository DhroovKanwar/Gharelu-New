import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LayoutList, ChevronDown } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/common/PageHeader";
import Section from "../components/common/Section";
import { gallery } from "../data/content";
import { cn } from "../utils/cn";

const spanFor = (w) => (w === "tall" ? "row-span-2" : w === "wide" ? "sm:col-span-2" : "");

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * Groups gallery items by their `category` field while preserving the order
 * in which categories first appear in the source data. This mirrors how the
 * future Laravel API will return them (e.g. ORDER BY category_position, id).
 */
const groupByCategory = (items) => {
  const order = [];
  const map = new Map();
  items.forEach((it) => {
    const c = it.category || "Featured";
    if (!map.has(c)) {
      map.set(c, []);
      order.push(c);
    }
    map.get(c).push(it);
  });
  return order.map((name) => ({ name, slug: slugify(name), items: map.get(name) }));
};

export default function GalleryPage() {
  const [active, setActive] = useState(null);
  const [activeSlug, setActiveSlug] = useState(null);
  const [navBottom, setNavBottom] = useState(80);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const sectionRefs = useRef({});
  const rafRef = useRef(null);

  const groups = useMemo(() => groupByCategory(gallery), []);

  const jumpTo = (slug) => {
    const el = sectionRefs.current[slug];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileNavOpen(false);
  };

  // Track navbar bottom so the sticky heading always sits just under it,
  // consistent with the FloatingOrderCTA and StickyCategoryTitle helpers.
  useEffect(() => {
    const nav = document.querySelector('[data-testid="navbar"]');
    if (!nav) return;
    const update = () => {
      const rect = nav.getBoundingClientRect();
      setNavBottom(Math.max(0, Math.round(rect.bottom)));
    };
    const schedule = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        update();
      });
    };
    update();
    const timers = [setTimeout(schedule, 80), setTimeout(schedule, 400), setTimeout(schedule, 1000)];
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

  // IntersectionObserver — the section whose top has crossed just below the
  // navbar becomes active. No scroll listeners are used for section detection.
  useEffect(() => {
    if (!groups.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const slug = visible[0].target.dataset.slug;
          if (slug) setActiveSlug(slug);
        }
      },
      {
        // Section becomes active when its top crosses ~160px below the top of
        // the viewport, and until its bottom passes ~55% up from the bottom.
        rootMargin: "-160px 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );
    groups.forEach((g) => {
      const el = sectionRefs.current[g.slug];
      if (el) {
        el.dataset.slug = g.slug;
        observer.observe(el);
      }
    });
    setActiveSlug((prev) => prev || groups[0].slug);
    return () => observer.disconnect();
  }, [groups]);

  const activeGroup = groups.find((g) => g.slug === activeSlug);

  return (
    <MainLayout>
      <PageHeader
        eyebrow="From Our Kitchen"
        title="The Gallery"
        subtitle="A closer look at the craft — our bakes, our people, and the little moments that make GHARELU.BAKE."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Gallery" }]}
      />

      <Section>
        {groups.map((g) => (
          <section
            key={g.slug}
            id={g.slug}
            ref={(el) => {
              if (el) sectionRefs.current[g.slug] = el;
            }}
            className="scroll-mt-40 pt-6 first:pt-0 md:pt-10"
            data-testid={`gallery-section-${g.slug}`}
          >
            <div className="grid auto-rows-[13rem] grid-cols-2 gap-4 sm:grid-cols-3 md:auto-rows-[16rem]">
              {g.items.map((it, i) => (
                <motion.button
                  key={it.id}
                  initial={{ opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: (i % 6) * 0.05 }}
                  onClick={() => setActive(it.image)}
                  className={cn("group relative overflow-hidden rounded-3xl", spanFor(it.w))}
                  data-testid={`gallery-${it.id}`}
                >
                  <img
                    src={it.image}
                    alt={g.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform [transition-duration:900ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-brand-accent/0 transition-colors duration-500 group-hover:bg-brand-accent/20" />
                </motion.button>
              ))}
            </div>
          </section>
        ))}
      </Section>

      {/* Sticky right-side category navigator — desktop (lg+) */}
      {groups.length > 1 && (
        <nav
          style={{ top: `${navBottom + 24}px` }}
          className="fixed right-6 z-[840] hidden max-h-[70vh] w-56 flex-col gap-1 overflow-y-auto rounded-2xl border border-brand-line bg-brand-bg/95 p-3 shadow-[0_18px_50px_-24px_rgba(215,134,159,0.45)] backdrop-blur-xl lg:flex xl:right-10"
          aria-label="Gallery sections"
          data-testid="gallery-side-nav"
        >
          <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-accent">
            Jump to
          </p>
          {groups.map((g) => {
            const isActive = g.slug === activeSlug;
            return (
              <button
                key={g.slug}
                type="button"
                onClick={() => jumpTo(g.slug)}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-brand-dark text-white"
                    : "text-brand-dark hover:bg-brand-secondary hover:text-brand-accent",
                )}
                data-testid={`gallery-side-nav-${g.slug}`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-colors",
                      isActive ? "bg-brand-primary" : "bg-brand-accent/70 group-hover:bg-brand-accent",
                    )}
                  />
                  <span>{g.name}</span>
                </span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    isActive ? "bg-white/20 text-white" : "bg-brand-secondary text-brand-accent",
                  )}
                >
                  {g.items.length}
                </span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Mobile / tablet — floating "Jump to" toggle + popover */}
      {groups.length > 1 && (
        <div className="fixed right-4 z-[860] lg:hidden" style={{ bottom: "5.5rem" }}>
          <button
            type="button"
            onClick={() => setMobileNavOpen((v) => !v)}
            aria-expanded={mobileNavOpen}
            aria-label="Jump to category"
            className="flex items-center gap-2 rounded-full border border-brand-line bg-brand-bg/95 px-4 py-2.5 font-heading text-xs font-extrabold uppercase tracking-[0.18em] text-brand-dark shadow-[0_18px_45px_-16px_rgba(215,134,159,0.5)] backdrop-blur-xl transition-colors hover:border-brand-accent"
            data-testid="gallery-mobile-nav-toggle"
          >
            <LayoutList size={14} className="text-brand-accent" />
            <span className="max-w-[9rem] truncate">
              {(groups.find((g) => g.slug === activeSlug) || groups[0]).name}
            </span>
            <ChevronDown
              size={14}
              className={cn("text-brand-accent transition-transform duration-300", mobileNavOpen && "rotate-180")}
            />
          </button>
          <AnimatePresence>
            {mobileNavOpen && (
              <motion.nav
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                aria-label="Gallery sections"
                data-testid="gallery-mobile-nav"
                className="absolute bottom-full right-0 mb-2 max-h-[60vh] w-60 overflow-y-auto rounded-2xl border border-brand-line bg-white p-2 shadow-[0_18px_50px_-16px_rgba(215,134,159,0.55)]"
              >
                <p className="px-3 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-accent">
                  Jump to
                </p>
                {groups.map((g) => {
                  const isActive = g.slug === activeSlug;
                  return (
                    <button
                      key={g.slug}
                      type="button"
                      onClick={() => jumpTo(g.slug)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors",
                        isActive
                          ? "bg-brand-dark text-white"
                          : "text-brand-dark hover:bg-brand-secondary hover:text-brand-accent",
                      )}
                      data-testid={`gallery-mobile-nav-${g.slug}`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            isActive ? "bg-brand-primary" : "bg-brand-accent/70",
                          )}
                        />
                        <span>{g.name}</span>
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                          isActive ? "bg-white/20 text-white" : "bg-brand-secondary text-brand-accent",
                        )}
                      >
                        {g.items.length}
                      </span>
                    </button>
                  );
                })}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Sticky category heading — fades between categories as user scrolls */}
      {/* <AnimatePresence>
        {activeGroup && (
          <motion.div
            key="gallery-sticky-title"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ top: `${navBottom + 8}px` }}
            className="pointer-events-none fixed inset-x-0 z-[850] flex justify-center px-4"
            data-testid="gallery-sticky-heading"
          >
            <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-brand-line bg-brand-bg/95 px-5 py-2.5 shadow-[0_14px_36px_-16px_rgba(215,134,159,0.4)] backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeGroup.slug}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="font-heading text-sm font-extrabold uppercase tracking-[0.2em] text-brand-dark"
                  data-testid="gallery-sticky-name"
                >
                  {activeGroup.name}
                </motion.p>
              </AnimatePresence>
              <span className="rounded-full bg-brand-secondary px-2 py-0.5 text-[10px] font-bold text-brand-accent">
                {activeGroup.items.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Lightbox — unchanged */}
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" onClick={() => setActive(null)}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-brand-dark/70 backdrop-blur-sm" />
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              src={active}
              alt="Preview"
              className="relative z-10 max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
            />
            <button className="absolute right-6 top-6 z-20 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-brand-dark" aria-label="Close">
              <X size={20} />
            </button>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
