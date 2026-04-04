import Sidebar from "@/components/Sidebar";
import { Geist } from "next/font/google";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Panel Manajemen</h2>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>
              Toko ID:{" "}
              {typeof window !== "undefined" &&
                localStorage.getItem("store_id")}
            </span>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
