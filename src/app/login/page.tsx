"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Lock,
  User,
  ArrowRight,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/login", { username, password });

      // 1. Simpan Token dan ID
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("store_id", response.data.store_id);
      localStorage.setItem("username", username);

      // 2. REVISI KRUSIAL: Simpan nama toko dari database ke localStorage
      // Agar Sidebar langsung sinkron dengan nama asli toko (bukan default OUTSYS)
      if (response.data.store_name) {
        localStorage.setItem("store_name", response.data.store_name);
      }

      toast.success("Login Berhasil!", {
        description: `Selamat datang kembali, ${username}!`,
      });

      // Beri jeda singkat untuk transisi yang mulus
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    } catch (error: any) {
      const message =
        error.response?.data?.error || "Cek kembali username & password Anda.";
      toast.error("Login Gagal", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FDFDFD] relative overflow-hidden font-sans">
      {/* TOMBOL KEMBALI KE HOME */}
      <div className="absolute top-8 left-8 z-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-bold text-sm group"
        >
          <div className="bg-white p-2 rounded-full shadow-sm border border-slate-100 group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
            <ChevronLeft size={18} />
          </div>
          Kembali ke Beranda
        </Link>
      </div>

      {/* Ornamen Background Lembut */}
      <div className="absolute top-[-10%] right-[-10%] w-[35%] h-[35%] bg-blue-50 blur-[120px] rounded-full -z-10 opacity-60"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] bg-indigo-50 blur-[120px] rounded-full -z-10 opacity-60"></div>

      <div className="w-full max-w-md px-4 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-600 p-3 rounded-2xl mb-5 shadow-xl shadow-blue-200">
            <Sparkles className="text-white h-7 w-7" />
          </div>
          <h1 className="text-3xl font-[950] tracking-tighter text-slate-900 uppercase">
            OUTSYS<span className="text-blue-600">LAUNDRY</span>
          </h1>
          <p className="text-slate-400 mt-2 font-semibold text-sm tracking-wide">
            CLOUD MANAGEMENT SYSTEM v1.0
          </p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.03)] border border-slate-100/80">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* INPUT USERNAME */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 ml-1">
                Username Access
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-300" />
                <Input
                  type="text"
                  placeholder="Masukkan username"
                  className="pl-12 h-13 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-400 transition-all font-medium text-slate-700"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* INPUT PASSWORD */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400">
                  Secure Password
                </label>
                <a
                  href="#"
                  className="text-[10px] font-black uppercase text-blue-600 hover:underline tracking-tighter"
                >
                  Lupa?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-300" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-12 h-13 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-400 transition-all font-medium text-slate-700"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* TOMBOL SUBMIT */}
            <Button
              type="submit"
              className="w-full h-14 bg-slate-900 hover:bg-blue-600 text-white font-[1000] tracking-[4px] rounded-2xl transition-all duration-300 shadow-2xl shadow-slate-200 group mt-4 flex items-center justify-center gap-3 uppercase text-xs"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Authenticate
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-2 transition-transform duration-300"
                  />
                </>
              )}
            </Button>
          </form>

          <div className="mt-10 text-center pt-8 border-t border-slate-50">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[1px]">
              Belum terdaftar sebagai mitra?{" "}
              <Link
                href="/register"
                className="text-blue-600 font-black hover:underline ml-1"
              >
                Buat Akun Toko
              </Link>
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-12 text-center opacity-40">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[4px]">
            Enterprise Security Verified
          </p>
          <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">
            Secured by ikwnhanif
          </p>
        </div>
      </div>
    </div>
  );
}
