/**
 * API-ready service layer.
 *
 * Right now every method resolves local dummy data, simulating a network
 * request. When the backend is ready, swap the bodies for real `axios`
 * calls to `${API}/...` — component code never changes.
 */
import axios from "axios";
import * as content from "../data/content";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const http = axios.create({ baseURL: API });

// Simulate latency so loading states behave like production
const mock = (data, delay = 250) =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

export const catalogService = {
  getFeaturedCakes: () => mock(content.featuredCakes),
  getCategories: () => mock(content.categories),
  getTestimonials: () => mock(content.testimonials),
  getEvents: () => mock(content.events),
  getGallery: () => mock(content.gallery),
  getInstagram: () => mock(content.instagram),
  getFaqs: () => mock(content.faqs),
};

export const leadService = {
  // Newsletter signup — API-ready
  subscribe: async (email) => {
    // return http.post("/newsletter/subscribe", { email });
    return mock({ ok: true, email });
  },
  // Contact / order enquiry — API-ready
  sendEnquiry: async (payload) => {
    // return http.post("/enquiries", payload);
    return mock({ ok: true, ...payload });
  },
};
