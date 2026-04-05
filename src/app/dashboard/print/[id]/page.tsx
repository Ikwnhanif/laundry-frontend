"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

export default function PrintReceiptPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    api.get(`/orders/detail/${id}`).then((res) => {
      setOrder(res.data);
      setTimeout(() => {
        window.print();
      }, 1000);
    });
  }, [id]);

  if (!order)
    return (
      <div className="p-10 text-center font-sans">Menyiapkan Struk...</div>
    );

  /** * LOGIKA DINAMIS:
   * Jika database (order.store) kosong atau belum update,
   * kita ambil cadangan dari localStorage yang diisi saat Settings/Login.
   */
  const storeName =
    order.store?.name || localStorage.getItem("store_name") || "OUTSYS LAUNDRY";
  const storeAddress =
    order.store?.address ||
    localStorage.getItem("store_address") ||
    "Alamat belum diatur";
  const storeTagline =
    order.store?.tagline || localStorage.getItem("store_tagline") || "";
  const storePhone =
    order.store?.phone || localStorage.getItem("store_phone") || "";

  return (
    <div className="receipt-paper">
      <div className="receipt-content">
        <div className="header">
          <h1 className="store-name">{storeName.toUpperCase()}</h1>
          {storeTagline && <p className="tagline">"{storeTagline}"</p>}
          <p className="address">{storeAddress}</p>
          {storePhone && <p>WA: {storePhone}</p>}
        </div>

        <div className="info">
          <p>No: #ORD-{order.id}</p>
          <p>Tgl: {new Date(order.created_at).toLocaleString("id-ID")}</p>
          <p>Plg: {(order.customer_name || "Pelanggan").toUpperCase()}</p>
        </div>

        <table className="items-table">
          <thead>
            <tr>
              <th>Layanan</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className="service-name">{order.service?.name}</span>{" "}
                <br />
                <span className="detail">
                  {order.weight || order.qty} {order.service?.unit} x Rp{" "}
                  {order.service?.price?.toLocaleString("id-ID")}
                </span>
              </td>
              <td className="text-right">
                {order.total_amount?.toLocaleString("id-ID")}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="total-section">
          <div className="row large">
            <span>TOTAL</span>
            <span>Rp {order.total_amount?.toLocaleString("id-ID")}</span>
          </div>
          <div className="row">
            <span>STATUS</span>
            <span className="status">
              {order.payment_status === "paid" ? "LUNAS" : "BELUM BAYAR"}
            </span>
          </div>
        </div>

        <div className="footer">
          <p>*** TERIMA KASIH ***</p>
          <p>Cucian bersih, hati senang!</p>
          <p className="powered">Powered by Outsys Management</p>
        </div>
      </div>

      <style jsx>{`
        .receipt-paper {
          background: white;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          padding-top: 20px;
        }
        .receipt-content {
          width: 58mm;
          font-family: "Courier New", Courier, monospace;
          font-size: 11px;
          color: black;
        }
        .header {
          text-align: center;
          border-bottom: 1px dashed #000;
          padding-bottom: 8px;
          margin-bottom: 8px;
        }
        .store-name {
          font-size: 14px;
          font-weight: 900;
          margin: 0;
        }
        .tagline {
          font-size: 9px;
          font-style: italic;
          margin: 2px 0;
        }
        .address {
          font-size: 9px;
          margin: 2px 0;
        }
        .info {
          border-bottom: 1px dashed #000;
          padding-bottom: 6px;
          margin-bottom: 8px;
        }
        .info p {
          margin: 2px 0;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 8px;
        }
        .items-table th {
          text-align: left;
          border-bottom: 1px dashed #000;
          padding: 4px 0;
          font-size: 10px;
        }
        .service-name {
          font-weight: bold;
        }
        .detail {
          font-size: 9px;
        }
        .text-right {
          text-align: right;
        }
        .total-section {
          border-top: 1px dashed #000;
          padding-top: 6px;
        }
        .row {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
        }
        .large {
          font-size: 12px;
        }
        .footer {
          text-align: center;
          margin-top: 15px;
          border-top: 1px dashed #000;
          padding-top: 8px;
          font-size: 8px;
        }
        .powered {
          font-size: 7px;
          opacity: 0.5;
          margin-top: 4px;
        }
        @media print {
          @page {
            size: 58mm auto;
            margin: 0;
          }
          .receipt-paper {
            padding: 0;
            display: block;
          }
          .receipt-content {
            width: 58mm;
            padding: 2mm;
          }
        }
      `}</style>
    </div>
  );
}
