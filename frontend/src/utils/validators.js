/**
 * Shared frontend validators.
 *
 * These are intentionally kept in one place (instead of copy-pasted regexes
 * inside each form) for two reasons:
 *   1. Every form that collects the same kind of field (email, phone,
 *      pincode) behaves identically instead of drifting apart over time.
 *   2. When the Laravel backend lands, these are the exact rules it needs
 *      to mirror server-side — client-side validation is a UX convenience,
 *      never a security boundary, so every one of these must be
 *      re-implemented in the Laravel FormRequest that receives the data.
 *
 * [LARAVEL INTEGRATION — matching server-side rules]
 * Suggested Laravel validation rules for the equivalent fields:
 *   'email'   => 'required|email:rfc,dns',
 *   'phone'   => ['required', 'regex:/^[6-9]\d{9}$/'],   // 10-digit Indian mobile
 *   'pincode' => ['required', 'regex:/^[1-9][0-9]{5}$/'], // 6-digit Indian PIN, no leading 0
 * Keep these two lists (frontend + Laravel) in sync whenever one changes.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INDIAN_MOBILE_RE = /^[6-9]\d{9}$/;
const INDIAN_PINCODE_RE = /^[1-9][0-9]{5}$/;

export const isValidEmail = (value) => EMAIL_RE.test(String(value || "").trim());

/**
 * Accepts common real-world formats — "+91 98765 43210", "098765-43210",
 * "9876543210" — by stripping everything but digits and checking the last
 * 10 digits form a valid Indian mobile number (starts 6-9).
 */
export const isValidPhone = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  const last10 = digits.slice(-10);
  return digits.length >= 10 && INDIAN_MOBILE_RE.test(last10);
};

export const isValidPincode = (value) => INDIAN_PINCODE_RE.test(String(value || "").trim());

export const isBlank = (value) => !value || !String(value).trim();