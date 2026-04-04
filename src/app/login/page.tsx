"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", { username, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("store_id", response.data.store_id);

      alert("Login Berhasil!");
      router.push("/dashboard"); // Pindah ke dashboard
    } catch (error) {
      alert("Login Gagal! Cek username/password.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="p-8 bg-white shadow-md rounded-lg w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Outsys Laundry</h1>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 border rounded"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
