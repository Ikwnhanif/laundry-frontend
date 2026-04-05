"use client";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null; // Cegah "flicker" konten sebelum redirect

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Sidebar tetap di kiri */}
      <Sidebar />

      {/* Area Konten Utama */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-white flex items-center justify-between px-8">
          <div className="text-sm font-medium text-slate-500">
            Status: <span className="text-green-600">Online</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-700">
              ID Toko:{" "}
              {typeof window !== "undefined" &&
                localStorage.getItem("store_id")}
            </span>
          </div>
        </header>

        <main className="p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
