import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar Sederhana */}
      <nav className="flex justify-between items-center p-6 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-blue-600">Outsys Laundry</h1>
        <Link
          href="/login"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Masuk Dashboard
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-5xl font-extrabold mb-4 text-slate-900">
          Kelola Bisnis Laundry <br />{" "}
          <span className="text-blue-600">Lebih Profesional.</span>
        </h2>
        <p className="text-slate-600 max-w-lg text-lg mb-8">
          Satu aplikasi untuk kelola transaksi, antrean, hingga laporan keuangan
          otomatis. Hemat waktu, fokus kembangkan cabang.
        </p>
        <div className="flex gap-4">
          <Link
            href="/register"
            className="bg-slate-900 text-white px-8 py-3 rounded-full font-medium"
          >
            Mulai Sekarang
          </Link>
          <button className="border border-slate-300 px-8 py-3 rounded-full font-medium hover:bg-slate-50">
            Lihat Fitur
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-slate-400 text-sm border-t">
        © 2026 Outsys Space. Managed by ikwnhanif.
      </footer>
    </div>
  );
}
