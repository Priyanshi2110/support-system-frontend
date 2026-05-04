import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Brain,
  Home,
  MessageCircle,
  BarChart3,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  X,
  Stethoscope
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toUpperCase();

  const logout = () => {
    // ✅ clear session
    localStorage.clear();

    // ✅ notify app (important for React state sync)
    window.dispatchEvent(new Event("authChange"));

    // ✅ redirect properly
    navigate("/");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/home"
          className="flex items-center space-x-2 text-white text-2xl font-bold"
        >
          <Brain className="w-8 h-8" />
          <span>MindCare AI</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/home" className="text-white flex items-center gap-1">
            <Home className="w-4 h-4" />
            Home
          </Link>

          {token && (
            <Link to="/chat" className="text-white flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              Chat
            </Link>
          )}

          {token && role !== "THERAPIST" && (
            <Link to="/therapist-chat" className="text-white flex items-center gap-1">
              <Stethoscope className="w-4 h-4" />
              Therapist Support
            </Link>
          )}

          {role === "THERAPIST" && (
            <Link to="/therapist" className="text-white flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </Link>
          )}
        </div>

        {/* AUTH BUTTONS */}
        <div className="hidden md:flex items-center gap-4">

          {!token ? (
            <>
              <Link
                to="/"
                className="px-4 py-2 border border-white text-white rounded-lg"
              >
                <LogIn className="inline w-4 h-4 mr-1" />
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 bg-white text-indigo-600 rounded-lg"
              >
                <UserPlus className="inline w-4 h-4 mr-1" />
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              <LogOut className="inline w-4 h-4 mr-1" />
              Logout
            </button>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button onClick={toggleMenu} className="md:hidden text-white">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 border-t border-white/30 pt-4 space-y-3">

          <Link to="/home" onClick={toggleMenu} className="text-white block">
            Home
          </Link>

          {token && (
            <Link to="/chat" onClick={toggleMenu} className="text-white block">
              Chat
            </Link>
          )}

          {token && role !== "THERAPIST" && (
            <Link to="/therapist-chat" onClick={toggleMenu} className="text-white block">
              Therapist Support
            </Link>
          )}

          {role === "THERAPIST" && (
            <Link to="/therapist" onClick={toggleMenu} className="text-white block">
              Dashboard
            </Link>
          )}

          {!token ? (
            <>
              <Link to="/" onClick={toggleMenu} className="text-white block">
                Login
              </Link>

              <Link to="/register" onClick={toggleMenu} className="text-white block">
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                logout();
                toggleMenu();
              }}
              className="text-red-300"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;