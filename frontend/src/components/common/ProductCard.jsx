import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Plus, Heart, Eye } from "lucide-react";
import { toast } from "sonner";
import { cn } from "../../utils/cn";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

/**
 * Luxury product card. Arched image frame, spotlight hover, price + slide-up
 * add-to-cart. Optional wishlist heart and quick-view (opt-in via props so the
 * homepage keeps its original minimal look).
 */
export const ProductCard = ({ product, index = 0, showWishlist = false, onQuickView }) => {
  const { name, category, price, image, tag, description } = product;
  const { addItem } = useCart();
  const wishlist = useWishlist();

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(product, { size: product.sizes?.[0] || null, qty: 1 });
    toast.success(`${name} added to your box.`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    wishlist.toggle(product.id);
    toast(wishlist.has(product.id) ? "Removed from wishlist" : "Saved to wishlist");
  };

  const inWishlist = wishlist.has(product.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      className="group relative flex flex-col"
      data-testid={`product-card-${product.id}`}
    >
      <Link to={`/product/${product.id}`} className="relative block overflow-hidden rounded-[1.75rem] rounded-t-[6rem] bg-brand-secondary">
        {tag && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-white/85 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-brand-accent backdrop-blur-sm">
            {tag}
          </span>
        )}
        {showWishlist && (
          <button
            onClick={handleWishlist}
            aria-label="Toggle wishlist"
            className={cn(
              "absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full backdrop-blur-sm transition-colors md:h-10 md:w-10",
              inWishlist ? "bg-brand-accent text-white" : "bg-white/85 text-brand-dark hover:text-brand-accent",
            )}
            data-testid={`wishlist-toggle-${product.id}`}
          >
            <Heart size={16} fill={inWishlist ? "currentColor" : "none"} />
          </button>
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
        {/* slide-up actions */}
        <div className="pointer-events-none absolute inset-x-4 bottom-4 flex translate-y-[130%] gap-2 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={handleAdd}
            className="pointer-events-auto flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-dark py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-accent"
            data-testid={`add-to-cart-${product.id}`}
          >
            <Plus size={16} /> Add · ₹{price}
          </button>
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              aria-label="Quick view"
              className="pointer-events-auto grid h-[46px] w-[46px] shrink-0 place-items-center rounded-full bg-white text-brand-dark transition-colors hover:bg-brand-primary"
              data-testid={`quick-view-${product.id}`}
            >
              <Eye size={18} />
            </button>
          )}
        </div>
      </Link>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-accent">{category}</p>
          <h3 className="mt-1.5 font-heading text-xl font-bold tracking-tight text-brand-dark">
            <Link to={`/product/${product.id}`} className="transition-colors hover:text-brand-accent">
              {name}
            </Link>
          </h3>
          {description && <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-brand-text">{description}</p>}
        </div>
        <div className="flex flex-col items-end">
          <span className="font-heading text-lg font-bold text-brand-dark">₹{price}</span>
          <ArrowUpRight size={20} className="mt-1 text-brand-accent transition-transform duration-300 group-hover:rotate-45" />
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;