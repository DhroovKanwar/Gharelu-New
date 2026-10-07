import { useEffect, useRef, useState } from "react";
import { Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { loadRazorpayScript, RAZORPAY_KEY_ID } from "../services/paymentService";

/**
 * Standalone popup page — opened via window.open("/payment-window", ...)
 * from Checkout.jsx. Deliberately has no MainLayout (no navbar/footer/
 * floating widgets): this window exists only to run Razorpay Checkout and
 * report the result back to window.opener, see runPaymentInNewWindow in
 * services/paymentService.js for the message protocol both sides speak.
 */
export default function PaymentWindow() {
  const [status, setStatus] = useState("connecting"); // connecting | opening | error
  const [errorMessage, setErrorMessage] = useState("");
  const startedRef = useRef(false);

  useEffect(() => {
    if (!window.opener) {
      setStatus("error");
      setErrorMessage("This window must be opened from the checkout page.");
      return;
    }

    const notifyOpener = (message) => {
      window.opener.postMessage(message, window.location.origin);
      window.close();
    };

    const startPayment = async ({ name, description, customer, razorpayOrder }) => {
      if (startedRef.current) return;
      startedRef.current = true;
      setStatus("opening");

      const sdkReady = await loadRazorpayScript();
      if (!sdkReady) {
        setStatus("error");
        setErrorMessage("Could not load the payment gateway.");
        notifyOpener({ type: "razorpay-failed", reason: "Could not load the payment gateway." });
        return;
      }

      if (!RAZORPAY_KEY_ID || !razorpayOrder?.razorpayOrderId) {
        setStatus("error");
        setErrorMessage("Payment is not configured correctly.");
        notifyOpener({ type: "razorpay-failed", reason: "Invalid Razorpay order." });
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
          name: customer?.name || "",
          email: customer?.email || "",
          contact: customer?.contact || "",
        },
        notes: { local_order_id: razorpayOrder.orderNumber || "" },
        theme: { color: "#D7869F" },
        handler: (response) => {
          notifyOpener({ type: "razorpay-success", payload: response });
        },
        modal: {
          ondismiss: () => {
            notifyOpener({ type: "razorpay-cancelled" });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        const reason = response?.error?.description || "Payment failed. Please try again.";
        notifyOpener({ type: "razorpay-failed", reason });
      });

      razorpay.open();
    };

    const onMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== window.opener) return;
      if (event.data?.type !== "payment-window-init") return;
      clearInterval(readyPing);
      startPayment(event.data.payload || {});
    };

    window.addEventListener("message", onMessage);

    // The opener only starts listening for "ready" once its own order-
    // creation + Razorpay-order-creation awaits resolve, which happens well
    // after this window has mounted — a single ping here would almost
    // always fire before the opener is listening and be lost forever
    // (leaving this window stuck on "Connecting…" until the opener's own
    // 20s timeout kills it). Keep re-announcing until "init" arrives.
    const readyPing = setInterval(() => {
      window.opener.postMessage({ type: "payment-window-ready" }, window.location.origin);
    }, 300);
    window.opener.postMessage({ type: "payment-window-ready" }, window.location.origin);

    return () => {
      window.removeEventListener("message", onMessage);
      clearInterval(readyPing);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 24,
        textAlign: "center",
        background: "#FFFBF7",
        fontFamily: "inherit",
        color: "#2B2320",
      }}
    >
      {status === "error" ? (
        <>
          <AlertTriangle size={36} color="#C17A8F" />
          <p style={{ maxWidth: 320, fontSize: 14, color: "#6b5f5a" }}>{errorMessage}</p>
          <p style={{ fontSize: 12, color: "#9a8d88" }}>You can close this window.</p>
        </>
      ) : (
        <>
          <Loader2 size={36} color="#D68FA3" className="animate-spin" />
          <p style={{ fontWeight: 600 }}>
            {status === "opening" ? "Opening secure payment…" : "Connecting to checkout…"}
          </p>
          <p style={{ maxWidth: 320, fontSize: 13, color: "#6b5f5a", display: "flex", alignItems: "center", gap: 6 }}>
            <ShieldCheck size={15} color="#D68FA3" /> Please don't close this window until payment finishes.
          </p>
        </>
      )}
    </div>
  );
}
