import { Inter } from "next/font/google";
import "@/app/globals.css";
// IMPORT DARI SINI
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}
        {/* TAMBAHKAN INI SEBELUM TUTUP BODY */}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
