import axios from "axios";

const API = axios.create({
    // baseURL: "https://support-system-backend-1.onrender.com/api",
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json"
    }
});

// ✅ REQUEST INTERCEPTOR
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        // 🚨 Do NOT send token for public routes
        const publicRoutes = [
            "/users/register",
            "/users/login"
        ];

        const isPublicRoute = publicRoutes.some(route =>
            config.url.includes(route)
        );

        if (token && !isPublicRoute) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ❌ RESPONSE INTERCEPTOR
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            alert("Session expired. Please login again.");
            localStorage.removeItem("token");
            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);

export default API;