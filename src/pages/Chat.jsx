import React, { useEffect, useState, useRef, useCallback } from "react";
import API from "../services/api";
import ChatBox from "../components/ChatBox";
import { Send, MessageCircle, Brain, AlertTriangle } from "lucide-react";

function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Get user email from localStorage
  const getUserEmail = () => {
    return localStorage.getItem("email") || "user@example.com";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    setIsAtBottom(distanceFromBottom < 80);
  };

  const loadChat = useCallback(async (showLoading = false) => {
    if (showLoading) {
      setIsChatLoading(true);
    }

    try {
      const email = getUserEmail();
      const token = localStorage.getItem("token");

      const aiChatRes = await API.get(`/chat/${email}`, { headers: { Authorization: `Bearer ${token}` } });
      setChat(aiChatRes.data || []);
    } catch (error) {
      console.error("Error loading chat:", error);
    } finally {
      if (showLoading) {
        setIsChatLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadChat(true);
  }, []);

  // Add polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      loadChat(false);
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [loadChat]);

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
      timestamp: new Date().toISOString()
    };

    setChat(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      const email = getUserEmail();
      await API.post("/chat/send", {
        senderEmail: email,
        message: userMessage.message
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      // Simulate AI thinking time
      setTimeout(() => {
        loadChat(); // Reload to get AI response
        setIsTyping(false);
      }, 1000);

    } catch (error) {
      console.error("Error sending message:", error);
      setChat(prev => prev.filter(msg => msg.id !== userMessage.id));
      // Add error message
      setChat(prev => [...prev, {
        id: Date.now(),
        message: "Sorry, I couldn't send your message. Please try again.",
        role: "AI",
        timestamp: new Date().toISOString()
      }]);
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">MindCare AI Chat</h1>
              <p className="text-sm text-gray-500">Your AI mental health companion. This chat is separate from therapist support.</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Online</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4"
      >
        {isChatLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[320px] text-center space-y-4">
            <div className="h-4 w-48 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-4 w-64 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-4 w-56 rounded-full bg-gray-200 animate-pulse" />
          </div>
        ) : chat.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[320px] text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Start Your Conversation</h3>
            <p className="text-gray-600 max-w-md">
              I'm here to listen and support you. Share what's on your mind, and let's work through it together.
            </p>
          </div>
        ) : (
          chat.map((msg, index) => (
            <ChatBox key={msg.id || index} message={msg} currentUserRole="USER" />
          ))
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start mb-6">
            <div className="flex items-start space-x-3 max-w-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Safety Notice */}
      <div className="px-6 py-2 bg-yellow-50 border-t border-yellow-200">
        <div className="flex items-center space-x-2 text-sm text-yellow-800">
          <AlertTriangle className="w-4 h-4" />
          <span>
            Remember: I'm here to support you, but for serious mental health concerns,
            please consult a qualified professional.
          </span>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={sendMessage} className="flex space-x-4">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              placeholder="Share what's on your mind..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
              style={{minHeight: '48px', maxHeight: '120px'}}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;