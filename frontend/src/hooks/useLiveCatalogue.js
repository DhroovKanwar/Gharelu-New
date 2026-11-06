import { useEffect, useState } from "react";
import { catalogService } from "../services/api";

// The admin panel is the single source of truth for prices and stock. This loads the
// catalogue once per page load and shares it, so every component reads the same live data.
let pending = null;

export function fetchLiveCatalogue() {
  if (!pending) {
    pending = catalogService
      .getAllProducts()
      .then((res) => Object.fromEntries((res.data || []).map((p) => [p.id, p])))
      .catch((err) => {
        pending = null; // allow a retry on the next call
        throw err;
      });
  }
  return pending;
}

/** Live products keyed by id ({} until loaded, or if the request fails). */
export default function useLiveCatalogue() {
  const [products, setProducts] = useState({});
  useEffect(() => {
    let alive = true;
    fetchLiveCatalogue()
      .then((map) => alive && setProducts(map))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return products;
}
