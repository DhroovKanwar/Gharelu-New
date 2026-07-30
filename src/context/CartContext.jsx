import { createContext, useContext, useEffect, useMemo, useReducer, useState, useCallback } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "gb_cart";

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { product, size, qty } = action;
      const lineId = `${product.id}__${size?.label || "default"}`;
      const existing = state.find((i) => i.lineId === lineId);
      if (existing) {
        return state.map((i) =>
          i.lineId === lineId ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [
        ...state,
        {
          lineId,
          id: product.id,
          name: product.name,
          image: product.image,
          collection: product.collection,
          size: size?.label || null,
          price: size?.price ?? product.price,
          qty,
        },
      ];
    }
    case "REMOVE":
      return state.filter((i) => i.lineId !== action.lineId);
    case "QTY":
      return state
        .map((i) => (i.lineId === action.lineId ? { ...i, qty: Math.max(1, action.qty) } : i))
        .filter((i) => i.qty > 0);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [items, dispatch] = useReducer(reducer, undefined, load);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, { size = null, qty = 1 } = {}) => {
    dispatch({ type: "ADD", product, size, qty });
    setIsOpen(true);
  }, []);
  const removeItem = useCallback((lineId) => dispatch({ type: "REMOVE", lineId }), []);
  const updateQty = useCallback((lineId, qty) => dispatch({ type: "QTY", lineId, qty }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const { count, subtotal } = useMemo(
    () => ({
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((s, i) => s + i.price * i.qty, 0),
    }),
    [items],
  );

  const value = {
    items,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    count,
    subtotal,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
