import { useState, useEffect, useRef } from "react";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("smartdine_chat");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // persist chat history
  useEffect(() => {
    localStorage.setItem("smartdine_chat", JSON.stringify(messages));
  }, [messages]);

  // auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    const userMsg = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/chat/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed }),
        }
      );

      const data = await res.json();

      let replyText = "⚠️ Sorry, I couldn’t get a reply from SmartDine AI.";

      if (res.ok && data?.reply) {
        replyText = data.reply;
      } else if (data?.error) {
        replyText = `⚠️ ${data.error}`;
      }

      const botMsg = { role: "bot", text: replyText };
      // delay for natural typing effect
      setTimeout(() => {
        setMessages((prev) => [...prev, botMsg]);
      }, 400);
    } catch (err) {
      console.error("Chat request failed:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Server error. Please try again later." },
      ]);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-200 pb-3 mb-4">
          <h1 className="text-2xl font-semibold text-[#059669]">
            SmartDine Assistant
          </h1>
          <p className="text-sm text-gray-500">
            Ask about food, diet plans, nutrition, or our restaurant menu.
          </p>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-2xl max-w-[80%] break-words whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-[#059669] text-white self-end ml-auto"
                  : "bg-gray-100 text-gray-800 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="text-sm text-gray-400 italic">
              SmartDine is typing...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#059669]"
            placeholder="Ask about food, diet, or menu..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-[#059669] text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
