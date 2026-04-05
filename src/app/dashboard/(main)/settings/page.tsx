"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Store,
  User,
  Lock,
  Save,
  Layout,
  Quote,
  MapPin,
  Fingerprint,
  RefreshCw,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    tagline: "",
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const storeId =
    typeof window !== "undefined" ? localStorage.getItem("store_id") : null;

  // Fungsi Fetch Data dari Database
  const fetchSettings = async () => {
    if (!storeId) return;
    setIsFetching(true);
    try {
      // REVISI: Pastikan endpoint ini me-return: { store: { name, address, tagline ... } }
      const res = await api.get(`/reports/stats/${storeId}`);

      if (res.data.store) {
        const dbStore = res.data.store;
        setFormData({
          name: dbStore.name || "",
          address: dbStore.address || "",
          tagline: dbStore.tagline || "",
          username: localStorage.getItem("username") || "",
          password: "",
        });

        // Sinkronisasi LocalStorage agar komponen lain (Sidebar/Struk) update
        localStorage.setItem("store_name", dbStore.name || "");
        localStorage.setItem("store_address", dbStore.address || "");
        localStorage.setItem("store_tagline", dbStore.tagline || "");
      }
    } catch (err) {
      toast.error("Gagal sinkronisasi data dengan server");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [storeId]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { password, ...rest } = formData;
      const payload = password ? { ...rest, password } : rest;

      await api.put(`/stores/${storeId}`, payload);

      // Update LocalStorage Global
      localStorage.setItem("store_name", formData.name);
      localStorage.setItem("store_address", formData.address);
      localStorage.setItem("store_tagline", formData.tagline);
      localStorage.setItem("username", formData.username);

      toast.success("Pengaturan Disimpan", {
        description: "Data identitas toko berhasil diperbarui di database.",
      });

      // Refresh halaman agar Sidebar me-render ulang nama yang baru
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("Gagal menyimpan perubahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-[3px]">
            <Sparkles size={14} /> System Configuration
          </div>
          <h2 className="text-4xl font-[1000] tracking-tighter text-slate-900 uppercase">
            Settings
          </h2>
        </div>
        <Button
          variant="outline"
          onClick={fetchSettings}
          disabled={isFetching}
          className="rounded-2xl border-slate-200 bg-white hover:bg-slate-50 shadow-sm font-bold text-xs px-5 h-11"
        >
          <RefreshCw
            size={14}
            className={`mr-2 ${isFetching ? "animate-spin" : ""}`}
          />
          {isFetching ? "Syncing..." : "Sync Database"}
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        {/* KOLOM KIRI: IDENTITAS */}
        <div className="md:col-span-7 space-y-6">
          <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] bg-white rounded-[3rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-10">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-slate-900 rounded-2xl shadow-xl">
                  <Store className="text-white" size={24} />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black tracking-tight text-slate-800">
                    Profil Bisnis
                  </CardTitle>
                  <CardDescription className="font-bold text-slate-400 text-xs uppercase tracking-wider">
                    Identitas Resmi Toko Laundry
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 ml-1">
                  Nama Laundry
                </label>
                <Input
                  className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 transition-all font-black text-slate-700 text-lg"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nama Toko Anda"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 ml-1">
                  Tagline / Motto
                </label>
                <div className="relative">
                  <Quote
                    className="absolute left-4 top-4.5 text-slate-300"
                    size={18}
                  />
                  <Input
                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 italic font-bold text-slate-600"
                    value={formData.tagline}
                    onChange={(e) =>
                      setFormData({ ...formData, tagline: e.target.value })
                    }
                    placeholder="Contoh: Bersih, Wangi, Bergaransi"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 ml-1">
                  Alamat Operasional
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-4.5 text-slate-300"
                    size={18}
                  />
                  <Input
                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-600"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Alamat lengkap lokasi toko..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KOLOM KANAN: AKUN */}
        <div className="md:col-span-5 space-y-6">
          <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] bg-white rounded-[3rem] overflow-hidden">
            <CardHeader className="p-10 pb-4">
              <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-[3px] text-slate-400">
                <Fingerprint className="text-blue-600" size={20} /> Security
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-2 space-y-7">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 ml-1">
                  Username
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-4 text-slate-300"
                    size={18}
                  />
                  <Input
                    className="pl-12 h-13 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 font-black text-slate-700"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 ml-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-4 text-slate-300"
                    size={18}
                  />
                  <Input
                    type="password"
                    className="pl-12 h-13 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 font-bold text-slate-700"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
                <p className="text-[9px] text-slate-400 font-black tracking-tighter ml-1 uppercase opacity-60">
                  * Kosongkan jika tidak diganti
                </p>
              </div>

              <div className="p-5 bg-blue-50/50 rounded-[2rem] border border-blue-100/50 flex gap-4 mt-4">
                <Layout className="text-blue-600 shrink-0" size={22} />
                <p className="text-[10px] text-blue-700 leading-relaxed font-black uppercase tracking-tight opacity-80">
                  Data ini disinkronkan secara real-time ke Sidebar, Struk
                  Cetak, dan Nota WhatsApp Pelanggan.
                </p>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleSave}
            disabled={isLoading || isFetching}
            className="w-full bg-slate-900 hover:bg-blue-600 text-white h-20 rounded-[2.5rem] font-[1000] tracking-[5px] transition-all duration-500 shadow-2xl shadow-slate-200 uppercase text-xs flex items-center justify-center gap-4"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <Save size={24} /> UPDATE SYSTEM
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
