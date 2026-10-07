const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8001/api/v1";

/**
 * Look up guest orders by phone number — matches whatever number was
 * entered at checkout, formatted or not (see OrderController::lookup on
 * the backend, which compares the last 10 digits only).
 */
export const lookupOrdersByPhone = async (phone) => {
  const response = await fetch(`${API_BASE_URL}/orders/lookup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ phone }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Unable to look up orders.");
  }

  return data.data || [];
};
