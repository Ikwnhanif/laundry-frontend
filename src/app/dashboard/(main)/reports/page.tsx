"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  TrendingUp,
  TrendingDown,
  FileDown,
  Printer,
  Calendar as CalendarIcon,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import * as XLSX from "xlsx";

// --- INTERFACE UNTUK TYPESCRIPT ---
interface OrderDetail {
  id: number;
  created_at: string;
  customer_name: string;
  total_amount: number;
  service?: { name: string };
}

interface ExpenseDetail {
  id: number;
  date: string;
  title: string;
  category: string;
  amount: number;
}

export default function ReportsPage() {
  const [report, setReport] = useState({ income: 0, expense: 0, profit: 0 });
  const [details, setDetails] = useState<{
    orders: OrderDetail[];
    expenses: ExpenseDetail[];
  }>({
    orders: [],
    expenses: [],
  });

  // Default: Hari 1 sampai Akhir Bulan Ini
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      .toISOString()
      .split("T")[0],
  );

  const storeId =
    typeof window !== "undefined" ? localStorage.getItem("store_id") : null;

  // Data untuk Grafik (Simulasi mingguan berdasarkan total)
  const chartData = [
    {
      name: "Minggu 1",
      income: report.income * 0.2,
      expense: report.expense * 0.15,
    },
    {
      name: "Minggu 2",
      income: report.income * 0.3,
      expense: report.expense * 0.25,
    },
    {
      name: "Minggu 3",
      income: report.income * 0.25,
      expense: report.expense * 0.4,
    },
    {
      name: "Minggu 4",
      income: report.income * 0.25,
      expense: report.expense * 0.2,
    },
  ];

  const fetchReport = async () => {
    if (!storeId) return;
    try {
      const resStats = await api.get(
        `/reports/finance/${storeId}?start=${startDate}&end=${endDate}`,
      );
      setReport(resStats.data);

      const [resOrders, resExpenses] = await Promise.all([
        api.get(`/orders/${storeId}?limit=1000`),
        api.get(`/expenses/${storeId}`),
      ]);

      const filteredOrders = (resOrders.data.data || []).filter((o: any) => {
        const d = o.created_at.split("T")[0];
        return d >= startDate && d <= endDate && o.status === "picked_up";
      });

      const filteredExpenses = (resExpenses.data || []).filter((e: any) => {
        const d = e.date.split("T")[0];
        return d >= startDate && d <= endDate;
      });

      setDetails({ orders: filteredOrders, expenses: filteredExpenses });
    } catch (err) {
      toast.error("Gagal sinkronisasi laporan");
    }
  };

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate]);

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    // --- HELPER: FORMAT RUPIAH UNTUK EXCEL ---
    const toRupiah = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

    // ==========================================
    // SHEET 1: RINGKASAN EKSEKUTIF
    // ==========================================
    const summaryData = [
      ["OUTSYS LAUNDRY MANAGEMENT SYSTEM"], // Header Utama
      ["LAPORAN RINGKASAN KEUANGAN"],
      ["--------------------------------------------------"],
      ["Periode Laporan", `${startDate} s/d ${endDate}`],
      ["Dicetak Pada", new Date().toLocaleString("id-ID")],
      [""],
      ["IKHTISAR KEUANGAN", "NOMINAL"],
      ["Total Pemasukan (Lunas)", toRupiah(report.income)],
      ["Total Pengeluaran", toRupiah(report.expense)],
      ["--------------------------", "------------------"],
      ["LABA BERSIH (PROFIT)", toRupiah(report.profit)],
      ["--------------------------", "------------------"],
      [""],
      [
        "Status Performa",
        report.profit >= 0 ? "✅ SURPLUS (UNTUNG)" : "⚠️ DEFISIT (RUGI)",
      ],
    ];

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    // Setting Lebar Kolom (wch = width characters)
    wsSummary["!cols"] = [{ wch: 30 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(workbook, wsSummary, "1. Ringkasan");

    // ==========================================
    // SHEET 2: DAFTAR PEMASUKAN DETAIL
    // ==========================================
    const incomeHeader = [
      ["OUTSYS LAUNDRY - DATA PEMASUKAN DETAIL"],
      [`Periode: ${startDate} - ${endDate}`],
      [""],
      [
        "NO",
        "TANGGAL",
        "NAMA PELANGGAN",
        "NOMOR WA",
        "LAYANAN",
        "TOTAL BAYAR",
        "STATUS",
      ],
    ];

    const incomeRows = details.orders.map((o, index) => [
      index + 1,
      o.created_at.split("T")[0],
      o.customer_name.toUpperCase(),
      (o as any).customer_phone || "-",
      o.service?.name || "-",
      o.total_amount, // Biarkan angka mentah agar bisa di-SUM di Excel
      "LUNAS",
    ]);

    const wsIncome = XLSX.utils.aoa_to_sheet([...incomeHeader, ...incomeRows]);
    wsIncome["!cols"] = [
      { wch: 5 },
      { wch: 15 },
      { wch: 25 },
      { wch: 20 },
      { wch: 25 },
      { wch: 15 },
      { wch: 10 },
    ];
    XLSX.utils.book_append_sheet(workbook, wsIncome, "2. Rincian Pemasukan");

    // ==========================================
    // SHEET 3: DAFTAR PENGELUARAN DETAIL
    // ==========================================
    const expenseHeader = [
      ["OUTSYS LAUNDRY - DATA PENGELUARAN DETAIL"],
      [`Periode: ${startDate} - ${endDate}`],
      [""],
      [
        "NO",
        "TANGGAL",
        "KETERANGAN OPERASIONAL",
        "KATEGORI BIAYA",
        "NOMINAL (IDR)",
      ],
    ];

    const expenseRows = details.expenses.map((e, index) => [
      index + 1,
      e.date.split("T")[0],
      e.title.toUpperCase(),
      e.category,
      e.amount,
    ]);

    const wsExpense = XLSX.utils.aoa_to_sheet([
      ...expenseHeader,
      ...expenseRows,
    ]);
    wsExpense["!cols"] = [
      { wch: 5 },
      { wch: 15 },
      { wch: 40 },
      { wch: 20 },
      { wch: 15 },
    ];
    XLSX.utils.book_append_sheet(workbook, wsExpense, "3. Rincian Pengeluaran");

    // --- GENERATE FILE ---
    const fileName = `Laporan_Keuangan_Outsys_${startDate}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    toast.success("Excel Profesional Berhasil Dibuat", {
      description: "Data telah dipisahkan ke 3 sheet dengan formatting rapi.",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h2 className="text-3xl font-black text-slate-900">
            Laporan Keuangan
          </h2>
          <p className="text-slate-500 font-medium">
            Analisis profit & rincian transaksi harian.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-white border px-3 py-1 rounded-lg shadow-sm">
            <CalendarIcon size={16} className="text-slate-400" />
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-none shadow-none text-sm w-36"
            />
            <span className="text-slate-300">to</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border-none shadow-none text-sm w-36"
            />
          </div>
          <Button
            onClick={exportToExcel}
            variant="outline"
            className="gap-2 border-green-200 text-green-700 hover:bg-green-50"
          >
            <FileDown size={18} /> Excel
          </Button>
          <Button
            onClick={() => window.print()}
            className="gap-2 bg-slate-900 text-white"
          >
            <Printer size={18} /> Cetak PDF
          </Button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-blue-600 text-white border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase opacity-80">
              Pemasukan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">
              Rp {report.income.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 text-red-900 border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase opacity-60">
              Pengeluaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">
              Rp {report.expense.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-l-4 border-l-green-500 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase text-slate-500">
              Laba Bersih
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-black ${report.profit >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              Rp {report.profit.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GRAFIK TREN */}
      <Card className="border-none shadow-sm bg-white print:break-inside-avoid">
        <CardHeader>
          <CardTitle className="text-lg font-bold">
            Tren Pertumbuhan Mingguan
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] w-full pt-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#2563eb"
                strokeWidth={3}
                fill="url(#colorInc)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#f87171"
                strokeWidth={2}
                fill="transparent"
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* RINCIAN TABEL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:mt-10">
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ArrowUpRight size={16} className="text-green-500" /> Rincian
              Pemasukan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px]">Tgl</TableHead>
                  <TableHead className="text-[11px]">Nama</TableHead>
                  <TableHead className="text-right text-[11px]">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details.orders.map((o) => (
                  <TableRow key={o.id} className="text-[11px]">
                    <TableCell>{o.created_at.split("T")[0]}</TableCell>
                    <TableCell className="font-bold">
                      {o.customer_name}
                    </TableCell>
                    <TableCell className="text-right font-bold text-blue-600">
                      Rp {o.total_amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ArrowDownRight size={16} className="text-red-500" /> Rincian
              Pengeluaran
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px]">Tgl</TableHead>
                  <TableHead className="text-[11px]">Ket</TableHead>
                  <TableHead className="text-right text-[11px]">
                    Nominal
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details.expenses.map((e) => (
                  <TableRow key={e.id} className="text-[11px]">
                    <TableCell>{e.date.split("T")[0]}</TableCell>
                    <TableCell className="font-bold">{e.title}</TableCell>
                    <TableCell className="text-right font-bold text-red-600">
                      Rp {e.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }
          .print\:hidden {
            display: none !important;
          }
          body {
            background: white !important;
            font-size: 9pt;
          }
          .shadow-sm,
          .shadow-md {
            box-shadow: none !important;
            border: 1px solid #eee !important;
          }
        }
      `}</style>
    </div>
  );
}
