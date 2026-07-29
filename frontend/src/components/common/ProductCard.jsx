import { motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * Luxury product card. Arched image frame, spotlight hover, price + a
 * slide-up "add" affordance. Reusable across Featured / catalog grids.
 */
export const ProductCard = ({ product, index = 0 }) => {
  const { name, category, price, image, tag, description } = product;
  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      className="group relative flex flex-col"
      data-testid={`product-card-${product.id}`}
    >
      <div className="relative overflow-hidden rounded-[1.75rem] rounded-t-[6rem] bg-brand-secondary">
        {tag && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-white/85 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-brand-accent backdrop-blur-sm">
            {tag}
          </span>
        )}
        <div className="aspect-[4/5] w-full overflow-hidden">
          <motion.img
            src={image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover"
            initial={{ scale: 1.05 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.07 }}
          />
        </div>
        {/* slide-up add button */}
        <div className="pointer-events-none absolute inset-x-4 bottom-4 translate-y-[130%] opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <button
            className="pointer-events-auto flex w-full items-center justify-center gap-2 rounded-full bg-brand-dark py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-accent"
            data-testid={`add-to-cart-${product.id}`}
          >
            <Plus size={16} /> Add to Box · ₹{price}
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-accent">
            {category}
          </p>
          <h3 className="mt-1.5 font-heading text-xl font-bold tracking-tight text-brand-dark">
            {name}
          </h3>
          {description && (
            <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-brand-text">
              {description}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className="font-heading text-lg font-bold text-brand-dark">₹{price}</span>
          <ArrowUpRight
            size={20}
            className="mt-1 text-brand-accent transition-transform duration-300 group-hover:rotate-45"
          />
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
