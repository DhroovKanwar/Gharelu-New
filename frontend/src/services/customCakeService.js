/**
 * Customize Your Cake — API-ready service layer.
 *
 * All UI code interacts with the feature EXCLUSIVELY through the functions
 * below. When the Laravel + MySQL backend is ready, swap only these function
 * bodies for real axios calls — the UI will not need any changes.
 *
 * Planned Laravel endpoints:
 *   POST   /api/custom-cake/upload           (multipart)
 *   POST   /api/custom-cake/requests
 *   GET    /api/custom-cake/requests         (admin, filters + pagination)
 *   GET    /api/custom-cake/requests/{id}    (admin)
 *   PATCH  /api/custom-cake/requests/{id}/status
 *   DELETE /api/custom-cake/requests/{id}
 */
import { http } from "./api";

// Local persistence key — useful during frontend-only development so a page
// refresh doesn't lose the draft, and so submitted requests can be reviewed
// locally until the Laravel API is wired up.
const DRAFT_KEY = "gb_customize_cake_draft";
const SUBMISSIONS_KEY = "gb_customize_cake_submissions";

const readLocal = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeLocal = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode — ignore */
  }
};

/**
 * Draft persistence — lets a customer refresh the page without losing work.
 * Purely client-side (localStorage). Not shipped to the backend.
 */
export const draftService = {
  load: () => readLocal(DRAFT_KEY, null),
  save: (draft) => writeLocal(DRAFT_KEY, draft),
  clear: () => {
    if (typeof window !== "undefined") {
      try { window.localStorage.removeItem(DRAFT_KEY); } catch { /* noop */ }
    }
  },
};

/**
 * Upload a reference image for the requested cake.
 *
 * @param {File} file
 * @returns {Promise<{ url: string, filename: string }>}
 *
 * Laravel equivalent (to swap in later):
 *   const form = new FormData();
 *   form.append("file", file);
 *   const { data } = await http.post("/custom-cake/upload", form, {
 *     headers: { "Content-Type": "multipart/form-data" },
 *   });
 *   return data;
 */
export const uploadCakeReferenceImage = async (file) => {
  if (!file) return null;
  // Frontend-only fallback — encode as data URL so it survives page refresh
  // and can be forwarded in the WhatsApp/summary UI as a preview.
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
  return { url: dataUrl, filename: file.name };
};

/**
 * Submit a new custom cake request.
 *
 * Laravel equivalent (to swap in later):
 *   const { data } = await http.post("/custom-cake/requests", payload);
 *   return data;
 *
 * @param {object} payload — shape defined in /features/customizeCake/schema.js
 * @returns {Promise<{ id: string, ...payload }>}
 */
export const submitCustomCakeRequest = async (payload) => {
  // Frontend-only: persist locally with a generated id + timestamps so it can
  // be listed on the future admin panel (or a temporary review screen).
  const now = new Date().toISOString();
  const record = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    status: "new",
    created_at: now,
    updated_at: now,
    ...payload,
  };
  const list = readLocal(SUBMISSIONS_KEY, []);
  list.unshift(record);
  writeLocal(SUBMISSIONS_KEY, list);
  // Simulate network latency so loading states behave like production.
  await new Promise((r) => setTimeout(r, 350));
  return record;
};

/**
 * List all submitted requests (admin). Frontend-only for now.
 *
 * Laravel equivalent (to swap in later):
 *   const { data } = await http.get("/custom-cake/requests", { params });
 *   return data;
 */
export const listCustomCakeRequests = async ({ q = "", status = "", page = 1, limit = 20 } = {}) => {
  const list = readLocal(SUBMISSIONS_KEY, []);
  const filtered = list.filter((r) => {
    if (status && r.status !== status) return false;
    if (q) {
      const s = q.toLowerCase();
      const blob = [r.first_name, r.last_name, r.phone, r.email, r.occasion, r.other_occasion]
        .filter(Boolean).join(" ").toLowerCase();
      if (!blob.includes(s)) return false;
    }
    return true;
  });
  const start = (page - 1) * limit;
  return {
    total: filtered.length,
    page,
    limit,
    items: filtered.slice(start, start + limit),
  };
};

// Kept alongside the shape planned for the backend so future contributors
// can see at a glance which endpoints will replace these bodies.
export const _plannedEndpoints = {
  upload: "POST /api/custom-cake/upload",
  create: "POST /api/custom-cake/requests",
  list: "GET /api/custom-cake/requests",
  detail: "GET /api/custom-cake/requests/{id}",
  updateStatus: "PATCH /api/custom-cake/requests/{id}/status",
  remove: "DELETE /api/custom-cake/requests/{id}",
  _http: http, // re-exported so implementers know which axios instance to use
};
