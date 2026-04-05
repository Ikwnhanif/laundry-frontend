"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Store,
  MapPin,
  User,
  Lock,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    store_name: "",
    address: "",
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/register-store", formData);
      toast.success("Registrasi Berhasil!", {
        description: "Toko Anda telah terdaftar. Silakan login untuk memulai.",
      });

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      const message =
        error.response?.data?.error || "Username mungkin sudah digunakan.";
      toast.error("Registrasi Gagal", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FDFDFD] relative overflow-hidden p-4">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 blur-[120px] rounded-full -z-10 opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 blur-[120px] rounded-full -z-10 opacity-60"></div>

      <div className="w-full max-w-lg animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
              <LayoutDashboard className="text-white h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900">
              OUTSYS<span className="text-blue-600">LAUNDRY</span>
            </h1>
          </Link>
        </div>

        <Card className="border-none shadow-2xl shadow-slate-200/60 rounded-3xl overflow-hidden">
          <CardHeader className="bg-white pb-2 pt-8 px-8">
            <CardTitle className="text-2xl font-black text-slate-900">
              Daftar Toko Baru
            </CardTitle>
            <CardDescription className="font-medium">
              Lengkapi data di bawah untuk membuat sistem manajemen laundry
              Anda.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 pt-6">
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Nama Toko */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Nama Laundry
                  </label>
                  <div className="relative">
                    <Store className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Barokah Laundry"
                      required
                      className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white"
                      onChange={(e) =>
                        setFormData({ ...formData, store_name: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Alamat */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Alamat
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Bantul, Yogyakarta"
                      required
                      className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white"
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 my-2 pt-6 space-y-5">
                {/* Username */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Username Admin
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="admin_laundry"
                      required
                      className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white"
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      required
                      className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white"
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 group"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Daftar Sekarang{" "}
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500 font-medium">
                Sudah mengelola toko?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 font-bold hover:underline"
                >
                  Masuk Dashboard
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="mt-10 text-center text-xs text-slate-400">
          Dengan mendaftar, Anda menyetujui Ketentuan Layanan kami. <br />
          Built by <span className="font-bold">ikwnhanif</span>
        </p>
      </div>
    </div>
  );
}
