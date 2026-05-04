import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Brain } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await API.post("/users/login", {
        email,
        password
      });

      const role = (res.data.role || "STUDENT").toUpperCase().trim();
      const userEmail = res.data.email || email;
      const userName = res.data.name || "";

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", role);
      localStorage.setItem("email", userEmail);
      localStorage.setItem("name", userName);

      window.dispatchEvent(new Event("storage"));

      setTimeout(() => {
        if (role === "THERAPIST") {
          navigate("/therapist", { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
      }, 50);

    } catch (err) {
      console.error(err);
      const serverMessage = err.response?.data?.message;
      setError(serverMessage || "Login failed. Check email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">

        {/* Header */}
        <div className="text-center mb-8">
          <Brain className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome Back
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={login}>

            {/* Email */}
            <div className="mb-6">
              <label className="block mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-10 py-3 border rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-3 border rounded-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 mb-3">{error}</p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg"
            >
              {isLoading ? "Loading..." : "Login"}
            </button>

          </form>

          <p className="mt-4 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;