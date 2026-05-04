import React from "react";
import { Brain, User } from "lucide-react";

function ChatBox({ message, currentUserRole = "USER" }) {
  const isAI = message.role === "AI";
  const isTherapist = message.role === "THERAPIST";
  const isOutgoing = !isAI && message.role === currentUserRole;
  const label = isAI ? "MindCare AI" : isTherapist ? "Therapist" : currentUserRole === "USER" ? "You" : "Student";

  return (
    <div className={`flex ${isOutgoing ? "justify-end" : "justify-start"} mb-6`}>
      <div className={`flex items-start space-x-3 max-w-lg ${isOutgoing ? "flex-row-reverse space-x-reverse" : ""}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isAI ? "bg-gradient-to-r from-indigo-500 to-purple-500" : isTherapist ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gradient-to-r from-green-500 to-blue-500"
        }`}>
          {isAI ? (
            <Brain className="w-4 h-4 text-white" />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message Bubble */}
        <div className={`rounded-2xl px-4 py-3 shadow-sm ${
          isAI
            ? "bg-white text-gray-800 border border-gray-200"
            : isOutgoing
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            : "bg-white text-gray-800 border border-gray-200"
        }`}>
          {/* Role Label */}
          <div className={`text-xs font-medium mb-1 ${
            isAI ? "text-indigo-600" : isTherapist ? "text-purple-200" : "text-indigo-100"
          }`}>
            {label}
          </div>

          {/* Message Content */}
          <div className="text-sm leading-relaxed">
            {message.message}
          </div>

          {/* Timestamp */}
          <div className={`text-xs mt-2 ${
            isAI ? "text-gray-500" : isOutgoing ? "text-indigo-100" : "text-gray-500"
          }`}>
            {new Date(message.timestamp || Date.now()).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;