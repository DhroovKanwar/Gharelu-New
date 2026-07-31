import { motion } from "framer-motion";
import CatalogueProductCard from "./CatalogueProductCard";

/**
 * A single category section that displays a big title and a grid of products.
 * Assigns an id so category chips can smooth-scroll here.
 */
export const CategorySection = ({ id, title, products = [], sectionRef }) => {
  if (!products.length) return null;

  return (
    <section
      ref={sectionRef}
      id={id}
      className="scroll-mt-32 pt-14 md:pt-20"
      data-testid={`category-section-${id}`}
    >
      <div className="mb-8 flex items-end justify-between gap-4 border-b border-brand-line pb-5 md:mb-10 md:pb-6">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-accent"
          >
            The Collection
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="mt-2 font-heading text-3xl font-extrabold uppercase tracking-tight text-brand-dark md:text-5xl"
          >
            {title}
          </motion.h2>
        </div>
        <p className="pb-1 font-heading text-sm font-bold text-brand-text md:text-base">
          {products.length} {products.length === 1 ? "creation" : "creations"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <CatalogueProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
