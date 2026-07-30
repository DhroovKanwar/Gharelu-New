import { createContext, useContext, useEffect, useState, useCallback } from "react";

const OrderContext = createContext(null);
const STORAGE_KEY = "gb_order_mode";

const load = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) || null;
  } catch {
    return null;
  }
};

/**
 * Tracks how the guest chose to order (delivery | pickup), selected on the
 * "Start Your Order" page and reflected in the Cake Catalogue.
 */
export const OrderProvider = ({ children }) => {
  const [mode, setModeState] = useState(load);

  useEffect(() => {
    if (mode) localStorage.setItem(STORAGE_KEY, mode);
    else localStorage.removeItem(STORAGE_KEY);
  }, [mode]);

  const setMode = useCallback((m) => setModeState(m), []);
  const clearMode = useCallback(() => setModeState(null), []);

  return (
    <OrderContext.Provider value={{ mode, setMode, clearMode }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx;
};
