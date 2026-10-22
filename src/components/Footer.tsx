import Link from "next/link";
import { Leaf, ShieldCheck, HeartHandshake, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white text-slate-600">
      {/* Top Value Banner */}
      <div className="border-b border-slate-100 bg-emerald-50/50 py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Mendukung SDG 12</h4>
                <p className="text-xs text-slate-500">Konsumsi bertanggung jawab & kurangi sampah kos.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">100% Barter & Donasi</h4>
                <p className="text-xs text-slate-500">Tanpa uang, murni saling bantu sesama mahasiswa.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">COD Aman di Kampus</h4>
                <p className="text-xs text-slate-500">Janji temu langsung di titik ramai sekitar kampus.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 text-xl font-black text-emerald-600">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-base text-white shadow-sm">
                ♻️
              </span>
              <span>GreenSwap <span className="text-slate-800">Digital</span></span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-slate-500 leading-relaxed">
              Platform pertukaran barang bekas & donasi antar mahasiswa kampus. Perpanjang siklus hidup buku, pakaian, gadget, dan perlengkapan kos.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full w-fit">
              <Sparkles className="h-3.5 w-3.5" />
              Circular Economy Kampus
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Kategori Populer</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/catalog?category=BUKU" className="hover:text-emerald-600 transition">
                  📚 Buku Kuliah & Modul
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=PAKAIAN" className="hover:text-emerald-600 transition">
                  👕 Pakaian & Thrift OOTD
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=ELEKTRONIK" className="hover:text-emerald-600 transition">
                  ⚡ Elektronik & Aksesoris HP
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=ALAT_TULIS" className="hover:text-emerald-600 transition">
                  ✏️ Alat Tulis & Praktikum
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Navigasi Cepat</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/catalog" className="hover:text-emerald-600 transition">
                  Katalog Barang
                </Link>
              </li>
              <li>
                <Link href="/dashboard/upload" className="hover:text-emerald-600 transition">
                  Unggah Barang Bekas
                </Link>
              </li>
              <li>
                <Link href="/dashboard/requests" className="hover:text-emerald-600 transition">
                  Permintaan Barter
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-emerald-600 transition">
                  Masuk Akun
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} GreenSwap Digital. Dikembangkan untuk gerakan kampus hijau & SDG 12.</p>
          <div className="flex items-center gap-4">
            <span>Privasi & Etika COD</span>
            <span>·</span>
            <span>Panduan Barter</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
