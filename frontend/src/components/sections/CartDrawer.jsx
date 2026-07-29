import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext";
import Button from "../common/Button";

export const CartDrawer = () => {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal, count } = useCart();
  const freeShipThreshold = 1500;
  const remaining = Math.max(0, freeShipThreshold - subtotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-brand-dark/40 backdrop-blur-sm"
            data-testid="cart-overlay"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-brand-bg shadow-2xl"
            data-testid="cart-drawer"
          >
            <div className="flex items-center justify-between border-b border-brand-line px-6 py-5">
              <h3 className="flex items-center gap-2 font-heading text-xl font-extrabold text-brand-dark">
                <ShoppingBag size={20} /> Your Box ({count})
              </h3>
              <button onClick={closeCart} aria-label="Close cart" className="grid h-10 w-10 place-items-center rounded-full border border-brand-line text-brand-dark transition-colors hover:bg-brand-secondary" data-testid="cart-close">
                <X size={18} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-brand-secondary text-brand-accent">
                  <ShoppingBag size={30} />
                </div>
                <p className="font-heading text-lg font-bold text-brand-dark">Your box is empty</p>
                <p className="max-w-xs text-sm text-brand-text">Add a little sweetness — our bakes are freshly waiting for you.</p>
                <Button as="a" onClick={closeCart} to="/catalogue" className="mt-2">Browse Cakes</Button>
              </div>
            ) : (
              <>
                <div className="border-b border-brand-line bg-brand-secondary px-6 py-3 text-center text-sm text-brand-dark">
                  {remaining > 0 ? (
                    <>Add <span className="font-semibold">₹{remaining}</span> more for <span className="font-semibold">free delivery</span></>
                  ) : (
                    <span className="font-semibold text-brand-accent">You've unlocked free delivery! 🎉</span>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-5" data-lenis-prevent>
                  <ul className="space-y-5">
                    {items.map((i) => (
                      <li key={i.lineId} className="flex gap-4" data-testid={`cart-item-${i.id}`}>
                        <img src={i.image} alt={i.name} className="h-24 w-20 shrink-0 rounded-2xl object-cover" />
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-heading text-sm font-bold text-brand-dark">{i.name}</p>
                              {i.size && <p className="text-xs text-brand-text">{i.size}</p>}
                            </div>
                            <button onClick={() => removeItem(i.lineId)} aria-label="Remove" className="text-brand-text transition-colors hover:text-brand-accent" data-testid={`cart-remove-${i.id}`}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-3 rounded-full border border-brand-line px-2 py-1">
                              <button onClick={() => updateQty(i.lineId, i.qty - 1)} aria-label="Decrease" className="text-brand-dark hover:text-brand-accent"><Minus size={14} /></button>
                              <span className="w-5 text-center text-sm font-semibold text-brand-dark">{i.qty}</span>
                              <button onClick={() => updateQty(i.lineId, i.qty + 1)} aria-label="Increase" className="text-brand-dark hover:text-brand-accent"><Plus size={14} /></button>
                            </div>
                            <span className="font-heading font-bold text-brand-dark">₹{i.price * i.qty}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-brand-line px-6 py-5">
                  <div className="flex items-center justify-between">
                    <span className="text-brand-text">Subtotal</span>
                    <span className="font-heading text-2xl font-extrabold text-brand-dark">₹{subtotal}</span>
                  </div>
                  <p className="mt-1 text-xs text-brand-text">Taxes & delivery calculated at checkout.</p>
                  <Button as="a" to="/checkout" onClick={closeCart} size="lg" className="mt-4 w-full" icon={<ArrowRight size={18} />} data-testid="cart-checkout">
                    Checkout
                  </Button>
                  <button onClick={closeCart} className="mt-3 w-full text-center text-sm font-medium text-brand-text transition-colors hover:text-brand-accent">
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
