import { useEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal, X, Truck, Store } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/common/PageHeader";
import Section from "../components/common/Section";
import CategorySection from "../components/common/CategorySection";
import StickyCategoryTitle from "../components/common/StickyCategoryTitle";
import { products } from "../data/content";
import { useOrder } from "../context/OrderContext";
import { cn } from "../utils/cn";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "name", label: "Name: A–Z" },
];

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function Catalogue() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [activeSlug, setActiveSlug] = useState(null);
  const sectionRefs = useRef({});
  const { mode, setMode } = useOrder();

  // All collections in a stable order
  const collectionOrder = useMemo(
    () => Array.from(new Set(products.map((p) => p.collection))),
    [],
  );

  // Filter + sort products (search filters across sections)
  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q) ||
          (p.flavour || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q),
      );
    }
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "name": list.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return list;
  }, [query, sort]);

  // Group filtered products by collection, keep original order
  const grouped = useMemo(() => {
    const map = new Map();
    collectionOrder.forEach((c) => map.set(c, []));
    filteredProducts.forEach((p) => {
      if (!map.has(p.collection)) map.set(p.collection, []);
      map.get(p.collection).push(p);
    });
    return Array.from(map.entries())
      .map(([name, items]) => ({ name, slug: slugify(name), items }))
      .filter((g) => g.items.length > 0);
  }, [filteredProducts, collectionOrder]);

  // IntersectionObserver — tracks which section is currently active
  useEffect(() => {
    if (!grouped.length) {
      setActiveSlug(null);
      return;
    }

    // rootMargin makes a section "active" when its top crosses ~160px below the top
    // of the viewport (accounts for navbar + sticky title area) and it hasn't yet
    // fully scrolled past ~55% of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the highest intersectionRatio that's currently intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const slug = visible[0].target.dataset.slug;
          if (slug) setActiveSlug(slug);
        }
      },
      {
        rootMargin: "-160px 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    grouped.forEach((g) => {
      const el = sectionRefs.current[g.slug];
      if (el) {
        el.dataset.slug = g.slug;
        observer.observe(el);
      }
    });

    // Default active — first group on mount
    setActiveSlug((prev) => prev || grouped[0].slug);

    return () => observer.disconnect();
  }, [grouped]);

  const scrollToCollection = (slug) => {
    if (slug === "all") {
      const first = grouped[0];
      if (!first) return;
      const el = sectionRefs.current[first.slug];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const el = sectionRefs.current[slug];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeGroup = grouped.find((g) => g.slug === activeSlug);

  return (
    <MainLayout>
      <PageHeader
        eyebrow="The Collection"
        title="Cake Catalogue"
        subtitle="Every bake, 100% eggless and made fresh in small batches. Filter, search and find your next favourite."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Catalogue" }]}
      />

      <Section className="pt-14 md:pt-16">
        {/* Order mode indicator */}
        {mode && (
          <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-brand-line bg-brand-secondary px-5 py-4" data-testid="order-mode-banner">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-bg text-brand-accent">
              {mode === "delivery" ? <Truck size={18} /> : <Store size={18} />}
            </span>
            <div className="mr-auto">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-accent">Ordering for</p>
              <p className="font-heading text-base font-bold text-brand-dark" data-testid="order-mode-value">
                {mode === "delivery" ? "Delivery" : "Pickup"}
              </p>
            </div>
            <button
              onClick={() => setMode(mode === "delivery" ? "pickup" : "delivery")}
              className="rounded-full border border-brand-line bg-brand-bg px-4 py-2 text-sm font-medium text-brand-dark transition-colors hover:border-brand-accent hover:text-brand-accent"
              data-testid="order-mode-switch"
            >
              Switch to {mode === "delivery" ? "Pickup" : "Delivery"}
            </button>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col gap-5 border-b border-brand-line pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-sm">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-accent" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cakes, flavours…"
              className="w-full rounded-full border border-brand-line bg-brand-bg py-3 pl-11 pr-10 text-sm text-brand-dark outline-none transition-shadow placeholder:text-brand-text/50 focus:ring-2 focus:ring-brand-accent"
              data-testid="catalogue-search"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text hover:text-brand-accent" aria-label="Clear">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <SlidersHorizontal size={16} className="text-brand-accent" />
            <label className="sr-only" htmlFor="sort">Sort</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="cursor-pointer rounded-full border border-brand-line bg-brand-bg px-5 py-3 text-sm font-medium text-brand-dark outline-none focus:ring-2 focus:ring-brand-accent"
              data-testid="catalogue-sort"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category chips — scroll to sections + active highlight */}
        <div className="mt-6 flex flex-wrap gap-2.5">
          <button
            onClick={() => scrollToCollection("all")}
            className={cn(
              "rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
              !activeSlug || activeSlug === (grouped[0] && grouped[0].slug)
                ? "border-brand-dark bg-brand-dark text-white"
                : "border-brand-line text-brand-dark hover:border-brand-accent hover:text-brand-accent",
            )}
            data-testid="filter-all"
          >
            All
          </button>
          {collectionOrder.map((c) => {
            const slug = slugify(c);
            const isActive = activeSlug === slug;
            return (
              <button
                key={c}
                onClick={() => scrollToCollection(slug)}
                className={cn(
                  "rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-brand-dark bg-brand-dark text-white"
                    : "border-brand-line text-brand-dark hover:border-brand-accent hover:text-brand-accent",
                )}
                data-testid={`filter-${slug}`}
              >
                {c}
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-sm text-brand-text" data-testid="results-count">
          Showing <span className="font-semibold text-brand-dark">{filteredProducts.length}</span> {filteredProducts.length === 1 ? "creation" : "creations"}
          {grouped.length > 0 && (
            <span> across <span className="font-semibold text-brand-dark">{grouped.length}</span> {grouped.length === 1 ? "collection" : "collections"}</span>
          )}
        </p>

        {/* Category-grouped product sections */}
        {grouped.length === 0 ? (
          <div className="py-24 text-center" data-testid="no-results">
            <p className="font-heading text-2xl font-bold text-brand-dark">No matches found</p>
            <p className="mt-2 text-brand-text">Try a different search or clear the filters.</p>
          </div>
        ) : (
          <div>
            {grouped.map((g) => (
              <CategorySection
                key={g.slug}
                id={g.slug}
                title={g.name}
                products={g.items}
                sectionRef={(el) => {
                  if (el) sectionRefs.current[g.slug] = el;
                }}
              />
            ))}
          </div>
        )}
      </Section>

      {/* Sticky category title (fixed below navbar) */}
      <StickyCategoryTitle active={activeGroup?.name} count={activeGroup?.items.length || 0} />
    </MainLayout>
  );
}
