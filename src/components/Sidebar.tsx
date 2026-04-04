"use client";
import Link from "next/link";
import { LayoutDashboard, ClipboardList, Package, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/dashboard/orders", icon: ClipboardList },
  { name: "Layanan", href: "/dashboard/services", icon: Package },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-white border-r h-screen sticky top-0 flex flex-col p-4">
      <h1 className="text-xl font-bold text-blue-600 mb-8 px-2">
        Outsys Laundry
      </h1>
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <LogOut size={20} />
        <span className="font-medium">Keluar</span>
      </button>
    </aside>
  );
}
