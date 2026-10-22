import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { MobileBottomNav } from "@/components/MobileBottomNav";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "GreenSwap Digital — Barter & Donasi Barang Bekas Mahasiswa Kampus (SDG 12)",
  description:
    "Platform circular economy kampus untuk pertukaran dan donasi barang bekas mahasiswa: buku kuliah, pakaian, gadget, dan alat tulis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-slate-50 text-slate-900 antialiased pb-20 md:pb-0`}
      >
        <Providers>
          {children}
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}
