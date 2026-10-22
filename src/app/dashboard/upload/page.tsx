import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { CATEGORIES } from "@/lib/constants";
import { uploadItem } from "./actions";
import { SubmitButton } from "./SubmitButton";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowLeft,
  ArrowLeftRight,
  Gift,
  Image as ImageIcon,
  Info,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, string> = {
  BUKU: "📚 Buku & Modul",
  PAKAIAN: "👕 Pakaian & OOTD",
  ELEKTRONIK: "⚡ Elektronik & Gadget",
  ALAT_TULIS: "✏️ Alat Tulis & Praktikum",
  AKSESORIS: "🎒 Aksesoris & Tas",
  LAINNYA: "📦 Perlengkapan Kost & Lainnya",
};

export default async function UploadPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 mx-auto max-w-3xl w-full px-4 py-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Dashboard</span>
          </Link>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
            Unggah Barang Bekas
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Dukung gerakan SDG 12 kampus. Barang yang kamu unggah akan langsung dapat dilihat mahasiswa lain di katalog.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200/80">
          <form action={uploadItem} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nama Barang / Judul <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                required
                maxLength={100}
                placeholder="Contoh: Kalkulator Ilmiah Casio fx-991EX / Buku Fisika Dasar Halliday"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
              />
            </div>

            {/* Type Selector (Barter vs Donasi) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Pilih Tipe Listing <span className="text-red-500">*</span>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="relative flex cursor-pointer rounded-2xl border border-slate-200 p-4 transition hover:border-amber-300 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50/40 has-[:checked]:ring-2 has-[:checked]:ring-amber-200">
                  <input
                    type="radio"
                    name="type"
                    value="BARTER"
                    defaultChecked
                    className="sr-only"
                  />
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                      <ArrowLeftRight className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Barter (Tukar Barang)</div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        Kamu ingin menukar barang ini dengan barang lain milik mahasiswa lain.
                      </div>
                    </div>
                  </div>
                </label>

                <label className="relative flex cursor-pointer rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-300 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/40 has-[:checked]:ring-2 has-[:checked]:ring-emerald-200">
                  <input
                    type="radio"
                    name="type"
                    value="DONASI"
                    className="sr-only"
                  />
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <Gift className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Donasi Gratis</div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        Diberikan secara cuma-cuma kepada mahasiswa yang membutuhkan.
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Kategori Barang <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                required
                defaultValue="BUKU"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {CATEGORY_ICONS[c.value] ?? c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Deskripsi & Kondisi Barang <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                placeholder="Jelaskan kondisi fisik (misal: 9/10 masih mulus, ada sedikit coretan pensil di bab 3), kelengkapan, dan barang apa yang kamu cari jika barter..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
              />
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                URL Foto Barang <span className="text-xs font-normal text-slate-400 lowercase">(opsional — auto placeholder jika kosong)</span>
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                />
              </div>
              <p className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-400">
                <Info className="h-3.5 w-3.5 shrink-0" />
                <span>Tips: Kamu bisa menggunakan link gambar dari Unsplash, PostImages, atau Google Drive publik.</span>
              </p>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <SubmitButton />
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
