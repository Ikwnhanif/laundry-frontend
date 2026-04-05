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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Printer,
  MessageCircle,
  Phone,
  User,
  Filter,
  AlertCircle,
} from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    service_id: "",
    weight: 0,
    qty: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const storeId =
    typeof window !== "undefined" ? localStorage.getItem("store_id") : null;

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter, page]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get(
        `/orders/${storeId}?search=${search}&status=${statusFilter}&page=${page}&limit=10`,
      );
      if (res.data.data) {
        setOrders(res.data.data);
        setTotalPages(res.data.last_page || 1);
      } else {
        setOrders(res.data || []);
      }
    } catch (err) {
      toast.error("Gagal mengambil data pesanan");
    }
  };

  const fetchServices = async () => {
    const res = await api.get(`/services/${storeId}`);
    setServices(res.data || []);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/orders", {
        ...formData,
        store_id: Number(storeId),
        service_id: Number(formData.service_id),
      });
      setIsOpen(false);
      fetchOrders();
      toast.success("Pesanan berhasil dibuat");
    } catch {
      toast.error("Gagal membuat pesanan");
    }
  };

  // --- FUNGSI CETAK STRUK (YANG TADI ERROR) ---
  const handlePrint = (id: number) => {
    window.open(`/dashboard/print/${id}`, "_blank");
  };

  const handleUpdate = async (id: number, status: string, payment: string) => {
    try {
      let finalPayment = payment;
      if (status === "picked_up") finalPayment = "paid";

      await api.put(`/orders/${id}`, {
        status: status,
        payment_status: finalPayment,
      });

      fetchOrders();
      toast.success(
        status === "picked_up"
          ? "Pesanan Selesai & Lunas"
          : "Status diperbarui",
      );
    } catch {
      toast.error("Gagal memperbarui status");
    }
  };

  const handleWhatsAppNotify = (order: any) => {
    let phone = order.customer_phone.replace(/\D/g, "");
    if (phone.startsWith("0")) phone = "62" + phone.slice(1);
    else if (!phone.startsWith("62")) phone = "62" + phone;

    const total = order.total_amount.toLocaleString("id-ID");
    const statusBayar =
      order.payment_status === "paid" ? "*SUDAH LUNAS*" : "*BELUM LUNAS*";

    const templates = [
      `Halo Kak *${order.customer_name}*, laundry kamu dengan kode #ORD-${order.id} sudah *SIAP DIAMBIL* nih! %0A%0ATotal: Rp ${total} (${statusBayar}). %0A%0ATerima kasih - Outsys Laundry`,
      `Kabar gembira Kak *${order.customer_name}*! Cucian kamu sudah rapi dan wangi. Bisa diambil di outlet ya. %0A%0ANota: #ORD-${order.id} %0ATotal: Rp ${total} (${statusBayar}).`,
    ];

    const randomMsg = templates[Math.floor(Math.random() * templates.length)];
    const url = `https://wa.me/${phone}?text=${randomMsg}`;
    window.open(url, "_blank");
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/orders/${id}`);
      fetchOrders();
      toast.success("Pesanan berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus pesanan");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/orders/${selectedOrder.id}`, selectedOrder);
      setIsEditOpen(false);
      fetchOrders();
      toast.success("Data pelanggan diperbarui");
    } catch {
      toast.error("Gagal update data");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">
            Antrean
          </Badge>
        );
      case "washing":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
            Proses
          </Badge>
        );
      case "ready":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
            Siap
          </Badge>
        );
      case "picked_up":
        return (
          <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200">
            Selesai
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Transaksi
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Kelola masuk dan keluar pakaian pelanggan.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 rounded-xl h-11 px-6 font-bold transition-all active:scale-95">
              <Plus size={20} className="mr-2" /> Pesanan Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">
                Buat Pesanan
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-5 pt-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">
                  Nama Pelanggan
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-300" />
                  <Input
                    className="pl-11 h-12 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Contoh: Budi Santoso"
                    required
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customer_name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">
                  Nomor WhatsApp
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 h-4 w-4 text-slate-300" />
                  <Input
                    className="pl-11 h-12 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="0812xxxx"
                    required
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customer_phone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">
                  Layanan
                </label>
                <select
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 border-none text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  onChange={(e) =>
                    setFormData({ ...formData, service_id: e.target.value })
                  }
                  required
                >
                  <option value="">Pilih Layanan</option>
                  {services.map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Rp {s.price})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 ml-1">
                    Berat (Kg)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    className="h-12 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.0"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weight: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 ml-1">
                    Jumlah (Pcs)
                  </label>
                  <Input
                    type="number"
                    className="h-12 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    onChange={(e) =>
                      setFormData({ ...formData, qty: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-14 bg-slate-900 hover:bg-black text-white font-black tracking-widest rounded-2xl mt-4 shadow-xl transition-all"
              >
                SIMPAN PESANAN
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="border-b border-slate-50 p-8">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari nama atau nomor HP..."
                className="pl-12 h-11 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-slate-50 px-4 py-2 rounded-2xl flex items-center gap-3 border border-slate-100">
                <Filter size={14} className="text-slate-400" />
                <select
                  className="bg-transparent border-none text-xs outline-none focus:ring-0 font-black uppercase tracking-wider text-slate-600 cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">Semua Status</option>
                  <option value="pending">Antrean</option>
                  <option value="washing">Proses</option>
                  <option value="ready">Siap</option>
                  <option value="picked_up">Selesai</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50 border-b border-slate-50">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-black text-[10px] uppercase tracking-[2px] text-slate-400 pl-8 py-5">
                  Pelanggan
                </TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-[2px] text-slate-400">
                  Layanan
                </TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-[2px] text-slate-400">
                  Total Tagihan
                </TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-[2px] text-slate-400">
                  Status
                </TableHead>
                <TableHead className="text-right pr-8 font-black text-[10px] uppercase tracking-[2px] text-slate-400">
                  Opsi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order: any) => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-slate-50/40 transition-colors border-slate-50/60"
                  >
                    <TableCell className="pl-8 py-6">
                      <div className="font-black text-slate-800 uppercase text-xs tracking-tight">
                        {order.customer_name}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 mt-1 opacity-70">
                        <Phone size={10} /> {order.customer_phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-black text-slate-700">
                        {order.service?.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">
                        {order.weight || order.qty} {order.service?.unit}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-black text-blue-600 text-sm">
                        Rp {order.total_amount.toLocaleString()}
                      </div>
                      <div
                        className={`text-[9px] font-black uppercase mt-1 ${order.payment_status === "paid" ? "text-emerald-500" : "text-rose-500"}`}
                      >
                        {order.payment_status === "paid"
                          ? "● Paid"
                          : "○ Unpaid"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        {getStatusBadge(order.status)}
                        <select
                          className="text-[9px] border-none bg-slate-100 hover:bg-slate-200 transition-colors rounded-lg px-2 py-1.5 outline-none cursor-pointer font-black uppercase text-slate-500"
                          value={order.status}
                          onChange={(e) =>
                            handleUpdate(
                              order.id,
                              e.target.value,
                              order.payment_status,
                            )
                          }
                        >
                          <option value="pending">Antrean</option>
                          <option value="washing">Proses</option>
                          <option value="ready">Siap</option>
                          <option value="picked_up">Selesai</option>
                        </select>
                      </div>
                    </TableCell>
                    <TableCell className="pr-8">
                      <div className="flex justify-end items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-2xl text-emerald-600 hover:bg-emerald-50 transition-all active:scale-90"
                          onClick={() => handleWhatsAppNotify(order)}
                          title="WhatsApp"
                        >
                          <MessageCircle size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-2xl text-slate-500 hover:bg-slate-100 transition-all active:scale-90"
                          onClick={() => handlePrint(order.id)}
                          title="Cetak Struk"
                        >
                          <Printer size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-2xl text-blue-600 hover:bg-blue-50 transition-all active:scale-90"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsEditOpen(true);
                          }}
                          title="Edit"
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
                          <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-black text-2xl text-slate-900">
                                Hapus Data?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-slate-500 font-medium pt-2">
                                Data transaksi ini akan hilang permanen dari
                                sistem kami. Pastikan Anda sudah yakin.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="pt-6">
                              <AlertDialogCancel className="rounded-2xl border-none bg-slate-100 font-black text-xs uppercase tracking-widest text-slate-600">
                                Batal
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(order.id)}
                                className="rounded-2xl bg-rose-600 font-black text-xs uppercase tracking-widest hover:bg-rose-700 shadow-lg shadow-rose-200"
                              >
                                Hapus Permanen
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
                    className="text-center py-32 text-slate-400 font-medium"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-slate-50 p-6 rounded-[2rem]">
                        <AlertCircle className="opacity-20" size={64} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-900 font-black uppercase text-xs tracking-widest">
                          Data Kosong
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Belum ada transaksi ditemukan pada filter ini.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between px-8 py-5 bg-white rounded-[2rem] shadow-sm border border-slate-50">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[3px]">
          Page <span className="text-blue-600">{page}</span>{" "}
          <span className="mx-1">/</span>{" "}
          <span className="text-slate-900">{totalPages}</span>
        </p>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-10 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft size={16} className="mr-2" /> Prev
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next <ChevronRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">
              Edit Pelanggan
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <form onSubmit={handleEditSubmit} className="space-y-6 pt-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Nama Pelanggan
                </label>
                <Input
                  className="h-13 rounded-2xl bg-slate-50 border-none font-bold text-slate-700"
                  value={selectedOrder.customer_name}
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      customer_name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Nomor WhatsApp
                </label>
                <Input
                  className="h-13 rounded-2xl bg-slate-50 border-none font-bold text-slate-700"
                  value={selectedOrder.customer_phone}
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      customer_phone: e.target.value,
                    })
                  }
                />
              </div>
              <Button
                type="submit"
                className="w-full h-14 bg-slate-900 hover:bg-blue-600 text-white font-black tracking-widest rounded-2xl mt-4 shadow-xl transition-all duration-300"
              >
                UPDATE DATA
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
