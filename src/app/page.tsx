"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Printer,
  Smartphone,
  ShieldCheck,
  Zap,
  Globe,
  Database,
  Lock,
  Cpu,
  Sparkles,
  ChevronRight,
} from "lucide-react";

// --- KONFIGURASI ANIMASI (FIX TYPESCRIPT ERROR) ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const techStack = [
  { name: "Next.js 16", icon: <Globe size={20} />, color: "bg-black" },
  { name: "Go Fiber", icon: <Zap size={20} />, color: "bg-cyan-500" },
  { name: "SQL", icon: <Database size={20} />, color: "bg-blue-600" },
  {
    name: "Tailwind CSS",
    icon: <LayoutDashboard size={20} />,
    color: "bg-sky-400",
  },
  { name: "JWT Secure", icon: <Lock size={20} />, color: "bg-rose-500" },
  { name: "Dockerized", icon: <Cpu size={20} />, color: "bg-indigo-500" },
];

const features = [
  {
    title: "Smart Order System",
    desc: "Kalkulasi otomatis berat, harga, dan estimasi selesai dalam hitungan detik.",
    icon: <Zap />,
  },
  {
    title: "Financial Insights",
    desc: "Laporan laba rugi bulanan dan statistik omzet yang disajikan secara visual.",
    icon: <BarChart3 />,
  },
  {
    title: "Nota Digital & Print",
    desc: "Cetak struk thermal profesional atau kirim nota via WhatsApp Link otomatis.",
    icon: <Printer />,
  },
  {
    title: "Scalability Ready",
    desc: "Sistem multi-store yang memungkinkan Anda mengelola 100+ cabang sekaligus.",
    icon: <Globe />,
  },
  {
    title: "Mobile Dashboard",
    desc: "Pantau performa laundry dari genggaman tangan, kapanpun dan dimanapun.",
    icon: <Smartphone />,
  },
  {
    title: "Secure Vault",
    desc: "Database terenkripsi dengan proteksi JWT untuk keamanan data pelanggan Anda.",
    icon: <Lock />,
  },
];

export default function LandingPage() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD] selection:bg-blue-100 selection:text-blue-700 font-sans overflow-x-hidden">
      {/* --- NAVBAR --- */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-[100] flex justify-between items-center px-6 md:px-20 py-5 bg-white/70 backdrop-blur-xl border-b border-slate-100"
      >
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-200">
            <Sparkles className="text-white h-5 w-5" />
          </div>
          <h1 className="text-xl font-[1000] tracking-tighter text-slate-900 uppercase">
            OUTSYS<span className="text-blue-600">LAUNDRY</span>
          </h1>
        </div>
        <div className="hidden md:flex gap-10 text-[11px] font-black uppercase tracking-[2px] text-slate-400">
          <a href="#fitur" className="hover:text-blue-600 transition-colors">
            Fitur
          </a>
          <a href="#tech" className="hover:text-blue-600 transition-colors">
            Tech Stack
          </a>
          <a href="/help" className="hover:text-blue-600 transition-colors">
            Bantuan
          </a>
        </div>
        <Link
          href="/login"
          className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 active:scale-95 duration-300"
        >
          Masuk Dashboard
        </Link>
      </motion.nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-24 pb-20 md:pt-40 md:pb-32 overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] bg-blue-100 blur-[150px] rounded-full opacity-50"
          />
          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: [0, -5, 0] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-100 blur-[120px] rounded-full opacity-50"
          />
        </div>

        <motion.div
          className="container mx-auto px-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[2px] mb-8 border border-blue-100 shadow-sm"
          >
            <ShieldCheck size={14} className="animate-pulse" /> SaaS Platform
            Terpercaya & Secure
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-6xl md:text-[6rem] font-[1000] mb-8 text-slate-900 tracking-[-0.05em] leading-[0.92]"
          >
            Masa Depan Bisnis <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-tr from-blue-600 to-indigo-500 relative">
              Laundry Dimulai.
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-slate-500 max-w-2xl mx-auto text-lg md:text-xl mb-14 leading-relaxed font-medium"
          >
            Tinggalkan pencatatan manual. Kendalikan transaksi, pantau antrean,
            hingga laporan laba rugi otomatis dalam satu aplikasi cerdas
            berkecepatan 0.5ms.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            <Link
              href="/register"
              className="w-full sm:w-auto bg-blue-600 text-white px-14 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-slate-900 transition-all duration-300 shadow-[0_20px_50px_rgba(37,99,235,0.3)] active:scale-95 group flex items-center gap-2"
            >
              Coba Gratis{" "}
              <ChevronRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="#fitur"
              className="w-full sm:w-auto border border-slate-200 bg-white text-slate-900 px-14 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
            >
              Eksplorasi Fitur
            </Link>
          </motion.div>
        </motion.div>
      </header>

      {/* --- TECH STACK --- */}
      <section id="tech" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="p-1 rounded-[3rem] border border-slate-100 bg-slate-50 overflow-hidden"
          >
            <div className="bg-white rounded-[2.8rem] p-12 shadow-sm flex flex-col md:flex-row items-center gap-12">
              <div className="md:max-w-xs text-left">
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4 leading-none">
                  Built with <br />
                  <span className="text-blue-600">Premium Tech.</span>
                </h3>
                <p className="text-slate-400 text-[11px] font-black uppercase tracking-[2px] opacity-70">
                  Performa instan 0.5ms dijamin oleh kombinasi Next.js 16 & Go
                  Fiber v2.
                </p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                {techStack.map((tech, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-4 p-5 bg-slate-50 rounded-[1.8rem] border border-slate-100"
                  >
                    <div
                      className={`${tech.color} p-3 rounded-xl text-white shadow-lg shadow-slate-200`}
                    >
                      {tech.icon}
                    </div>
                    <span className="font-black text-[11px] uppercase tracking-widest text-slate-600">
                      {tech.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FEATURE GRID --- */}
      <section id="fitur" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 space-y-3">
            <div className="text-blue-600 font-black text-[11px] uppercase tracking-[5px]">
              Core Ecosystem
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">
              Solusi Tuntas Operasional Anda.
            </h3>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="relative group p-10 bg-white border border-slate-100/80 rounded-[2.5rem] overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
              >
                <AnimatePresence>
                  {hoveredIdx === index && (
                    <motion.div
                      className="absolute inset-0 bg-blue-600 z-0"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>

                <div className="relative z-10 space-y-8">
                  <div
                    className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-300 ${hoveredIdx === index ? "bg-white/10 text-white scale-110" : "bg-slate-50 text-blue-600"}`}
                  >
                    {item.icon}
                  </div>
                  <div className="space-y-4">
                    <h4
                      className={`text-xl font-black uppercase tracking-tight transition-colors duration-300 ${hoveredIdx === index ? "text-white" : "text-slate-900"}`}
                    >
                      {item.title}
                    </h4>
                    <p
                      className={`font-medium text-sm leading-relaxed transition-colors duration-300 ${hoveredIdx === index ? "text-blue-100" : "text-slate-400"}`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { val: "100%", label: "Secure Database" },
              { val: "24/7", label: "Monitoring" },
              { val: "0.5s", label: "Api Latency" },
              { val: "Guaranteed", label: "Easy to Use" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-5xl font-[1000] text-blue-500 tracking-tighter uppercase">
                  {stat.val}
                </div>
                <div className="text-slate-500 text-[10px] font-black uppercase tracking-[3px] mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 bg-white border-t border-slate-50 mt-auto">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-slate-900 p-2.5 rounded-xl">
                <Sparkles className="text-white h-5 w-5" />
              </div>
              <h1 className="text-xl font-[1000] text-slate-900 uppercase tracking-tighter">
                OUTSYS<span className="text-blue-600">LAUNDRY</span>
              </h1>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[3px] opacity-70">
              Secured Enterprise Cloud Solution v1.0
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-[1px]">
              © 2026 Crafted by ikwnhanif
            </p>
            <div className="flex gap-6 text-[9px] font-black text-slate-300 uppercase tracking-widest">
              <a href="#" className="hover:text-blue-600">
                Privacy
              </a>
              <a href="#" className="hover:text-blue-600">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
