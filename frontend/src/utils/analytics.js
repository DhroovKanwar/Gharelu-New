// Anonymous visitor analytics: a random per-browser id, pageviews and clicks.
// No cookies, no IP, no personal data. Honours the browser's Do Not Track setting.

const API_URL = `${process.env.REACT_APP_BACKEND_URL || ""}/api/v1/track`;
const STORAGE_KEY = "gb_visitor_id";
const FLUSH_MS = 3000;
const MAX_BATCH = 20;
const MAX_LABEL = 120;

let queue = [];
let timer = null;
let started = false;
let memoryId = null;

const trackingEnabled = () => typeof navigator !== "undefined" && navigator.doNotTrack !== "1";

const randomId = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID()) ||
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

const visitorId = () => {
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = randomId();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    // Private mode / blocked storage: fall back to an id that lasts for this page load.
    memoryId = memoryId || randomId();
    return memoryId;
  }
};

const flush = () => {
  clearTimeout(timer);
  timer = null;
  if (!queue.length) return;

  const events = queue.splice(0, MAX_BATCH);
  const body = JSON.stringify({ visitor_id: visitorId(), events });
  try {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Analytics must never affect the shop.
  }
  if (queue.length) flush();
};

const push = (type, label) => {
  if (!trackingEnabled() || !label) return;
  queue.push({ type, label: label.slice(0, MAX_LABEL), path: window.location.pathname });
  if (queue.length >= MAX_BATCH) flush();
  else if (!timer) timer = setTimeout(flush, FLUSH_MS);
};

export const trackPageview = (pathname) => push("pageview", pathname || window.location.pathname);

const clickLabel = (el) =>
  (
    el.getAttribute("data-track") ||
    el.getAttribute("aria-label") ||
    el.textContent ||
    el.getAttribute("title") ||
    ""
  )
    .replace(/\s+/g, " ")
    .trim();

/** Starts the global click listener (once). Labels come from data-track, aria-label or the element text. */
export const startClickTracking = () => {
  if (started || typeof document === "undefined") return;
  started = true;

  document.addEventListener(
    "click",
    (e) => {
      const el = e.target instanceof Element ? e.target.closest("a, button, [role='button'], [data-track]") : null;
      if (el) push("click", clickLabel(el));
    },
    true,
  );
  window.addEventListener("pagehide", flush);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
};
