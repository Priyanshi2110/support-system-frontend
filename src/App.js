import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import TherapistChat from "./pages/TherapistChat";
import TherapistDashboard from "./pages/TherapistDashboard";
import Navbar from "./components/Navbar";

function App() {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState({
    isAuth: false,
    role: ""
  });

  const getAuth = () => {
    const token = localStorage.getItem("token");
    const role = (localStorage.getItem("role") || "").toUpperCase();

    return {
      isAuth: !!token,
      role
    };
  };

  useEffect(() => {
    setAuth(getAuth());
    setLoading(false);

    const syncAuth = () => {
      setAuth(getAuth());
    };

    window.addEventListener("storage", syncAuth);
    window.addEventListener("authChange", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("authChange", syncAuth);
    };
  }, []);

  const ProtectedRoute = ({ children, requireTherapist = false }) => {
    if (loading) return <div>Loading...</div>;

    if (!auth.isAuth) {
      return <Navigate to="/" replace />;
    }

    if (requireTherapist && auth.role !== "THERAPIST") {
      return <Navigate to="/home" replace />;
    }

    return children;
  };

  const PublicRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>;

    if (!auth.isAuth) {
      return children;
    }

    return auth.role === "THERAPIST" ? <Navigate to="/therapist" replace /> : <Navigate to="/home" replace />;
  };

  return (
    <BrowserRouter>
      {auth.isAuth && <Navbar />}

      <Routes>
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/therapist-chat" element={<ProtectedRoute><TherapistChat /></ProtectedRoute>} />
        <Route path="/therapist-chat/:therapistEmail" element={<ProtectedRoute><TherapistChat /></ProtectedRoute>} />

        <Route
          path="/therapist"
          element={
            <ProtectedRoute requireTherapist={true}>
              <TherapistDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;