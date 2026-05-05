import React, { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import ChatBox from "../components/ChatBox";
import {
  Users,
  AlertTriangle,
  MessageSquare,
  UserCheck,
  Activity,
  BarChart3,
  Send
} from "lucide-react";

function TherapistDashboard() {
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeAlerts: 0,
    totalChats: 0,
    resolvedCases: 0,
    alertsToday: 0
  });
  const [conversation, setConversation] = useState([]);
  const [selectedAnonymousId, setSelectedAnonymousId] = useState("");
  const [selectedAlias, setSelectedAlias] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      } 
      const token = localStorage.getItem("token");

      const [statsRes, casesRes] = await Promise.all([
        API.get("/dashboard/therapist", { headers: { Authorization: `Bearer ${token}` } }),
        API.get("/therapist/cases", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setStats(statsRes.data);
      setCases(casesRes.data || []);

      if (casesRes.data?.length > 0 && !selectedAnonymousId) {
        setSelectedAnonymousId(casesRes.data[0].anonymousId);
        setSelectedAlias(`Case ${casesRes.data[0].caseNumber}`);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      if (showLoading) {
        setLoading(false);
      } 
    }
  }, [selectedAnonymousId]);

  const loadConversation = useCallback(async (anonymousId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/therapist/chat/${anonymousId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversation(res.data || []);
    } catch (error) {
      console.error("Error loading student conversation:", error);
      setConversation([]);
    }
  }, []);

  useEffect(() => {
    loadDashboard(true);
  }, [loadDashboard]);

  // Add polling for dashboard updates
  useEffect(() => {
    const interval = setInterval(() => {
      loadDashboard(false);
    }, 5000); // Poll every 5 seconds for new cases

    return () => clearInterval(interval);
  }, [loadDashboard]);

  useEffect(() => {
  if (selectedAnonymousId) {
    loadConversation(selectedAnonymousId);
  }
}, [selectedAnonymousId, loadConversation]);

  // Add polling for real-time conversation updates
  useEffect(() => {
    if (!selectedAnonymousId) return;

    const interval = setInterval(() => {
      loadConversation(selectedAnonymousId);
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount or email change
  }, [selectedAnonymousId, loadConversation]);

  const studentEntries = cases.map((caseItem, index) => ({
    anonymousId: caseItem.anonymousId,
    alias: `Case ${caseItem.caseNumber}`,
    latestMessage: caseItem.latestMessage,
    timestamp: caseItem.timestamp
  }));

  const statsCards = [
    {
      title: "Total Students",
      value: stats.totalPatients,
      icon: Users,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Active Alerts",
      value: stats.activeAlerts,
      icon: AlertTriangle,
      color: "from-red-500 to-red-600"
    },
    {
      title: "AI Chats",
      value: stats.totalChats,
      icon: MessageSquare,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Resolved Cases",
      value: stats.resolvedCases,
      icon: UserCheck,
      color: "from-purple-500 to-purple-600"
    }
  ];

  const handleReply = async (e) => {
  e.preventDefault();
  if (!replyMessage.trim() || !selectedAnonymousId) return;

  try {
    const token = localStorage.getItem("token");
    const therapistEmail = localStorage.getItem("email"); // therapist

    // 🔥 get student email from current conversation
    const studentMsg = conversation.find((m) => m.role === "USER");
    const studentEmail = studentMsg?.senderEmail;

    if (!studentEmail) {
      console.error("Student email not found in conversation");
      return;
    }

    await API.post(
      "/therapist/reply",
      {
        senderEmail: studentEmail,                 // ✅ student
        assignedTherapistEmail: therapistEmail,    // ✅ therapist
        anonymousId: selectedAnonymousId,
        message: replyMessage.trim(),
        role: "THERAPIST"
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setReplyMessage("");
    loadConversation(selectedAnonymousId);

  } catch (error) {
    console.error("Error sending reply:", error);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Therapist Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor high-risk cases, review anonymous student conversations, and respond safely.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow">
          <Activity className="w-5 h-5 text-indigo-600" />
          <span className="text-sm font-medium text-gray-700">Alerts Today: {stats.alertsToday}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-8">
        {statsCards.map((card, index) => (
          <div key={index} className="rounded-3xl bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <h2 className="text-3xl font-semibold text-gray-900">{card.value}</h2>
              </div>
              <card.icon className="w-7 h-7 text-indigo-600" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 bg-white rounded-3xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Flagged Student Cases</h2>
          {studentEntries.length === 0 ? (
            <p className="text-gray-600">No high-priority student cases at the moment.</p>
          ) : (
            <div className="space-y-3">
              {studentEntries.map((student, index) => (
                <button
                  key={student.anonymousId}
                  onClick={() => {
                    setSelectedAnonymousId(student.anonymousId);
                    setSelectedAlias(student.alias);
                  }}
                  className={`w-full text-left rounded-3xl border p-4 transition ${selectedAnonymousId === student.anonymousId ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white hover:border-indigo-300"}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{student.alias}</p>
                      <p className="text-sm text-gray-500 mt-1">Latest message: {student.latestMessage.slice(0, 60)}...</p>
                    </div>
                    <span className="text-sm text-indigo-600">Case {student.alias.split(' ')[1]}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="xl:col-span-2 bg-white rounded-3xl shadow p-6 flex flex-col">
          <div className="mb-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{selectedAlias || "Select a student case"}</h2>
                <p className="text-gray-500 mt-1">Read the recent conversation and send an anonymous supportive reply.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-indigo-700 text-sm">
                <BarChart3 className="w-4 h-4" />
                {conversation.length} messages
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[520px] pr-2">
            {conversation.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
                Choose a student case to review their anonymous chat history.
              </div>
            ) : (
              conversation.map((msg) => (
                <ChatBox key={msg.id} message={msg} currentUserRole="THERAPIST" />
              ))
            )}
          </div>

          <form onSubmit={handleReply} className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Send a reply</label>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={4}
              className="w-full rounded-3xl border border-gray-300 p-4 focus:border-indigo-500 focus:ring-indigo-100"
              placeholder="Compose a calming message and suggest a next healthy step."
            />
            <button
              type="submit"
              disabled={!replyMessage.trim() || !selectedAnonymousId}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-white shadow hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Reply anonymously
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TherapistDashboard;
