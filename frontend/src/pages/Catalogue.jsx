import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/common/PageHeader";
import Section from "../components/common/Section";
import ProductCard from "../components/common/ProductCard";
import QuickViewModal from "../components/common/QuickViewModal";
import { products } from "../data/content";
import { cn } from "../utils/cn";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "name", label: "Name: A–Z" },
];

export default function Catalogue() {
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState("All");
  const [sort, setSort] = useState("featured");
  const [quick, setQuick] = useState(null);

  const collections = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.collection)))],
    [],
  );

  const results = useMemo(() => {
    let list = [...products];
    if (collection !== "All") list = list.filter((p) => p.collection === collection);
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
  }, [query, collection, sort]);

  return (
    <MainLayout>
      <PageHeader
        eyebrow="The Collection"
        title="Cake Catalogue"
        subtitle="Every bake, 100% eggless and made fresh in small batches. Filter, search and find your next favourite."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Catalogue" }]}
      />

      <Section className="pt-14 md:pt-16">
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

        {/* Category chips */}
        <div className="mt-6 flex flex-wrap gap-2.5">
          {collections.map((c) => (
            <button
              key={c}
              onClick={() => setCollection(c)}
              className={cn(
                "rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
                collection === c ? "border-brand-dark bg-brand-dark text-white" : "border-brand-line text-brand-dark hover:border-brand-accent hover:text-brand-accent",
              )}
              data-testid={`filter-${c.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {c}
            </button>
          ))}
        </div>

        <p className="mt-6 text-sm text-brand-text" data-testid="results-count">
          Showing <span className="font-semibold text-brand-dark">{results.length}</span> {results.length === 1 ? "creation" : "creations"}
        </p>

        {/* Grid */}
        {results.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-heading text-xl font-bold text-brand-dark">No matches found</p>
            <p className="mt-2 text-brand-text">Try a different search or clear the filters.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} showWishlist onQuickView={setQuick} />
            ))}
          </div>
        )}
      </Section>

      <QuickViewModal product={quick} onClose={() => setQuick(null)} />
    </MainLayout>
  );
}
