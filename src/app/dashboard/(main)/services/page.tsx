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
  Pencil,
  Tag,
  Package,
  Banknote,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [formData, setFormData] = useState({ name: "", unit: "kg", price: 0 });
  const [selectedService, setSelectedService] = useState<any>(null);

  const storeId =
    typeof window !== "undefined" ? localStorage.getItem("store_id") : null;

  useEffect(() => {
    if (storeId) fetchServices();
  }, [storeId]);

  const fetchServices = async () => {
    try {
      const res = await api.get(`/services/${storeId}`);
      setServices(res.data || []);
    } catch (err) {
      toast.error("Gagal memuat daftar layanan");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/services", { ...formData, store_id: Number(storeId) });
      setIsOpen(false);
      setFormData({ name: "", unit: "kg", price: 0 });
      fetchServices();
      toast.success("Layanan baru berhasil ditambahkan");
    } catch {
      toast.error("Gagal menyimpan layanan");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/services/${selectedService.id}`, selectedService);
      setIsEditOpen(false);
      fetchServices();
      toast.success("Layanan berhasil diperbarui");
    } catch {
      toast.error("Gagal memperbarui layanan");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/services/${id}`);
      fetchServices();
      toast.success("Layanan telah dihapus");
    } catch {
      toast.error(
        "Gagal menghapus. Layanan mungkin masih digunakan dalam transaksi.",
      );
    }
  };

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-[950] text-slate-900 tracking-tighter uppercase">
            Master Layanan
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Konfigurasi paket laundry dan skema harga Anda.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 hover:bg-blue-600 shadow-xl shadow-slate-200 rounded-2xl h-12 px-6 font-black tracking-widest transition-all active:scale-95 text-xs">
              <Plus size={18} className="mr-2" /> TAMBAH PAKET
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[2.5rem] border-none p-8 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight">
                Paket Baru
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-6 pt-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Nama Layanan
                </label>
                <div className="relative">
                  <Package className="absolute left-4 top-3.5 h-5 w-5 text-slate-300" />
                  <Input
                    className="pl-12 h-13 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-bold"
                    placeholder="Contoh: Cuci Kering Setrika"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Satuan
                  </label>
                  <div className="relative">
                    <Layers className="absolute left-4 top-3.5 h-5 w-5 text-slate-300" />
                    <select
                      className="w-full h-13 pl-12 pr-4 rounded-2xl bg-slate-50 border-none text-sm font-bold outline-none appearance-none focus:ring-2 focus:ring-blue-500"
                      value={formData.unit}
                      onChange={(e) =>
                        setFormData({ ...formData, unit: e.target.value })
                      }
                    >
                      <option value="kg">Kilogram (kg)</option>
                      <option value="unit">Satuan (pcs)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Harga (Rp)
                  </label>
                  <div className="relative">
                    <Banknote className="absolute left-4 top-3.5 h-5 w-5 text-slate-300" />
                    <Input
                      type="number"
                      className="pl-12 h-13 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-bold"
                      placeholder="7000"
                      required
                      value={formData.price || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black tracking-widest rounded-2xl shadow-lg shadow-blue-100 transition-all"
              >
                SIMPAN LAYANAN
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* TABLE SECTION */}
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="w-[80px] pl-8 py-6 font-black text-[10px] uppercase tracking-widest text-slate-400">
                  ID
                </TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">
                  Nama Paket
                </TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">
                  Satuan
                </TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">
                  Harga Jual
                </TableHead>
                <TableHead className="text-right pr-8 font-black text-[10px] uppercase tracking-widest text-slate-400">
                  Opsi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length > 0 ? (
                services.map((s: any, index) => (
                  <TableRow
                    key={s.id}
                    className="hover:bg-slate-50/40 transition-colors border-slate-50"
                  >
                    <TableCell className="pl-8 py-5">
                      <span className="text-[10px] font-black text-slate-300">
                        #{(index + 1).toString().padStart(2, "0")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                          <Tag size={16} />
                        </div>
                        <span className="font-black text-slate-700 text-sm uppercase tracking-tight">
                          {s.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-none rounded-lg px-3 py-1 font-black text-[10px] uppercase tracking-widest">
                        {s.unit}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-black text-slate-900 text-base">
                        Rp {s.price.toLocaleString("id-ID")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-2xl text-blue-600 hover:bg-blue-50 transition-all active:scale-90"
                          onClick={() => {
                            setSelectedService(s);
                            setIsEditOpen(true);
                          }}
                        >
                          <Pencil size={18} />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 rounded-2xl text-rose-400 hover:bg-rose-50 transition-all active:scale-90"
                            >
                              <Trash2 size={18} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-2xl font-black">
                                Hapus Layanan?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="font-medium text-slate-500 pt-2">
                                Paket ini akan dihapus permanen. Pastikan tidak
                                ada transaksi aktif yang menggunakan layanan ini
                                agar sistem tidak error.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="pt-6">
                              <AlertDialogCancel className="rounded-2xl border-none bg-slate-100 font-black text-[10px] tracking-widest uppercase text-slate-600">
                                BATAL
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(s.id)}
                                className="bg-rose-600 hover:bg-rose-700 rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-lg shadow-rose-200"
                              >
                                HAPUS PERMANEN
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-24 text-slate-400 font-medium"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <Layers size={48} className="opacity-20" />
                      <p className="text-xs font-black uppercase tracking-widest opacity-50">
                        Belum ada daftar paket
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MODAL EDIT LAYANAN */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="rounded-[2.5rem] border-none p-8 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">
              Edit Layanan
            </DialogTitle>
          </DialogHeader>
          {selectedService && (
            <form onSubmit={handleUpdate} className="space-y-6 pt-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Nama Layanan
                </label>
                <div className="relative">
                  <Package className="absolute left-4 top-3.5 h-5 w-5 text-slate-300" />
                  <Input
                    className="pl-12 h-13 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-bold"
                    value={selectedService.name}
                    onChange={(e) =>
                      setSelectedService({
                        ...selectedService,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Satuan
                  </label>
                  <div className="relative">
                    <Layers className="absolute left-4 top-3.5 h-5 w-5 text-slate-300" />
                    <select
                      className="w-full h-13 pl-12 pr-4 rounded-2xl bg-slate-50 border-none text-sm font-bold outline-none appearance-none focus:ring-2 focus:ring-blue-500"
                      value={selectedService.unit}
                      onChange={(e) =>
                        setSelectedService({
                          ...selectedService,
                          unit: e.target.value,
                        })
                      }
                    >
                      <option value="kg">Kilogram (kg)</option>
                      <option value="unit">Satuan (pcs)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Harga Jual
                  </label>
                  <div className="relative">
                    <Banknote className="absolute left-4 top-3.5 h-5 w-5 text-slate-300" />
                    <Input
                      type="number"
                      className="pl-12 h-13 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-bold"
                      value={selectedService.price}
                      onChange={(e) =>
                        setSelectedService({
                          ...selectedService,
                          price: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-14 bg-slate-900 hover:bg-blue-600 text-white font-black tracking-widest rounded-2xl shadow-xl transition-all duration-300"
              >
                UPDATE LAYANAN
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
