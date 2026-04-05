import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8080/api", // URL Backend Go kamu
});

// Interceptor untuk menyisipkan JWT Token secara otomatis
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
