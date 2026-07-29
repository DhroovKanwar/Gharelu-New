import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Minus, Heart, ShoppingBag, Check, Leaf, Truck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import MainLayout from "../layouts/MainLayout";
import Container from "../components/common/Container";
import Section from "../components/common/Section";
import Breadcrumb from "../components/common/Breadcrumb";
import Rating from "../components/common/Rating";
import Button from "../components/common/Button";
import ProductCard from "../components/common/ProductCard";
import QuickViewModal from "../components/common/QuickViewModal";
import NotFound from "./NotFound";
import { products } from "../data/content";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { cn } from "../utils/cn";

const perks = [
  { icon: Leaf, label: "100% Eggless" },
  { icon: Truck, label: "Same-day dispatch" },
  { icon: ShieldCheck, label: "Preservative-free" },
];

export default function ProductDetail() {
  const { id } = useParams();
  const product = useMemo(() => products.find((p) => p.id === id), [id]);
  const { addItem, openCart } = useCart();
  const wishlist = useWishlist();
  const [size, setSize] = useState(product?.sizes?.[0] || null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(product?.gallery?.[0] || product?.image);
  const [quick, setQuick] = useState(null);

  if (!product) return <NotFound />;

  const price = size?.price ?? product.price;
  const related = products.filter((p) => p.collection === product.collection && p.id !== product.id).slice(0, 3);
  const inWishlist = wishlist.has(product.id);

  const handleAdd = () => {
    addItem(product, { size, qty });
    toast.success(`${product.name} added to your box.`);
  };
  const handleBuyNow = () => {
    addItem(product, { size, qty });
    openCart();
  };

  return (
    <MainLayout>
      <div className="bg-brand-secondary/60 py-6">
        <Container>
          <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Catalogue", to: "/catalogue" }, { label: product.name }]} />
        </Container>
      </div>

      <Section className="pt-12 md:pt-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div>
            <motion.div
              key={activeImg}
              initial={{ opacity: 0.4, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden rounded-[2rem] rounded-tr-[7rem] border border-brand-line"
            >
              <img src={activeImg} alt={product.name} className="aspect-[4/5] w-full object-cover" data-testid="product-main-image" />
            </motion.div>
            <div className="mt-4 flex gap-3">
              {(product.gallery || [product.image]).map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(g)}
                  className={cn(
                    "h-20 w-20 overflow-hidden rounded-2xl border-2 transition-colors",
                    activeImg === g ? "border-brand-accent" : "border-transparent hover:border-brand-line",
                  )}
                  data-testid={`product-thumb-${i}`}
                >
                  <img src={g} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="lg:pt-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">{product.collection}</p>
            <h1 className="mt-2 font-heading text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl">{product.name}</h1>
            <div className="mt-3 flex items-center gap-4">
              <Rating value={product.rating} count={product.reviews} size={16} />
              {product.bestseller && <span className="rounded-full bg-brand-primary/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-accent">Bestseller</span>}
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-heading text-3xl font-extrabold text-brand-dark" data-testid="product-price">₹{price}</span>
              {product.oldPrice && <span className="text-lg text-brand-text line-through">₹{product.oldPrice}</span>}
            </div>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-brand-text">{product.longDescription}</p>

            {/* Size */}
            {product.sizes?.length > 0 && (
              <div className="mt-7">
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-brand-dark">Choose size</p>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => setSize(s)}
                      className={cn(
                        "rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
                        size?.label === s.label ? "border-brand-accent bg-brand-accent text-white" : "border-brand-line text-brand-dark hover:border-brand-accent",
                      )}
                      data-testid={`size-${s.label.replace(/\s+/g, "-")}`}
                    >
                      {s.label} · ₹{s.price}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + actions */}
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-4 rounded-full border border-brand-line px-4 py-3">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease" className="text-brand-dark hover:text-brand-accent"><Minus size={16} /></button>
                <span className="w-6 text-center font-semibold text-brand-dark" data-testid="product-qty">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase" className="text-brand-dark hover:text-brand-accent"><Plus size={16} /></button>
              </div>
              <Button onClick={handleAdd} size="lg" icon={<ShoppingBag size={18} />} className="flex-1 min-w-[12rem]" data-testid="product-add-to-cart">
                Add to Box · ₹{price * qty}
              </Button>
              <button
                onClick={() => { wishlist.toggle(product.id); toast(inWishlist ? "Removed from wishlist" : "Saved to wishlist"); }}
                aria-label="Wishlist"
                className={cn("grid h-[54px] w-[54px] place-items-center rounded-full border transition-colors", inWishlist ? "border-brand-accent bg-brand-accent text-white" : "border-brand-line text-brand-dark hover:border-brand-accent")}
                data-testid="product-wishlist"
              >
                <Heart size={20} fill={inWishlist ? "currentColor" : "none"} />
              </button>
            </div>
            <Button onClick={handleBuyNow} variant="dark" size="lg" className="mt-3 w-full" data-testid="product-buy-now">Buy it now</Button>

            {/* Perks */}
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-brand-line pt-6">
              {perks.map((p) => (
                <div key={p.label} className="flex flex-col items-center gap-2 text-center">
                  <p.icon size={20} className="text-brand-accent" />
                  <span className="text-xs font-medium text-brand-dark">{p.label}</span>
                </div>
              ))}
            </div>

            {/* Details */}
            <div className="mt-8 space-y-4 rounded-[1.5rem] bg-brand-secondary p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent">Flavour</p>
                <p className="mt-1 text-sm text-brand-dark">{product.flavour}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent">Ingredients</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.ingredients?.map((ing) => (
                    <span key={ing} className="flex items-center gap-1.5 rounded-full bg-brand-bg px-3 py-1.5 text-xs text-brand-dark">
                      <Check size={12} className="text-brand-accent" /> {ing}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent">Allergens</p>
                <p className="mt-1 text-sm text-brand-dark">{product.allergens?.join(", ")}</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section className="bg-brand-secondary pt-4 md:pt-6">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-brand-dark md:text-4xl">You may also love</h2>
          <div className="mt-10 grid grid-cols-1 gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} showWishlist onQuickView={setQuick} />
            ))}
          </div>
        </Section>
      )}

      <QuickViewModal product={quick} onClose={() => setQuick(null)} />
    </MainLayout>
  );
}
