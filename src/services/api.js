import axios from "axios";

/* ================================
   BASE API INSTANCE
================================ */
const API = axios.create({
  baseURL: "https://job-portal-backend-9mmi.onrender.com/api",
});

/* ================================
   REQUEST INTERCEPTOR
================================ */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

/* ================================
   RESPONSE INTERCEPTOR (REFRESH TOKEN FLOW)
================================ */
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔥 handle expired token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // ✅ FIXED: using API instance (NO localhost)
        const res = await API.post("/users/refresh", {
          refreshToken,
        });

        const newToken = res.data.token;

        if (!newToken) {
          throw new Error("No token received from refresh");
        }

        // 🔹 Save new token
        localStorage.setItem("token", newToken);

        // 🔹 Update default headers
        API.defaults.headers.common["Authorization"] =
          `Bearer ${newToken}`;

        // 🔹 Retry original request
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };

        return API(originalRequest);
      } catch (err) {
        console.log("Refresh failed:", err.message);

        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;