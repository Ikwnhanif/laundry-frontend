"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Clock, DollarSign, Plus, Package } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total_orders: 0,
    pending_process: 0,
    total_income: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const storeId = localStorage.getItem("store_id");
    if (storeId) {
      api
        .get(`/reports/stats/${storeId}`)
        .then((res) => setStats(res.data))
        .catch((err) => console.error(err));
    }
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Ringkasan Bisnis
        </h2>
        <p className="text-slate-500 text-sm">
          Monitor performa laundry Anda secara real-time.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase text-slate-500">
              Total Pesanan
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{stats.total_orders}</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase text-slate-500">
              Antrean Proses
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-orange-600">
              {stats.pending_process}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase text-slate-500">
              Omzet Lunas
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-green-600">
              Rp {stats.total_income?.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className="group cursor-pointer bg-slate-900 text-white border-none transition-all hover:scale-[1.01]"
          onClick={() => router.push("/dashboard/orders")}
        >
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl group-hover:bg-blue-600 transition-colors">
              <Plus className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-lg">Input Order Baru</p>
              <p className="text-sm opacity-60">
                Catat transaksi masuk hari ini
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="group cursor-pointer border-dashed border-2 bg-white transition-all hover:border-slate-400"
          onClick={() => router.push("/dashboard/services")}
        >
          <CardContent className="pt-6 flex items-center gap-4 text-slate-600">
            <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-slate-200 transition-colors">
              <Package className="h-6 w-6 text-slate-900" />
            </div>
            <div>
              <p className="font-bold text-lg text-slate-900">Kelola Layanan</p>
              <p className="text-sm">Atur harga paket laundry</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
