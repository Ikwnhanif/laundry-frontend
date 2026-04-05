"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle, Mail, Phone, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";

export default function HelpPage() {
  const faqs = [
    {
      q: "Bagaimana cara mencetak struk thermal?",
      a: "Anda cukup membuka detail order, lalu klik tombol 'Cetak PDF'. Pastikan printer thermal Anda sudah terhubung ke laptop/PC dan pilih ukuran kertas 58mm atau 80mm pada pengaturan browser.",
    },
    {
      q: "Apakah data saya aman jika saya logout?",
      a: "Tentu. Semua data tersimpan di server cloud Outsys yang terenkripsi. Anda bisa login kembali kapan saja dari perangkat mana pun tanpa kehilangan data.",
    },
    {
      q: "Bisakah saya mengelola lebih dari satu cabang laundry?",
      a: "Bisa. Dengan paket Enterprise, Anda bisa mengelola banyak cabang (Multi-Store) dalam satu dashboard pusat.",
    },
    {
      q: "Bagaimana cara menghitung laba bersih?",
      a: "Sistem secara otomatis menghitung Pendapatan dikurangi Pengeluaran yang Anda input di menu 'Pengeluaran'. Anda bisa melihat hasilnya di menu Laporan.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/30">
      <Navbar />
      {/* Search Header */}
      <section className="bg-blue-600 py-20 px-6 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-black mb-6">
          Ada yang bisa kami bantu?
        </h2>
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-3.5 text-slate-400 h-5 w-5" />
          <Input
            placeholder="Cari solusi masalah Anda (misal: struk, laporan)..."
            className="h-12 pl-12 rounded-full border-none text-slate-900 shadow-xl"
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-6 py-20 max-w-3xl">
        <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
          Pertanyaan Populer
        </h3>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white border px-6 rounded-2xl shadow-sm"
            >
              <AccordionTrigger className="font-bold text-slate-700 hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-500 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-6 pb-24">
        <div className="bg-white border rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div>
            <h4 className="text-2xl font-black text-slate-900 mb-2">
              Masih punya pertanyaan?
            </h4>
            <p className="text-slate-500">
              Tim support kami siap membantu operasional bisnis Anda.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://wa.me/628xxx"
              className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition"
            >
              <MessageCircle size={20} /> WhatsApp
            </a>
            <a
              href="mailto:support@outsys.space"
              className="flex items-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition"
            >
              <Mail size={20} /> Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
