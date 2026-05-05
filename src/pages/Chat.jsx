import React, { useEffect, useState, useRef, useCallback } from "react";
import API from "../services/api";
import ChatBox from "../components/ChatBox";
import { Send } from "lucide-react";
import { connectSocket } from "../socket";
import toast from "react-hot-toast";

function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const getUserEmail = () => {
    return localStorage.getItem("email") || "user@example.com";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 📥 Load chat history
  const loadChat = useCallback(async () => {
    try {
      const email = getUserEmail();
      const token = localStorage.getItem("token");

      const res = await API.get(`/chat/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setChat(res.data || []);
    } catch (error) {
      console.error("Error loading chat:", error);
    } finally {
      setIsChatLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChat();
  }, [loadChat]);

  // 🔥 REAL-TIME SOCKET
  useEffect(() => {
    const email = getUserEmail();

    const disconnect = connectSocket(email, (newMessage) => {
      console.log("🔥 New message:", newMessage);

      setChat((prev) => [...prev, newMessage]);

      // ✅ Modern notification (NO alert)
      toast.success(`New message from ${newMessage.senderEmail}`);
    });

    // ✅ cleanup (important)
    return () => {
      if (disconnect) disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  // 📤 Send message
const sendMessage = async (e) => {
  e.preventDefault();
  if (!message.trim() || isLoading) return;

  const userMessage = {
    id: Date.now(),
    message: message.trim(),
    role: "USER",
    timestamp: new Date().toISOString(),
    assignedTherapistEmail: null,
  };

  // show instantly
  setChat((prev) => [...prev, userMessage]);

  setMessage("");
  setIsLoading(true);
  setIsTyping(true);

  try {
    const email = getUserEmail();

    const res = await API.post("/chat/send", {
      senderEmail: email,
      message: userMessage.message,
    });

    console.log("API RESPONSE:", res.data);

    // ❗ DO NOT ADD AI MESSAGE HERE
    // socket will handle it

  } catch (error) {
    console.error("Error sending message:", error);
    toast.error("Failed to send message");
  } finally {
    setIsTyping(false);
    setIsLoading(false);
  }
};

  return (
    <div className="h-screen flex flex-col bg-gray-50">

      {/* Header */}
      <div className="bg-white shadow p-4">
        <h1 className="text-lg font-semibold">AI Chat</h1>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto p-4">
        {isChatLoading ? (
          <p>Loading...</p>
        ) : chat.length === 0 ? (
          <p>Start chatting...</p>
        ) : (
          chat
            .filter(msg => msg.assignedTherapistEmail === null) // 🔥 ONLY AI CHAT
            .map((msg, index) => (
              <ChatBox
                key={msg.id || index}
                message={msg}
                currentUserRole="USER"
              />
            ))
        )}

        {isTyping && <p className="text-gray-500">AI is typing...</p>}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 bg-white flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
        />
        <button className="bg-blue-600 text-white px-4 rounded flex items-center gap-2">
          <Send size={16} />
          Send
        </button>
      </form>

    </div>
  );
}

export default Chat;