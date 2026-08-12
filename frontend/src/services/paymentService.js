const RAZORPAY_SCRIPT_SRC =
  "https://checkout.razorpay.com/v1/checkout.js";

const RAZORPAY_KEY_ID =
  process.env.REACT_APP_RAZORPAY_KEY_ID;

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

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
 * Open Razorpay Checkout using the REAL Razorpay order
 * created by Laravel.
 */
export const openRazorpayCheckout = async ({
  name = "Gharelu Bake",
  description = "Order payment",
  customer = {},
  razorpayOrder,
  onSuccess,
  onFailure,
}) => {
  if (!RAZORPAY_KEY_ID) {
    onFailure?.(
      "Payment is not configured. Missing Razorpay Key ID."
    );
    return;
  }

if (!razorpayOrder?.razorpayOrderId) {
  onFailure?.("Invalid Razorpay order.");
  return;
}

  const sdkReady = await loadRazorpayScript();

  if (!sdkReady) {
    onFailure?.(
      "Could not load the payment gateway. Please check your connection."
    );
    return;
  }

  const options = {
   key: razorpayOrder.razorpayKeyId || RAZORPAY_KEY_ID,

amount: Math.round(Number(razorpayOrder.amount) * 100),

currency: razorpayOrder.currency || "INR",

order_id: razorpayOrder.razorpayOrderId,

    name,
    description,

    prefill: {
      name: customer.name || "",
      email: customer.email || "",
      contact: customer.contact || "",
    },

    notes: {
    local_order_id: razorpayOrder.orderNumber || "",
    },

    theme: {
      color: "#D7869F",
    },

    handler: async (response) => {
      try {
        console.log("RAZORPAY RESPONSE:", response);
        const verification = await verifyPayment({
          ...response,
         orderId: razorpayOrder.orderNumber,
        });

        console.log("VERIFICATION RESPONSE:", verification);
        console.log("VERIFIED VALUE:", verification?.verified);

        if (verification?.verified) {
          onSuccess?.({
            ...response,
            verification,
          });
        } else {
          onFailure?.(
            "We couldn't verify your payment. Please contact support."
          );
        }
      } catch (error) {
        console.error("Payment verification failed:", error);

        onFailure?.(
          "We couldn't verify your payment. Please contact support."
        );
      }
    },

    modal: {
      ondismiss: () => {
        onFailure?.("Payment was cancelled.");
      },
    },
  };

  const razorpay = new window.Razorpay(options);

  razorpay.on("payment.failed", (response) => {
    const reason =
      response?.error?.description ||
      "Payment failed. Please try again.";

    onFailure?.(reason);
  });

  razorpay.open();
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