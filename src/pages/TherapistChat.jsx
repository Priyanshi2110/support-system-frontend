import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import ChatBox from "../components/ChatBox";
import { Send, Stethoscope, MessageCircle, AlertTriangle, Shield } from "lucide-react";

function TherapistChat() {
  const { therapistEmail } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapistName, setSelectedTherapistName] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const userEmail = localStorage.getItem("email") || "user@example.com";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    setIsAtBottom(distanceFromBottom < 80);
  };

  const loadTherapists = useCallback(async () => {
    try {
      const res = await API.get("/users/therapists");
      setTherapists(res.data || []);
    } catch (error) {
      console.error("Error loading therapists:", error);
      setTherapists([]);
    }
  }, []);

  const getAnonymousId = () => {
    const messageWithId = chat.find((msg) => msg.anonymousId);
    return messageWithId?.anonymousId || "";
  };

  const loadChat = useCallback(async (showLoading = false) => {
    if (showLoading) {
      setIsChatLoading(true);
    }

    try {
      if (!therapistEmail) {
        setChat([]);
        return;
      }

      const res = await API.get(`/chat/therapist/${userEmail}/${encodeURIComponent(therapistEmail)}`);
      setChat(res.data || []);
    } catch (error) {
      console.error("Error loading therapist chat:", error);
      setChat([]);
    } finally {
      if (showLoading) {
        setIsChatLoading(false);
      }
    }
  }, [userEmail, therapistEmail]);

  useEffect(() => {
    loadTherapists();
  }, [loadTherapists]);

  useEffect(() => {
    if (therapistEmail && therapists.length > 0) {
      const therapist = therapists.find((item) => item.email === therapistEmail);
      setSelectedTherapistName(therapist?.name || "");
    }
  }, [therapistEmail, therapists]);

  useEffect(() => {
    if (therapistEmail) {
      loadChat(true);
    }
  }, [loadChat, therapistEmail]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadChat(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [loadChat, therapistEmail]);

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [chat, isAtBottom]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      message: message.trim(),
      role: "USER",
      timestamp: new Date().toISOString(),
      assignedTherapistEmail: therapistEmail,
      anonymousId: getAnonymousId()
    };

    setChat((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      await API.post("/chat/therapist/reply", {
        senderEmail: userEmail,
        message: userMessage.message,
        anonymousId: userMessage.anonymousId,
        assignedTherapistEmail: therapistEmail
      });

      setTimeout(() => {
        loadChat();
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error("Error sending therapist chat message:", error);
      setChat((prev) => prev.filter((msg) => msg.id !== userMessage.id));
      setChat((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          message: "Sorry, I couldn't send your message. Please try again.",
          role: "AI",
          timestamp: new Date().toISOString()
        }
      ]);
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="bg-white shadow-lg px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">Therapist Support Chat</h1>
              {therapistEmail ? (
                <p className="text-sm text-gray-500">Chat with <span className="font-semibold">{selectedTherapistName || therapistEmail}</span> in a private therapist channel.</p>
              ) : (
                <p className="text-sm text-gray-500">Select a therapist from your student dashboard to start a private conversation.</p>
              )}
            </div>
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4 text-indigo-600" />
            Messages are anonymized and private.
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto w-full">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Therapist Chat</h2>
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="space-y-4 overflow-y-auto max-h-[520px] min-h-[320px] pr-2"
            >
              {isChatLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[320px] text-center space-y-4">
                  <div className="h-4 w-48 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-4 w-64 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-4 w-56 rounded-full bg-gray-200 animate-pulse" />
                </div>
              ) : chat.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
                  No therapist messages yet. Start by sending a note to your therapist below.
                </div>
              ) : (
                chat.map((msg, index) => (
                  <ChatBox key={msg.id || index} message={msg} currentUserRole="USER" />
                ))
              )}
              {isTyping && (
                <div className="flex justify-start mb-6">
                  <div className="flex items-start space-x-3 max-w-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Therapists</h2>
              {therapists.length === 0 ? (
                <p className="text-gray-600">No therapists are available right now. Please check back later.</p>
              ) : (
                <div className="space-y-4">
                  {therapists.map((therapist) => (
                    <div key={therapist.email} className="rounded-3xl border border-gray-200 p-4">
                      <p className="font-semibold text-gray-900">{therapist.name}</p>
                      <p className="text-sm text-gray-500">{therapist.email}</p>
                      <p className="text-sm text-indigo-600 mt-2">Available for confidential support.</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Send a Message</h2>
              <form onSubmit={sendMessage} className="space-y-4">
                <textarea
                  rows={4}
                  className="w-full rounded-3xl border border-gray-300 p-4 focus:border-indigo-500 focus:ring-indigo-100"
                  placeholder="Write a message to your therapist..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-white shadow hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 bg-yellow-50 border-t border-yellow-200">
        <div className="flex items-center space-x-2 text-sm text-yellow-800">
          <AlertTriangle className="w-4 h-4" />
          <span>
            Therapist messages are anonymous and separated from your AI support session.
          </span>
        </div>
      </div>
    </div>
  );
}

export default TherapistChat;
