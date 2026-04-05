import axios from "axios";

const api = axios.create({
  // Mengambil URL dari .env.local
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
});

// Tambahkan interceptor untuk token jika perlu
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
