/**
 * Razorpay payment service — frontend-only, Test Mode.
 *
 * This mirrors the mock-first pattern already used in `services/api.js` and
 * `services/customCakeService.js`: every function here that will eventually
 * call the Laravel backend is clearly marked with a `[LARAVEL INTEGRATION]`
 * comment showing the exact endpoint and payload shape it will call. Until
 * then, order creation and payment verification are simulated on the
 * frontend so the checkout flow is fully testable against Razorpay's real
 * Test Mode popup without a backend.
 *
 * IMPORTANT — current limitation (frontend-only Test Mode):
 * Razorpay's Standard Checkout can be opened two ways:
 *   1. With a real `order_id`, created server-side via Razorpay's Orders
 *      API (the secure, production-correct way — required for live mode).
 *   2. With just an `amount` + `currency` (no `order_id`) — a simpler mode
 *      Razorpay supports for quick integration/testing, but NOT recommended
 *      for production because the amount is trusted from the client.
 *
 * Because we're explicitly not integrating Laravel yet, this service uses
 * mode (2) so the full Razorpay Test Mode popup (Card / UPI / Netbanking
 * selection, OTP, success/failure) can be exercised end-to-end today.
 * Swapping to mode (1) is the main change required when Laravel lands —
 * see the `[LARAVEL INTEGRATION]` comments below for exactly where.
 */

const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";
const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID;

let scriptLoadPromise = null;

/**
 * Dynamically load the Razorpay Checkout SDK exactly once, regardless of
 * how many times this is called. Returns true if the SDK is ready to use,
 * false if it failed to load (e.g. offline, ad-blocker, network error).
 */
export const loadRazorpayScript = () => {
  if (window.Razorpay) return Promise.resolve(true);

  if (!scriptLoadPromise) {
    scriptLoadPromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = RAZORPAY_SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        scriptLoadPromise = null; // allow retry on next call
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  return scriptLoadPromise;
};

/**
 * Create a "payment order" for the given amount.
 *
 * Frontend-only (current): generates a local reference id so the rest of
 * the flow (receipts, order records, UI) has something stable to key off
 * of, and simulates a small network delay so loading states behave like
 * production.
 *
 * [LARAVEL INTEGRATION — Order Creation]
 * Replace the body of this function with:
 *   const { data } = await http.post("/payments/create-order", {
 *     amount, currency, receipt,
 *   });
 *   return data; // { id: "order_...", amount, currency, receipt }
 * The Laravel endpoint should call Razorpay's Orders API
 * (POST https://api.razorpay.com/v1/orders) server-side using the Razorpay
 * secret key, and return the real `order_id` to the frontend. That real
 * `order_id` then gets passed into `openRazorpayCheckout()` below instead
 * of being omitted — see the note there.
 *
 * @param {{ amount: number, currency?: string, receipt?: string }} params
 *   `amount` is in the smallest currency unit's *display* form (e.g. rupees,
 *   not paise) — this function handles the paise conversion internally.
 */
export const createPaymentOrder = async ({ amount, currency = "INR", receipt } = {}) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    id: `local_order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    amount,
    currency,
    receipt: receipt || null,
  };
};

/**
 * Open the Razorpay Test Mode checkout popup.
 *
 * @param {object} args
 * @param {number} args.amount - Amount in rupees (converted to paise here).
 * @param {string} [args.currency]
 * @param {string} args.name - Business/brand name shown in the popup header.
 * @param {string} [args.description] - Short line describing the order.
 * @param {{ name?: string, email?: string, contact?: string }} [args.customer]
 *   Prefill values — improves the Test Mode UX but is never required.
 * @param {object} [args.localOrder] - The object returned by createPaymentOrder().
 * @param {(response: object) => void} args.onSuccess
 *   Called with Razorpay's response object after a successful payment AND
 *   successful verification (see verifyPayment below).
 * @param {(reason: string) => void} args.onFailure
 *   Called when the payment fails, is cancelled, or verification fails.
 *   `reason` is a short, user-safe message suitable for a toast.
 */
export const openRazorpayCheckout = async ({
  amount,
  currency = "INR",
  name = "Gharelu Bake",
  description = "Order payment",
  customer = {},
  localOrder = null,
  onSuccess,
  onFailure,
}) => {
  if (!RAZORPAY_KEY_ID) {
    onFailure?.(
      "Payment is not configured yet (missing REACT_APP_RAZORPAY_KEY_ID). Please contact support."
    );
    return;
  }

  const sdkReady = await loadRazorpayScript();
  if (!sdkReady) {
    onFailure?.("Could not load the payment gateway. Please check your connection and try again.");
    return;
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: Math.round(amount * 100), // Razorpay expects paise
    currency,
    name,
    description,

    // [LARAVEL INTEGRATION — Order Creation]
    // Once createPaymentOrder() above returns a real Razorpay order_id from
    // the backend, pass it here as `order_id: localOrder.id`. Razorpay will
    // then validate the amount/currency server-side against that order,
    // which is what makes the amount trustworthy in production. Right now
    // this is intentionally omitted because `localOrder.id` is a
    // frontend-generated placeholder, not a real Razorpay order id.
    // order_id: localOrder?.id,

    prefill: {
      name: customer.name || "",
      email: customer.email || "",
      contact: customer.contact || "",
    },
    notes: {
      local_order_reference: localOrder?.id || "",
    },
    theme: {
      color: "#D7869F", // brand-accent, matches tailwind.config.js
    },

    handler: async (response) => {
      // response: { razorpay_payment_id, razorpay_order_id?, razorpay_signature? }
      // (order_id/signature are only present once real Orders API + server
      // verification are wired up — see verifyPayment below.)
      try {
        const verification = await verifyPayment(response, localOrder);
        if (verification.verified) {
          onSuccess?.({ ...response, localOrder });
        } else {
          onFailure?.("We couldn't verify your payment. Please contact support before retrying.");
        }
      } catch (err) {
        onFailure?.("We couldn't verify your payment. Please contact support before retrying.");
      }
    },

    modal: {
      // Fires when the user closes the popup without completing payment.
      ondismiss: () => {
        onFailure?.("Payment was cancelled.");
      },
    },
  };

  const razorpay = new window.Razorpay(options);

  // Fires for explicit payment failures (declined card, insufficient funds
  // in test mode, etc.) as opposed to the user just closing the modal.
  razorpay.on("payment.failed", (resp) => {
    const reason = resp?.error?.description || "Payment failed. Please try again.";
    onFailure?.(reason);
  });

  razorpay.open();
};

/**
 * Verify a completed payment.
 *
 * Frontend-only (current): Test Mode payments that reach the `handler`
 * callback at all have already succeeded on Razorpay's side, so this just
 * confirms a payment id came back — there is no signature to check yet
 * because we never had a real backend-created order to sign against.
 *
 * [LARAVEL INTEGRATION — Signature & Payment Verification]
 * Replace the body of this function with:
 *   const { data } = await http.post("/payments/verify", {
 *     razorpay_payment_id: response.razorpay_payment_id,
 *     razorpay_order_id: response.razorpay_order_id,
 *     razorpay_signature: response.razorpay_signature,
 *   });
 *   return data; // { verified: boolean, order: {...} }
 * The Laravel endpoint should recompute the HMAC-SHA256 signature using the
 * Razorpay secret key (`razorpay_order_id + "|" + razorpay_payment_id`) and
 * compare it against `razorpay_signature`. This is the step that actually
 * makes the payment trustworthy — never trust `handler` firing alone in
 * production.
 *
 * [LARAVEL INTEGRATION — Order Persistence]
 * Once verification succeeds, the Laravel endpoint (or a follow-up call
 * from here) should persist the order server-side — this is also where
 * H1's cart/checkout backend work from the roadmap connects in. The
 * frontend `placeOrder()` flow in Checkout.jsx will stay the same shape;
 * only this function's internals change.
 */
export const verifyPayment = async (response, localOrder) => {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const verified = Boolean(response?.razorpay_payment_id);
  return { verified, order: localOrder };
};

export const _plannedEndpoints = {
  createOrder: "POST /api/payments/create-order",
  verify: "POST /api/payments/verify",
};
