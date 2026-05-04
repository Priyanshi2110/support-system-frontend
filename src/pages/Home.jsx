import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  MessageCircle,
  Shield,
  Heart,
  TrendingUp,
  Stethoscope
} from "lucide-react";
import api from "../services/api";

function Home() {
  const navigate = useNavigate();
  const [therapists, setTherapists] = useState([]);
  const [showTherapistList, setShowTherapistList] = useState(false);
  const [stats, setStats] = useState({
    totalChats: 0,
    activeUsers: 0,
    activeUsersToday: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const [statsResponse, therapistsResponse] = await Promise.all([
            api.get("/dashboard/student", { headers: { Authorization: `Bearer ${token}` } }),
            api.get("/users/therapists", { headers: { Authorization: `Bearer ${token}` } })
          ]);

          setStats({
            totalChats: statsResponse.data.totalChats,
            activeUsers: statsResponse.data.activeUsers,
            activeUsersToday: statsResponse.data.activeUsersToday
          });
          setTherapists(therapistsResponse.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Support",
      description:
        "24/7 intelligent emotional support with advanced AI technology"
    },
    {
      icon: Shield,
      title: "Safe & Confidential",
      description: "Your conversations are encrypted and completely confidential"
    },
    {
      icon: Heart,
      title: "Personalized Care",
      description: "AI adapts to your needs and provides tailored support"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your mental health journey with detailed insights"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Brain className="w-16 h-16 text-white" />
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              MindCare AI
            </h1>

            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
              Your intelligent companion for mental wellness. Experience AI-powered
              emotional support with professional therapist oversight.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/chat")}
                className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Start AI Chat</span>
              </button>

              <button
                onClick={() => navigate("/register")}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-300"
              >
                Join Community
              </button>

              <button
                onClick={() => navigate("/therapist-chat")}
                className="bg-black/20 border border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Stethoscope className="w-5 h-5" />
                <span>Therapist Support</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {stats.totalChats}
            </div>
            <div className="text-gray-600">AI Conversations</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.activeUsers}
            </div>
            <div className="text-gray-600">Active Users</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-pink-600 mb-2">
              {stats.activeUsersToday}
            </div>
            <div className="text-gray-600">Active Today</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Why Choose MindCare AI?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-center mb-4">
                <feature.icon className="w-12 h-12 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Relaxation & Coping Steps */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Relaxation Steps for Students
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-indigo-700 mb-3">1. Breathe & Ground</h3>
            <p className="text-gray-600">Take slow, deep breaths. Feel your feet on the floor and notice the present moment.</p>
          </div>
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-indigo-700 mb-3">2. Write One Feeling</h3>
            <p className="text-gray-600">Write down one thing you're feeling right now. Small reflections can help clear your mind.</p>
          </div>
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-indigo-700 mb-3">3. Take a Short Break</h3>
            <p className="text-gray-600">Move your body or step outside for a minute. A short break can reset stress and help you think more clearly.</p>
          </div>
        </div>
      </div>

      {/* Preventive Measures Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Preventive Wellness Tips
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-indigo-700 mb-3">Stay Connected</h3>
            <p className="text-gray-600">Reach out to a friend, family member, or trusted peer when you feel overwhelmed.</p>
          </div>
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-indigo-700 mb-3">Build a Routine</h3>
            <p className="text-gray-600">Keep a simple daily schedule for sleep, meals, and study breaks to reduce stress.</p>
          </div>
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-indigo-700 mb-3">Ask for Help Early</h3>
            <p className="text-gray-600">If things feel hard, ask for support sooner rather than later.</p>
          </div>
        </div>
      </div>

      {/* Therapist Directory Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Connect with a Therapist</h2>
            <p className="text-gray-600 mt-2">
              If you want additional support, you can review the available therapist list here.
            </p>
          </div>
          <button
            onClick={() => setShowTherapistList((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-white shadow hover:bg-indigo-700"
          >
            <Stethoscope className="w-4 h-4" />
            {showTherapistList ? "Hide Therapists" : "Show Therapists"}
          </button>
        </div>

        {showTherapistList && (
          <div className="grid gap-6 md:grid-cols-3">
            {therapists.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-lg p-8 text-center text-gray-600">
                No therapists are available right now. Please check back soon.
              </div>
            ) : (
              therapists.map((therapist) => (
                <div key={therapist.email} className="bg-white rounded-3xl shadow-lg p-8 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-700 mb-2">{therapist.name}</h3>
                    <p className="text-gray-600 mb-3">Email: {therapist.email}</p>
                    <p className="text-gray-500 text-sm">Our therapist network is here to support you safely and confidentially.</p>
                  </div>
                  <button
                    onClick={() => navigate(`/therapist-chat/${encodeURIComponent(therapist.email)}`)}
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-white shadow hover:bg-indigo-700"
                  >
                    Chat with {therapist.name}
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Therapist Support Callout */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center space-x-2">
          <Stethoscope className="w-8 h-8 text-indigo-600" />
          <span>Therapist Support</span>
        </h2>

        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-5xl mx-auto">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">Want a therapist check-in?</h3>
              <p className="text-gray-600 mt-3">
                Your AI chat is separate from direct therapist support. If you'd like a therapist to review your case,
                open the therapist chat and continue in a private, anonymized session.
              </p>
              <button
                onClick={() => navigate("/therapist-chat")}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-white shadow hover:bg-indigo-700"
              >
                <Stethoscope className="w-4 h-4" />
                Open Therapist Chat
              </button>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl border border-gray-200 p-5 bg-indigo-50">
                <p className="text-sm text-gray-600">Therapist list below includes available professionals ready to support you.</p>
              </div>
              <div className="rounded-3xl border border-gray-200 p-5 bg-white">
                <p className="text-sm text-gray-600">Your therapist session remains separate from AI. The student dashboard no longer shows alert details to preserve focus.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands who have found support and peace of mind with MindCare AI.
          </p>

          <button
            onClick={() => navigate("/register")}
            className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold shadow-lg hover:scale-105 transition-all duration-300"
          >
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;