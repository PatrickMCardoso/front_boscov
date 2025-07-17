import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3030",
});

api.interceptors.request.use((config) => {
  if (config.method === "get") {
    config.headers["Cache-Control"] = "no-cache";
    config.headers["Pragma"] = "no-cache";
    config.headers["Expires"] = "0";
    config.params = { ...(config.params || {}), t: Date.now() }; 
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response?.status === 401 &&
      localStorage.getItem("token")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/not-authenticated";
    }
    return Promise.reject(error);
  }
);

export default api;