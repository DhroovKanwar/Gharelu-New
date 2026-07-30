import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { X, Plus, Minus, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../../context/CartContext";
import Button from "../common/Button";
import Rating from "../common/Rating";
import { cn } from "../../utils/cn";

export const QuickViewModal = ({ product, onClose }) => {
  const { addItem } = useCart();
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setSize(product.sizes?.[0] || null);
      setQty(1);
    }
  }, [product]);

  const price = size?.price ?? product?.price ?? 0;

  const handleAdd = () => {
    addItem(product, { size, qty });
    toast.success(`${product.name} added to your box.`);
    onClose();
  };

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-dark/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-[2rem] bg-brand-bg md:grid-cols-2"
            data-testid="quick-view-modal"
          >
            <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-brand-dark backdrop-blur transition-colors hover:bg-brand-primary" data-testid="quick-view-close">
              <X size={18} />
            </button>
            <div className="aspect-[4/5] w-full md:aspect-auto">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col p-7 md:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-accent">{product.collection}</p>
              <h3 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-brand-dark">{product.name}</h3>
              <Rating value={product.rating} count={product.reviews} className="mt-2" />
              <p className="mt-4 text-sm leading-relaxed text-brand-text">{product.longDescription || product.description}</p>

              {product.sizes?.length > 0 && (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-dark">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s.label}
                        onClick={() => setSize(s)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                          size?.label === s.label ? "border-brand-accent bg-brand-accent text-white" : "border-brand-line text-brand-dark hover:border-brand-accent",
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto pt-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-heading text-2xl font-extrabold text-brand-dark">₹{price * qty}</span>
                  <div className="flex items-center gap-3 rounded-full border border-brand-line px-3 py-2">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease"><Minus size={15} /></button>
                    <span className="w-5 text-center font-semibold text-brand-dark">{qty}</span>
                    <button onClick={() => setQty((q) => q + 1)} aria-label="Increase"><Plus size={15} /></button>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleAdd} className="flex-1" data-testid="quick-view-add">Add to Box</Button>
                  <Button as="a" to={`/product/${product.id}`} variant="outline" onClick={onClose} icon={<ArrowRight size={16} />}>Details</Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
