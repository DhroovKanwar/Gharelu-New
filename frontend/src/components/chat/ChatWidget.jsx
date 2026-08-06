import { useState, useRef, useEffect } from "react";

// const API_URL = "/api/chat"; // Laravel backend route
const API_URL = "http://localhost:8000/api/chat";
// Brand colors — matched to the Gharelu.Bake site theme
const ROSE = "#D68FA3";
const ROSE_DARK = "#C17A8F";
const ROSE_LIGHT = "#FCEEF2";
const CREAM = "#FFFBF7";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! Welcome to Gharelu.Bake 🎀 Ask me about our cakes, custom orders, or delivery — happy to help!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    // Mobile: bottom-44 (11rem) clears both the full-width "Order Now" bar
    // (bottom-4, mobile-only on Home/Menu/Customize Cake) and the
    // FloatingContactWidget (bottom-6.5rem) — see FloatingContactWidget.jsx
    // and FloatingOrderCTA.jsx for the matching offsets. Desktop keeps the
    // original bottom-6/right-6 (24px/24px) position unchanged.
    <div
      className="fixed z-50 bottom-44 right-4 md:bottom-6 md:right-6"
      style={{ fontFamily: "inherit" }}
    >
      {isOpen ? (
        <div
          className="w-[calc(100vw-2rem)] max-w-[360px] h-[70vh] max-h-[480px]"
          style={{
            background: CREAM,
            borderRadius: 20,
            boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: `1px solid ${ROSE_LIGHT}`,
          }}
        >
          {/* Header */}
          <div
            style={{
              background: ROSE,
              color: "white",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ChatBubbleIcon size={18} color="white" filled />
              <span style={{ fontWeight: 600, letterSpacing: "0.02em" }}>Gharelu.Bake</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.85)",
                fontSize: 18,
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              background: ROSE_LIGHT,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "9px 13px",
                    borderRadius: 16,
                    fontSize: 14,
                    lineHeight: 1.4,
                    ...(msg.role === "user"
                      ? {
                          background: ROSE,
                          color: "white",
                          borderBottomRightRadius: 4,
                        }
                      : {
                          background: "white",
                          color: "#3a2c30",
                          border: `1px solid ${ROSE_LIGHT}`,
                          borderBottomLeftRadius: 4,
                        }),
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    background: "white",
                    border: `1px solid ${ROSE_LIGHT}`,
                    padding: "9px 13px",
                    borderRadius: 16,
                    borderBottomLeftRadius: 4,
                    fontSize: 14,
                    color: ROSE_DARK,
                  }}
                >
                  Typing...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              padding: 12,
              background: "white",
              borderTop: `1px solid ${ROSE_LIGHT}`,
              display: "flex",
              gap: 8,
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: "9px 14px",
                borderRadius: 999,
                border: `1px solid ${ROSE_LIGHT}`,
                fontSize: 14,
                outline: "none",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              aria-label="Send message"
              style={{
                background: ROSE,
                border: "none",
                color: "white",
                width: 36,
                height: 36,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                opacity: loading ? 0.5 : 1,
                flexShrink: 0,
              }}
            >
              <SendIcon size={15} color="white" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
          style={{
            background: ROSE,
            border: "none",
            width: 56,
            height: 56,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 30px rgba(214,143,163,0.5)",
            cursor: "pointer",
            transition: "transform 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <ChatBubbleIcon size={24} color="white" filled />
        </button>
      )}
    </div>
  );
}

// Clean line-style chat bubble icon — matches the site's icon style
// (location pin / clock icons used elsewhere on the page)
function ChatBubbleIcon({ size = 20, color = "currentColor", filled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 3C7.03 3 3 6.58 3 11c0 2.39 1.19 4.53 3.08 6.02-.1.99-.5 2.33-1.48 3.68a.5.5 0 0 0 .55.78c1.98-.5 3.5-1.4 4.46-2.1.75.16 1.54.24 2.39.24 4.97 0 9-3.58 9-8s-4.03-8-9-8Z"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {filled && (
        <>
          <circle cx="8.5" cy="11" r="1" fill={ROSE} />
          <circle cx="12" cy="11" r="1" fill={ROSE} />
          <circle cx="15.5" cy="11" r="1" fill={ROSE} />
        </>
      )}
    </svg>
  );
}

function SendIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 11.5L21 3l-6 18-4-7-8-2.5Z"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}