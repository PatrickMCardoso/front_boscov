import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030",
});

// Interceptor para evitar cache em todas as requisições GET
api.interceptors.request.use((config) => {
  if (config.method === "get") {
    config.headers["Cache-Control"] = "no-cache";
    config.headers["Pragma"] = "no-cache";
    config.headers["Expires"] = "0";
    config.params = { ...(config.params || {}), t: Date.now() }; // força URL única
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/not-authenticated";
    }
    return Promise.reject(error);
  }
);

export default api;