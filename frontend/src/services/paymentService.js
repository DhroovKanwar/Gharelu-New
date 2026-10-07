const RAZORPAY_SCRIPT_SRC =
  "https://checkout.razorpay.com/v1/checkout.js";

export const RAZORPAY_KEY_ID =
  process.env.REACT_APP_RAZORPAY_KEY_ID;

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8001/api/v1";

let scriptLoadPromise = null;

const getHeaders = () => {
  const token = localStorage.getItem("auth_token");

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Load Razorpay Checkout SDK once.
 */
export const loadRazorpayScript = () => {
  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  if (!scriptLoadPromise) {
    scriptLoadPromise = new Promise((resolve) => {
      const script = document.createElement("script");

      script.src = RAZORPAY_SCRIPT_SRC;
      script.async = true;

      script.onload = () => resolve(true);

      script.onerror = () => {
        scriptLoadPromise = null;
        resolve(false);
      };

      document.body.appendChild(script);
    });
  }

  return scriptLoadPromise;
};

/**
 * Create Razorpay order through Laravel.
 *
 * IMPORTANT:
 * We only send our local order ID.
 * Amount is calculated by Laravel from the database.
 */
export const createPaymentOrder = async ({ orderId } = {}) => {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/payments/create-order`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        order_number: orderId,
      }),
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      responseData?.message ||
        "Unable to create payment order."
    );
  }

  return responseData.data;
};

/**
 * Open a popup window (must already be open — see PaymentWindow.jsx / the
 * note in Checkout.jsx about calling window.open() synchronously before any
 * await, or popup blockers will kill it) and hand it everything it needs to
 * run Razorpay Checkout itself. This keeps the payment UI in its own window
 * — separate from the checkout form — while this function resolves only
 * once the child window reports a final result (or is closed), so the
 * caller can lock the checkout page for the whole in-between period.
 *
 * Protocol (all messages same-origin only):
 *  child -> opener  "payment-window-ready"   (child mounted, waiting for data)
 *  opener -> child  "payment-window-init"    (name/description/customer/order)
 *  child -> opener  "razorpay-success"       { payload: <razorpay handler response> }
 *  child -> opener  "razorpay-failed"        { reason }
 *  child -> opener  "razorpay-cancelled"     (modal dismissed in the child)
 */
export const runPaymentInNewWindow = (paymentWindow, { name, description, customer, razorpayOrder }) => {
  return new Promise((resolve) => {
    let settled = false;

    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      clearInterval(closedPoll);
      clearTimeout(readyTimeout);
    };

    const settle = (result) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(result);
    };

    const onMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== paymentWindow) return;

      const { type, payload, reason } = event.data || {};

      if (type === "payment-window-ready") {
        paymentWindow.postMessage(
          { type: "payment-window-init", payload: { name, description, customer, razorpayOrder } },
          window.location.origin,
        );
      } else if (type === "razorpay-success") {
        settle({ status: "success", payload });
      } else if (type === "razorpay-failed") {
        settle({ status: "failed", reason: reason || "Payment could not be completed." });
      } else if (type === "razorpay-cancelled") {
        settle({ status: "cancelled" });
      }
    };

    // The user can close the popup with the window chrome's own [x] instead
    // of Razorpay's cancel button — that never sends us a message, so we
    // have to notice it ourselves.
    const closedPoll = setInterval(() => {
      if (paymentWindow.closed) settle({ status: "cancelled" });
    }, 700);

    // The child failed to load / script blocked / etc. — don't lock the
    // checkout page forever waiting for a "ready" that's never coming.
    const readyTimeout = setTimeout(() => {
      settle({ status: "failed", reason: "Payment window did not respond. Please try again." });
      try {
        paymentWindow.close();
      } catch {
        // ignore — window may already be gone
      }
    }, 20000);

    window.addEventListener("message", onMessage);
  });
};

/**
 * Verify Razorpay payment through Laravel.
 *
 * Laravel performs the actual HMAC-SHA256 verification.
 */
export const verifyPayment = async ({
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature,
  orderId,
}) => {
  const response = await fetch(
    `${API_BASE_URL}/payments/verify`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        order_id: orderId,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      }),
    }
  );

  const data = await response.json();
console.log("VERIFY API STATUS:", response.status);
console.log("VERIFY API RESPONSE:", data);
  if (!response.ok) {
    throw new Error(
      data?.message || "Payment verification failed."
    );
  }

return {
  verified: data?.data?.paymentStatus === "paid",
  order: data?.data,
};
};