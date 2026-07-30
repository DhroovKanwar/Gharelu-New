import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { products } from "../data/content";

const WishlistContext = createContext(null);
const STORAGE_KEY = "gb_wishlist";

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export const WishlistProvider = ({ children }) => {
  const [ids, setIds] = useState(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  const toggle = useCallback((id) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const has = useCallback((id) => ids.includes(id), [ids]);
  const remove = useCallback((id) => setIds((prev) => prev.filter((x) => x !== id)), []);

  const items = useMemo(() => products.filter((p) => ids.includes(p.id)), [ids]);

  return (
    <WishlistContext.Provider value={{ ids, items, toggle, has, remove, count: ids.length }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};
