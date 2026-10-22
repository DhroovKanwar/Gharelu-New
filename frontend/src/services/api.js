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

// export const catalogService = {
//   getFeaturedCakes: () => mock(content.featuredCakes),
//   getCategories: () => mock(content.categories),
//   getTestimonials: () => mock(content.testimonials),
//   getEvents: () => mock(content.events),
//   getGallery: () => mock(content.gallery),
//   getInstagram: () => mock(content.instagram),
//   getFaqs: () => mock(content.faqs),
// };

export const catalogService = {
getProducts: async (params = {}) => {
  const response = await http.get("/v1/products", { params });
  return response.data;
},

// The API is paginated (max 50 per page); the menu needs every product.
getAllProducts: async () => {
  const first = await catalogService.getProducts({ per_page: 50, page: 1 });
  const lastPage = first.meta?.last_page ?? 1;
  const items = [...(first.data || [])];
  for (let page = 2; page <= lastPage; page += 1) {
    const next = await catalogService.getProducts({ per_page: 50, page });
    items.push(...(next.data || []));
  }
  return { ...first, data: items };
},

getFeaturedCakes: async () => {
  const response = await http.get("/v1/products/featured");
  return response.data;
},

getBestsellers: async () => {
  const response = await http.get("/v1/products/bestsellers");
  return response.data;
},

getProduct: async (slug) => {
  const response = await http.get(`/v1/products/${slug}`);
  return response.data;
},

getCategories: async () => {
  const response = await http.get("/v1/categories");
  return response.data;
},
};

export const leadService = {
  // Newsletter signup (saved in the admin panel's Newsletter list)
  subscribe: async (email) => {
    const response = await http.post("/v1/newsletter/subscribe", { email });
    return response.data;
  },
  // Contact form (saved in the admin panel's Enquiries list)
  sendEnquiry: async ({ firstName, lastName, email, phone, message }) => {
    const response = await http.post("/v1/enquiries", {
      name: `${firstName} ${lastName}`.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      message: message.trim(),
      source_page: "contact",
    });
    return response.data;
  },
};
