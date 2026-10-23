const GENERIC = "Something went wrong. Please try again.";

// Words that mean a technical message slipped through; never show those to a customer.
const TECHNICAL = /server error|exception|sqlstate|stack|trace|undefined|null|unexpected token|json|network ?error|failed to fetch|load failed|fetch|cors|timeout|\.php|vendor\/|<\/?[a-z]/i;

/**
 * Text that is safe to show a customer for a failed request.
 *
 * Only plain `Error`s that our own code threw with the API's message (validation text such as
 * "Please enter a valid pincode") are shown. Browser/network errors (TypeError, SyntaxError, ...)
 * and anything that looks technical become the generic fallback, so internals are never exposed.
 */
export function friendlyError(err, fallback = GENERIC) {
  const message = typeof err?.message === "string" ? err.message.trim() : "";

  if (!message || err?.name !== "Error" || message.length > 200 || TECHNICAL.test(message)) {
    return fallback;
  }

  return message;
}
