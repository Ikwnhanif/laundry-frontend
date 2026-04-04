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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storeId = localStorage.getItem("store_id");
    api
      .get(`/orders/${storeId}`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manajemen Pesanan</h2>
        <Button className="flex gap-2">
          <Plus size={18} /> Tambah Order
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Layanan</TableHead>
                <TableHead>Berat/Qty</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.customer_name}
                  </TableCell>
                  <TableCell>{order.service?.name}</TableCell>
                  <TableCell>
                    {order.weight > 0
                      ? `${order.weight} Kg`
                      : `${order.qty} Unit`}
                  </TableCell>
                  <TableCell>
                    Rp {order.total_amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-semibold">
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Update Status
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
