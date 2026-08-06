import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ArrowRight, Leaf } from "lucide-react";
import { toast } from "sonner";
import { cn } from "../../utils/cn";
import { useWishlist } from "../../context/WishlistContext";

/**
 * Luxury product card for the category-grouped catalogue.
 * 4:5 image, wishlist heart, eggless + status badges, name, price and Order Now.
 */
export const CatalogueProductCard = ({ product, index = 0 }) => {
  const { id, name, category, price, image, tag, bestseller } = product;
  const wishlist = useWishlist();

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    wishlist.toggle(id);
    toast(wishlist.has(id) ? "Removed from wishlist" : "Saved to wishlist");
  };

  const inWishlist = wishlist.has(id);
  const statusLabel = tag || (bestseller ? "Bestseller" : null);

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: (index % 6) * 0.06 }}
      className="group relative flex flex-col"
      data-testid={`catalogue-product-${id}`}
    >
      <Link
        to={`/product/${id}`}
        className="relative block overflow-hidden rounded-[1.5rem] bg-brand-secondary shadow-[0_16px_40px_-24px_rgba(215,134,159,0.4)] transition-shadow duration-500 hover:shadow-[0_28px_60px_-24px_rgba(215,134,159,0.55)]"
      >
        {/* Badges — top-left */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-dark backdrop-blur-sm">
            <Leaf size={11} className="text-brand-accent" /> Eggless
          </span>
          {statusLabel && (
            <span className="inline-flex rounded-full bg-brand-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
              {statusLabel}
            </span>
          )}
        </div>

        {/* Wishlist — top-right */}
        <button
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
          className={cn(
            "absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full backdrop-blur-sm transition-colors md:h-9 md:w-9",
            inWishlist ? "bg-brand-accent text-white" : "bg-white/90 text-brand-dark hover:text-brand-accent",
          )}
          data-testid={`catalogue-wishlist-${id}`}
        >
          <Heart size={15} fill={inWishlist ? "currentColor" : "none"} />
        </button>

        {/* Image 4:5 */}
        <div className="aspect-[4/5] w-full overflow-hidden">
          <motion.img
            src={image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover"
            initial={{ scale: 1.06 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.06 }}
          />
        </div>
      </Link>

      {/* Details */}
      <div className="mt-4 flex flex-col gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-accent">{category}</p>
          <h3 className="mt-1 font-heading text-lg font-extrabold tracking-tight text-brand-dark md:text-xl">
            <Link to={`/product/${id}`} className="transition-colors hover:text-brand-accent">
              {name}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-brand-text">
            Starting at <span className="font-heading text-base font-bold text-brand-dark">₹{price}</span>
          </p>
        </div>

        <Link
          to={`/product/${id}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-dark px-5 py-2.5 font-heading text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-brand-accent"
          data-testid={`catalogue-order-${id}`}
        >
          Order Now <ArrowRight size={14} />
        </Link>
      </div>
    </motion.article>
  );
};

export default CatalogueProductCard;