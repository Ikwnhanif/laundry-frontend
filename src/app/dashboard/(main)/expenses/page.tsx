"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Trash2,
  Wallet,
  Calendar,
  Tag,
  AlertCircle,
  ArrowDownCircle,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: 0,
    category: "Operasional",
  });

  const storeId =
    typeof window !== "undefined" ? localStorage.getItem("store_id") : null;

  useEffect(() => {
    if (storeId) fetchExpenses();
  }, [storeId]);

  const fetchExpenses = async () => {
    try {
      const res = await api.get(`/expenses/${storeId}`);
      setExpenses(res.data || []);
    } catch {
      toast.error("Gagal memuat data pengeluaran");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/expenses", {
        ...formData,
        store_id: Number(storeId),
        amount: Number(formData.amount),
      });
      setIsOpen(false);
      setFormData({ title: "", amount: 0, category: "Operasional" });
      fetchExpenses();
      toast.success("Pengeluaran berhasil dicatat", {
        description: "Saldo laporan keuangan akan otomatis terupdate.",
      });
    } catch {
      toast.error("Gagal menyimpan data");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
      toast.success("Catatan dihapus");
    } catch {
      toast.error("Gagal menghapus data");
    }
  };

  const totalExpense = expenses.reduce(
    (acc: any, curr: any) => acc + curr.amount,
    0,
  );

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-[950] text-slate-900 tracking-tighter uppercase">
            Biaya Operasional
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Monitoring pengeluaran rutin toko Anda.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-200 rounded-2xl h-12 px-6 font-black tracking-widest transition-all active:scale-95 text-xs">
              <Plus size={18} className="mr-2" /> CATAT BIAYA
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[2.5rem] border-none p-8 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight">
                Tambah Pengeluaran
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-6 pt-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Keterangan Biaya
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-3.5 h-5 w-5 text-slate-300" />
                  <Input
                    className="pl-12 h-13 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 font-bold"
                    placeholder="Contoh: Listrik Bulanan atau Deterjen"
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Kategori
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-3.5 h-5 w-5 text-slate-300 pointer-events-none" />
                    <select
                      className="w-full h-13 pl-12 pr-4 rounded-2xl bg-slate-50 border-none text-sm font-bold outline-none appearance-none focus:ring-2 focus:ring-rose-500"
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    >
                      <option value="Operasional">Operasional</option>
                      <option value="Gaji">Gaji</option>
                      <option value="Listrik/Air">Listrik/Air</option>
                      <option value="Sewa">Sewa</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Nominal (Rp)
                  </label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-3.5 h-5 w-5 text-slate-300" />
                    <Input
                      type="number"
                      className="pl-12 h-13 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-rose-500 font-bold"
                      placeholder="0"
                      required
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          amount: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-white font-black tracking-widest rounded-2xl shadow-lg shadow-rose-100 transition-all"
              >
                SIMPAN PENGELUARAN
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* SUMMARY CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-rose-600 rounded-[2rem] overflow-hidden">
          <CardContent className="p-7 flex items-center gap-5 text-white">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl">
              <ArrowDownCircle size={32} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[2px] opacity-80">
                Total Pengeluaran
              </p>
              <p className="text-3xl font-black tracking-tighter">
                Rp {totalExpense.toLocaleString("id-ID")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TABLE SECTION */}
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="pl-8 py-6 font-black text-[10px] uppercase tracking-widest text-slate-400">
                  Tanggal
                </TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">
                  Keterangan
                </TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">
                  Kategori
                </TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">
                  Nominal
                </TableHead>
                <TableHead className="text-right pr-8 font-black text-[10px] uppercase tracking-widest text-slate-400">
                  Opsi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.length > 0 ? (
                expenses.map((ex: any) => (
                  <TableRow
                    key={ex.id}
                    className="hover:bg-slate-50/40 transition-colors border-slate-50"
                  >
                    <TableCell className="pl-8 py-5">
                      <div className="flex items-center gap-2 font-bold text-slate-500 text-xs">
                        <Calendar size={14} className="opacity-40" />
                        {new Date(ex.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-black text-slate-700 text-sm uppercase tracking-tight">
                        {ex.title}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-[10px] px-3 py-1 bg-slate-100 text-slate-500 rounded-lg font-black uppercase tracking-widest">
                        {ex.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-black text-rose-600 text-base">
                        Rp {ex.amount.toLocaleString("id-ID")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-2xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-90"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl font-black">
                              Hapus Catatan?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="font-medium text-slate-500 pt-2">
                              Data pengeluaran ini akan dihapus permanen. Hal
                              ini akan mempengaruhi laporan laba rugi Anda.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="pt-6">
                            <AlertDialogCancel className="rounded-2xl border-none bg-slate-100 font-black text-[10px] tracking-widest uppercase text-slate-600">
                              BATAL
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(ex.id)}
                              className="bg-rose-600 hover:bg-rose-700 rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-lg shadow-rose-200"
                            >
                              HAPUS PERMANEN
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-24">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-6 bg-slate-50 rounded-[2rem]">
                        <AlertCircle size={48} className="text-slate-200" />
                      </div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                        Belum ada biaya tercatat
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
