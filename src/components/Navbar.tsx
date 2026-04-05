"use client";
import Link from "next/link";
import { LayoutDashboard, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Fitur", href: "/#fitur" },
    { name: "Tech Stack", href: "/#tech" },
    { name: "Harga", href: "/pricing" },
    { name: "Bantuan", href: "/help" },
  ];

  return (
    <nav className="sticky top-0 z-[100] flex justify-between items-center px-6 md:px-20 py-5 bg-white/70 backdrop-blur-xl border-b border-slate-100/80">
      {/* BRAND LOGO */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-200 group-hover:rotate-6 transition-all duration-300">
          <Sparkles className="text-white h-5 w-5" />
        </div>
        <h1 className="text-xl font-[1000] tracking-tighter text-slate-900 uppercase">
          OUTSYS<span className="text-blue-600">LAUNDRY</span>
        </h1>
      </Link>

      {/* CENTER NAV LINKS */}
      <div className="hidden md:flex gap-10">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`relative text-[10px] font-black uppercase tracking-[2.5px] transition-all duration-300 hover:text-blue-600 ${
                isActive ? "text-blue-600" : "text-slate-400"
              }`}
            >
              {link.name}
              {isActive && (
                <span className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-blue-600 rounded-full animate-in fade-in slide-in-from-left-2 duration-500" />
              )}
            </Link>
          );
        })}
      </div>

      {/* CTA BUTTON */}
      <Link
        href="/login"
        className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[2px] hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 active:scale-95 duration-300"
      >
        Masuk Dashboard
      </Link>
    </nav>
  );
}
