"use client";
import Link from "next/link";
import { Check, LayoutDashboard, Zap, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "Gratis",
      desc: "Cocok untuk laundry rumahan yang baru mulai.",
      features: [
        "Maksimal 50 Order/Bulan",
        "Laporan Harian",
        "Struk Digital (WA)",
        "1 Akun Admin",
      ],
      button: "Mulai Gratis",
      highlight: false,
    },
    {
      name: "Pro Business",
      price: "Rp 99.000",
      period: "/bulan",
      desc: "Fitur lengkap untuk bisnis laundry yang sedang tumbuh.",
      features: [
        "Unlimited Order",
        "Laporan Keuangan & Grafik",
        "Cetak Struk Thermal",
        "Manajemen Pengeluaran",
        "Prioritas Support",
      ],
      button: "Pilih Pro",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "Solusi untuk laundry franchise dengan banyak cabang.",
      features: [
        "Multi-Store Management",
        "API Access",
        "Custom Domain",
        "Training Karyawan",
        "Account Manager Khusus",
      ],
      button: "Hubungi Kami",
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Navbar />
      {/* Header */}
      <section className="py-20 text-center px-4">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
          Pilih Paket yang <span className="text-blue-600">Sesuai.</span>
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto text-lg">
          Investasi cerdas untuk efisiensi bisnis laundry Anda. Tanpa biaya
          tersembunyi.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-3xl border ${plan.highlight ? "border-blue-600 shadow-2xl shadow-blue-100 scale-105 z-10 bg-white" : "border-slate-100 bg-white"}`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-black uppercase px-4 py-1 rounded-full flex items-center gap-1">
                  <Star size={12} fill="currentColor" /> Paling Populer
                </div>
              )}
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                {plan.name}
              </h4>
              <div className="mb-6">
                <span className="text-4xl font-black text-slate-900">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-slate-400 font-medium text-sm">
                    {plan.period}
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                {plan.desc}
              </p>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm font-medium text-slate-600"
                  >
                    <div className="bg-blue-50 p-1 rounded-full">
                      <Check size={12} className="text-blue-600" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`w-full h-12 rounded-xl font-bold transition-all ${plan.highlight ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20" : "bg-slate-100 text-slate-900 hover:bg-slate-200 shadow-none"}`}
              >
                <Link href="/register">{plan.button}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
