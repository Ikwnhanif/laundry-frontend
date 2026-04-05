"use client";
import Link from "next/link";
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  LogOut,
  DollarSign,
  TrendingUp,
  Store,
  ChevronRight,
  Settings,
  Sparkles,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transaksi", href: "/dashboard/orders", icon: ClipboardList },
  { name: "Layanan", href: "/dashboard/services", icon: Package },
  { name: "Pengeluaran", href: "/dashboard/expenses", icon: DollarSign },
  { name: "Laporan", href: "/dashboard/reports", icon: TrendingUp },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // State Dinamis
  const [username, setUsername] = useState("Admin");
  const [storeName, setStoreName] = useState("OUTSYS");

  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    const savedStore = localStorage.getItem("store_name");

    if (savedUser) setUsername(savedUser);
    if (savedStore) setStoreName(savedStore);

    // Listener untuk mendeteksi perubahan localStorage dari tab lain/halaman lain
    const handleStorageChange = () => {
      const updatedStore = localStorage.getItem("store_name");
      if (updatedStore) setStoreName(updatedStore);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-white border-r h-screen sticky top-0 flex flex-col z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Brand Logo - Dinamis mengikuti Nama Toko */}
      <div className="p-6 mb-2">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-xl shadow-lg shadow-blue-200 group-hover:rotate-6 transition-all duration-300">
            <Sparkles className="text-white h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-[900] tracking-tight text-slate-900 leading-none uppercase truncate w-36">
              {storeName.split(" ")[0]}
              <span className="text-blue-600 block text-[10px] tracking-[3px] font-black mt-1 opacity-80">
                LAUNDRY
              </span>
            </h1>
          </div>
        </Link>
      </div>

      {/* User Profile Card */}
      <div className="mx-4 mb-6 p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-inner">
            <Store size={18} />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest leading-none mb-1">
              Active Operator
            </span>
            <span className="text-sm font-extrabold text-slate-700 truncate capitalize">
              {username}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-3 mb-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px] opacity-70">
            Main Navigation
          </span>
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                  : "text-slate-500 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={19}
                  className={`${
                    isActive
                      ? "text-blue-400"
                      : "group-hover:scale-110 transition-transform duration-300"
                  }`}
                />
                <span
                  className={`text-sm ${isActive ? "font-bold" : "font-semibold"}`}
                >
                  {item.name}
                </span>
              </div>
              {isActive && (
                <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-4 mt-auto">
        <div className="bg-slate-50 rounded-2xl p-2 border border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-white rounded-xl transition-all duration-300 font-bold text-sm group shadow-none hover:shadow-sm"
          >
            <LogOut
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Sign Out</span>
          </button>
        </div>
        <div className="mt-4 flex flex-col items-center gap-1">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
            Securely powered by
          </p>
          <span className="text-[10px] font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full">
            ikwnhanif
          </span>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f1f5f9;
          border-radius: 10px;
        }
      `}</style>
    </aside>
  );
}
