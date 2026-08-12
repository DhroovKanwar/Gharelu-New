/**
 * Central schema, option lists and message-format helpers for the
 * Customize-Your-Cake feature. Keeping these out of the UI layer means the
 * Laravel backend can share the exact same enum values (via a copy or a
 * config endpoint) with no drift.
 */

import { isValidPhone, isValidPincode } from "../../utils/validators";

export const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Engagement",
  "Baby Shower",
  "Bridal Shower",
  "Retirement",
  "Housewarming",
  "Graduation",
  "Farewell",
  "Promotion",
  "Corporate Event",
  "Office Party",
  "Festival",
  "Mother's Day",
  "Father's Day",
  "Valentine's Day",
  "Friendship Day",
  "Raksha Bandhan",
  "Diwali",
  "Christmas",
  "New Year",
  "Naming Ceremony",
  "Mundan Ceremony",
  "Gender Reveal",
  "Welcome Baby",
  "Romantic Surprise",
  "Congratulations",
  "Get Well Soon",
  "Thank You",
  "Just Because",
  "Other",
];

export const PREFERRED_TIMES = ["Morning", "Afternoon", "Evening", "Custom Time"];

export const GUEST_BUCKETS = ["2–5", "5–10", "10–20", "20–30", "30–50", "50–100", "100+"];

export const DELIVERY_TYPES = ["Delivery", "Pickup"];

export const FLAVOURS = [
  "Chocolate",
  "Belgian Chocolate",
  "Black Forest",
  "Butterscotch",
  "Vanilla",
  "Pineapple",
  "Fresh Fruit",
  "Strawberry",
  "Blueberry",
  "Red Velvet",
  "Rainbow",
  "German Truffle",
  "Lotus Biscoff",
  "Nutella",
  "Coffee",
  "Tiramisu",
  "Coconut",
  "Mango (Seasonal)",
  "Mixed Fruit",
  "Other",
];

export const SHAPES = ["Round", "Heart", "Square", "Rectangle", "Custom Shape"];

export const BUDGETS = [
  "₹500 – ₹1,000",
  "₹1,000 – ₹2,000",
  "₹2,000 – ₹5,000",
  "₹5,000+",
];

/**
 * The canonical initial state for the form. Any UI component reading state
 * should assume every field below is present.
 */
export const initialCustomCakeState = {
  // Step 1 — Customer details
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  // Step 2 — Occasion
  occasion: "",
  otherOccasion: "",
  // Step 3 — Celebration details
  occasionDate: "",
  preferredTime: "",
  customTime: "",
  // Step 4 — Guest count
  peopleCount: "",
  // Step 5 — Delivery / pickup
  deliveryType: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
  // Step 6 — Cake preferences
  flavour: "",
  shape: "",
  theme: "",
  cakeMessage: "",
  eggless: true,
  referenceImage: null, // { url, filename } after upload
  // Step 7 — Budget & notes
  budget: "",
  notes: "",
};

/**
 * Convert the UI state (camelCase) to the API payload (snake_case) — matches
 * the Laravel column names planned for the `custom_cake_requests` table.
 */
export const toApiPayload = (s) => ({
  first_name: s.firstName?.trim(),
  last_name: s.lastName?.trim(),
  phone: s.phone?.trim(),
  email: s.email?.trim() || null,
  occasion: s.occasion,
  other_occasion: s.occasion === "Other" ? (s.otherOccasion || "").trim() : null,
  occasion_date: s.occasionDate || null,
  preferred_time: s.preferredTime || null,
  custom_time: s.preferredTime === "Custom Time" ? (s.customTime || "").trim() : null,
  people_count: s.peopleCount || null,
  delivery_type: s.deliveryType || null,
  address_line_1: s.deliveryType === "Delivery" ? (s.addressLine1 || "").trim() : null,
  address_line_2: s.deliveryType === "Delivery" ? (s.addressLine2 || "").trim() : null,
  city: s.deliveryType === "Delivery" ? (s.city || "").trim() : null,
  state: s.deliveryType === "Delivery" ? (s.state || "").trim() : null,
  pincode: s.deliveryType === "Delivery" ? (s.pincode || "").trim() : null,
  landmark: s.deliveryType === "Delivery" ? (s.landmark || "").trim() : null,
  flavour: s.flavour || null,
  shape: s.shape || null,
  theme: (s.theme || "").trim() || null,
  cake_message: (s.cakeMessage || "").trim() || null,
  eggless: !!s.eggless,
  budget: s.budget || null,
  notes: (s.notes || "").trim() || null,
  reference_image: s.referenceImage?.url || null,
});

/**
 * Build a nicely formatted WhatsApp message from the form state. All labels
 * are kept business-facing so the bakery team gets a ready-to-read summary.
 */
export const buildWhatsappMessage = (s) => {
  const lines = ["Hi GHARELU.BAKE! I'd like to customise a cake:", ""];
  const push = (label, value) => {
    if (value === undefined || value === null || value === "") return;
    if (typeof value === "boolean") value = value ? "Yes" : "No";
    lines.push(`*${label}:* ${value}`);
  };

  push("Name", [s.firstName, s.lastName].filter(Boolean).join(" "));
  push("Phone", s.phone);
  push("Email", s.email);
  lines.push("");
  push("Occasion", s.occasion === "Other" ? s.otherOccasion : s.occasion);
  push("Date", s.occasionDate);
  push(
    "Preferred Time",
    s.preferredTime === "Custom Time" ? s.customTime : s.preferredTime,
  );
  push("Guest Count", s.peopleCount);
  lines.push("");
  push("Order Type", s.deliveryType);
  if (s.deliveryType === "Delivery") {
    push("Address", [s.addressLine1, s.addressLine2].filter(Boolean).join(", "));
    push("City", s.city);
    push("State", s.state);
    push("Pincode", s.pincode);
    push("Landmark", s.landmark);
  }
  lines.push("");
  push("Flavour", s.flavour);
  push("Shape", s.shape);
  push("Theme / Design", s.theme);
  push("Message on Cake", s.cakeMessage);
  push("Eggless", s.eggless);
  push("Budget", s.budget);
  push("Notes", s.notes);
  if (s.referenceImage?.url) {
    lines.push("");
    lines.push("(A reference image was attached to the request.)");
  }
  return lines.filter((_, i, arr) => !(arr[i] === "" && arr[i - 1] === "")).join("\n");
};

/**
 * Convert a raw phone (e.g. "+91 98765 43210") to a wa.me-safe digit string.
 */
export const toWhatsappNumber = (raw) => (raw || "").replace(/\D/g, "");

/**
 * Field-level validation for a given step. Returns { ok, errors }.
 * Each key in `errors` maps to the field name in the UI state.
 */
export const validateStep = (step, s) => {
  const errors = {};
  const isBlank = (v) => !v || !String(v).trim();
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  if (step === 1) {
    if (isBlank(s.firstName)) errors.firstName = "First name is required";
    if (isBlank(s.lastName)) errors.lastName = "Last name is required";
    if (isBlank(s.phone)) errors.phone = "Contact number is required";
    else if (!isValidPhone(s.phone))
      errors.phone = "Enter a valid 10-digit mobile number";
    if (s.email && !isEmail(s.email)) errors.email = "Enter a valid email";
  }
  if (step === 2) {
    if (isBlank(s.occasion)) errors.occasion = "Please pick the occasion";
    if (s.occasion === "Other" && isBlank(s.otherOccasion))
      errors.otherOccasion = "Please specify your occasion";
  }
  if (step === 3) {
    if (isBlank(s.occasionDate)) errors.occasionDate = "Pick the occasion date";
    if (isBlank(s.preferredTime)) errors.preferredTime = "Choose a preferred time";
    if (s.preferredTime === "Custom Time" && isBlank(s.customTime))
      errors.customTime = "Enter a custom time";
  }
  if (step === 4) {
    if (isBlank(s.peopleCount)) errors.peopleCount = "Pick the guest count";
  }
  if (step === 5) {
    if (isBlank(s.deliveryType)) errors.deliveryType = "Choose delivery or pickup";
    if (s.deliveryType === "Delivery") {
      if (isBlank(s.addressLine1)) errors.addressLine1 = "Address line 1 is required";
      if (isBlank(s.city)) errors.city = "City is required";
      if (isBlank(s.state)) errors.state = "State is required";
      if (isBlank(s.pincode)) errors.pincode = "Pincode is required";
      else if (!isValidPincode(s.pincode)) errors.pincode = "Enter a valid 6-digit pincode";
    }
  }
  // Steps 6 and 7 are optional — no required fields.
  return { ok: Object.keys(errors).length === 0, errors };
};