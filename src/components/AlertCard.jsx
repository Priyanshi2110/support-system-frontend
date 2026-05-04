import React from "react";
import { AlertTriangle, Clock, User, MessageSquare } from "lucide-react";

function AlertCard({ alert }) {
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'medium':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'low':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟠';
      case 'low':
        return '🟡';
      default:
        return '⚪';
    }
  };

  return (
    <div className={`border-2 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 ${getSeverityColor(alert.severity)}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/50 rounded-full flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {alert.userEmail || 'Anonymous User'}
            </p>
            <div className="flex items-center space-x-1 text-sm opacity-75">
              <Clock className="w-3 h-3" />
              <span>{new Date(alert.timestamp || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-lg">{getSeverityIcon(alert.severity)}</span>
          <span className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
            {alert.severity || 'Unknown'}
          </span>
        </div>
      </div>

      {/* Message */}
      <div className="mb-4">
        <div className="flex items-start space-x-2">
          <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-sm leading-relaxed">
            {alert.message}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-current border-opacity-20">
        <div className="flex items-center space-x-1 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-medium">Requires Attention</span>
        </div>
        <button className="px-4 py-2 bg-white/50 hover:bg-white/70 rounded-lg text-sm font-medium transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}

export default AlertCard;