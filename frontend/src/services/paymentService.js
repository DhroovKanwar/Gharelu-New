const RAZORPAY_SCRIPT_SRC =
  "https://checkout.razorpay.com/v1/checkout.js";

export const RAZORPAY_KEY_ID =
  process.env.REACT_APP_RAZORPAY_KEY_ID;

const API_BASE_URL =
  `${process.env.REACT_APP_BACKEND_URL || ""}/api/v1`;

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
 * Open Razorpay Checkout on top of the current page (full-screen on phones, a centred
 * modal over a dimmed page on desktop) and resolve once the customer is done.
 *
 * Resolves with:
 *  { status: "success", payload }   the payment went through (verify it with the backend)
 *  { status: "failed", reason }     the gateway rejected it and the customer gave up
 *  { status: "cancelled" }          the customer closed the window without paying
 *
 * A failed attempt does NOT end the flow by itself: Razorpay shows its own "Retry" screen,
 * so the customer can try another card/UPI inside the same window. We only remember the
 * last failure reason, in case they then close it.
 */
export const runRazorpayCheckout = async ({ name, description, customer, razorpayOrder }) => {
  const sdkReady = await loadRazorpayScript();
  if (!sdkReady) {
    return { status: "failed", reason: "We couldn't load the payment gateway. Please check your internet connection and try again." };
  }

  const key = razorpayOrder?.razorpayKeyId || RAZORPAY_KEY_ID;
  if (!key || !razorpayOrder?.razorpayOrderId) {
    return { status: "failed", reason: "Online payment isn't available right now. Please contact us to place your order." };
  }

  return new Promise((resolve) => {
    let settled = false;
    let lastFailure = null;

    const settle = (result) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    const razorpay = new window.Razorpay({
      key,
      amount: Math.round(Number(razorpayOrder.amount) * 100),
      currency: razorpayOrder.currency || "INR",
      order_id: razorpayOrder.razorpayOrderId,
      name,
      description,
      prefill: {
        name: customer?.name || "",
        email: customer?.email || "",
        contact: customer?.contact || "",
      },
      notes: { local_order_id: razorpayOrder.orderNumber || "" },
      theme: { color: "#D7869F" },
      retry: { enabled: true },
      handler: (response) => settle({ status: "success", payload: response }),
      modal: {
        // Asks "are you sure?" before the window closes, so a stray tap doesn't lose the payment.
        confirm_close: true,
        escape: false,
        ondismiss: () => settle(lastFailure ? { status: "failed", reason: lastFailure } : { status: "cancelled" }),
      },
    });

    razorpay.on("payment.failed", (response) => {
      lastFailure = response?.error?.description || "The payment could not be completed.";
    });

    razorpay.open();
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