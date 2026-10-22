import Link from "next/link";
import { db } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ItemCard } from "@/components/ItemCard";
import {
  ArrowRight,
  Sparkles,
  Leaf,
  ShieldCheck,
  CheckCircle2,
  Search,
} from "lucide-react";

const CATEGORY_META = [
  { value: "BUKU", label: "Buku & Modul", icon: "📚", color: "from-blue-500/10 to-indigo-500/10 text-blue-700", border: "hover:border-blue-300" },
  { value: "PAKAIAN", label: "Pakaian & OOTD", icon: "👕", color: "from-pink-500/10 to-rose-500/10 text-pink-700", border: "hover:border-pink-300" },
  { value: "ELEKTRONIK", label: "Elektronik & Gadget", icon: "⚡", color: "from-amber-500/10 to-orange-500/10 text-amber-700", border: "hover:border-amber-300" },
  { value: "ALAT_TULIS", label: "Alat Tulis & Praktikum", icon: "✏️", color: "from-emerald-500/10 to-teal-500/10 text-emerald-700", border: "hover:border-emerald-300" },
  { value: "AKSESORIS", label: "Aksesoris & Tas", icon: "🎒", color: "from-purple-500/10 to-violet-500/10 text-purple-700", border: "hover:border-purple-300" },
  { value: "LAINNYA", label: "Perlengkapan Kost", icon: "📦", color: "from-slate-500/10 to-zinc-500/10 text-slate-700", border: "hover:border-slate-300" },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const [latestItems, savedCount, totalUsers, totalAvailable] = await Promise.all([
    db.item.findMany({
      where: { status: "AVAILABLE" },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { owner: { select: { name: true } } },
    }),
    db.item.count({ where: { status: { in: ["SWAPPED", "DONATED"] } } }),
    db.user.count(),
    db.item.count({ where: { status: "AVAILABLE" } }),
  ]);

  const co2SavedKg = (savedCount * 2.5).toLocaleString("id-ID");
  const valueSavedRp = (savedCount * 50000).toLocaleString("id-ID");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 px-4 pt-16 pb-24 text-white">
          {/* Subtle Ambient Background */}
          <div className="blob absolute -left-40 top-0 h-[450px] w-[450px] bg-emerald-500/25" />
          <div className="blob absolute right-0 top-1/4 h-[350px] w-[350px] bg-teal-400/20" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative z-10 mx-auto max-w-5xl text-center">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md">
              <Leaf className="h-3.5 w-3.5 text-emerald-400" />
              <span>Gerakan Mahasiswa Peduli Lingkungan · SDG 12</span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-balance">
              Tukar & Donasikan Barang Bekas{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                Sesama Mahasiswa
              </span>
            </h1>

            {/* Subheading */}
            <p className="mx-auto mt-5 max-w-2xl text-base text-slate-300 sm:text-lg leading-relaxed text-balance">
              Buku modul, pakaian, gadget, hingga perlengkapan kos yang tak terpakai bisa bernilai besar bagi teman sekampus. Hemat uang saku, kurangi sampah!
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/catalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition-all active:scale-95"
              >
                <Search className="h-4 w-4" />
                <span>Jelajahi Katalog ({totalAvailable} Barang)</span>
              </Link>

              <Link
                href="/dashboard/upload"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 px-7 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-md hover:bg-slate-700 hover:text-white transition-all active:scale-95"
              >
                <span>+ Unggah Barang Bekas</span>
              </Link>
            </div>

            {/* Live Campus Impact Ticker */}
            <div className="mt-14 rounded-2xl border border-slate-800 bg-slate-800/60 p-5 backdrop-blur-md shadow-2xl">
              <div className="grid grid-cols-2 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-800 md:grid-cols-4">
                <div className="pt-2 sm:pt-0 sm:px-4 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                    {savedCount}
                  </div>
                  <div className="mt-1 text-xs text-slate-400 font-medium">
                    Barang Terselamatkan
                  </div>
                </div>

                <div className="pt-2 sm:pt-0 sm:px-4 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-teal-300">
                    {co2SavedKg} kg
                  </div>
                  <div className="mt-1 text-xs text-slate-400 font-medium">
                    Estimasi CO₂ Dihemat
                  </div>
                </div>

                <div className="pt-2 sm:pt-0 sm:px-4 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">
                    Rp {valueSavedRp}
                  </div>
                  <div className="mt-1 text-xs text-slate-400 font-medium">
                    Nilai Ekonomi Mahasiswa
                  </div>
                </div>

                <div className="pt-2 sm:pt-0 sm:px-4 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-sky-400">
                    {totalUsers}
                  </div>
                  <div className="mt-1 text-xs text-slate-400 font-medium">
                    Mahasiswa Terdaftar
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY BROWSER */}
        <section className="mx-auto max-w-6xl px-4 -mt-8 relative z-20">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORY_META.map((cat) => (
              <Link
                key={cat.value}
                href={`/catalog?category=${cat.value}`}
                className={`group flex flex-col items-center rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200/80 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${cat.border}`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.color} text-2xl transition-transform group-hover:scale-110`}>
                  {cat.icon}
                </div>
                <span className="mt-2.5 text-xs font-bold text-slate-800 text-center line-clamp-1">
                  {cat.label}
                </span>
                <span className="mt-0.5 text-[10px] text-slate-400 group-hover:text-emerald-600 transition">
                  Lihat barang →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* LATEST ITEMS PREVIEW */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
                <Sparkles className="h-4 w-4" />
                <span>Update Barang Terbaru</span>
              </div>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
                Siap Dibarter atau Didonasikan
              </h2>
            </div>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition"
            >
              <span>Lihat Semua ({totalAvailable})</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {latestItems.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">
                📦
              </div>
              <h3 className="mt-3 text-lg font-bold text-slate-800">Belum ada barang tersedia</h3>
              <p className="mt-1 text-sm text-slate-500">
                Jadilah mahasiswa pertama yang mengunggah barang untuk barter atau donasi.
              </p>
              <Link
                href="/dashboard/upload"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                + Unggah Barang Sekarang
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {latestItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* HOW IT WORKS (3 Simple Steps) */}
        <section className="border-y border-slate-200/80 bg-white py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                Alur Transaksi Mudah
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
                Cara Kerja GreenSwap Kampus
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Proses barter dan donasi dirancang praktis, tanpa uang tunai, dan aman untuk mahasiswa.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {/* Step 1 */}
              <div className="relative rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 transition-all hover:border-emerald-300 hover:bg-white hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white font-black text-lg shadow-md shadow-emerald-600/20">
                  1
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-900">
                  Foto & Unggah Barang
                </h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  Pilih tipe barang: <b>Barter</b> (tukar barang) atau <b>Donasi Gratis</b> untuk membantu sesama mahasiswa yang membutuhkan.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 transition-all hover:border-emerald-300 hover:bg-white hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white font-black text-lg shadow-md shadow-amber-500/20">
                  2
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-900">
                  Ajukan & Review Penawaran
                </h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  Temukan barang yang kamu incar di katalog, lalu ajukan salah satu barang milikmu sebagai penawar atau minta donasi langsung.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 transition-all hover:border-emerald-300 hover:bg-white hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white font-black text-lg shadow-md shadow-sky-600/20">
                  3
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-900">
                  COD Aman di Area Kampus
                </h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  Setelah disetujui, hubungi via WhatsApp otomatis untuk janjian serah terima barang di perpustakaan, kantin, atau selasar fakultas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SDG 12 & CAMPUS COD RECOMMENDATIONS */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-950 p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                  <Leaf className="h-3.5 w-3.5" />
                  <span>Dampak Nyata SDG 12</span>
                </div>
                <h3 className="mt-4 text-2xl font-bold">
                  Mengapa Circular Economy Kampus Penting?
                </h3>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                  Setiap pergantian semester, ratusan buku dan peralatan kos terbuang sia-sia sementara mahasiswa baru membutuhkannya. GreenSwap menghubungkan kebutuhan ini secara gratis.
                </p>

                <div className="mt-6 space-y-3 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Mengurangi limbah padat di lingkungan asrama & kost.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Menghemat rata-rata ratusan ribu rupiah per mahasiswa per semester.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Membangun budaya saling berbagi dan peduli di kampus.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Safe COD Spots */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
                <span>Keamanan Bertransaksi</span>
              </div>
              <h3 className="mt-1 text-2xl font-bold text-slate-900">
                Panduan Titik COD Kampus
              </h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Untuk menjaga keamanan dan kenyamanan bersama, selalu lakukan serah terima barang di tempat publik yang ramai:
              </p>

              <div className="mt-6 space-y-3.5">
                <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold shrink-0 mt-0.5">
                    📍
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Perpustakaan Pusat & Gazebo Kampus</h4>
                    <p className="text-[11px] text-slate-500">Tempat paling ideal untuk cek kondisi buku dan alat tulis.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700 font-bold shrink-0 mt-0.5">
                    📍
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Kantin Utama atau Selasar Gedung Kuliah</h4>
                    <p className="text-[11px] text-slate-500">Ramai, terang, dan mudah diakses di sela jam perkuliahan.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="bg-emerald-600 py-12 px-4 text-white text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Punya Barang Tak Terpakai di Kamar Kos?
            </h2>
            <p className="mt-3 text-sm text-emerald-100">
              Jangan biarkan berdebu! Unggah sekarang dan temukan barang yang kamu butuhkan.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/dashboard/upload"
                className="rounded-2xl bg-white px-7 py-3 text-xs font-bold text-emerald-800 shadow-md hover:bg-emerald-50 transition active:scale-95"
              >
                + Mulai Unggah Barang
              </Link>
              <Link
                href="/catalog"
                className="rounded-2xl border border-emerald-400/80 px-6 py-3 text-xs font-semibold text-white hover:bg-emerald-700/50 transition active:scale-95"
              >
                Jelajahi Katalog
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
