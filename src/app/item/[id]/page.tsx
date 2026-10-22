import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { categoryLabel } from "@/lib/constants";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ItemCard } from "@/components/ItemCard";
import { ActionButtons } from "./ActionButtons";
import {
  ArrowLeft,
  ArrowLeftRight,
  Gift,
  MapPin,
  ShieldCheck,
  Clock,
  CheckCircle2,
} from "lucide-react";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  AVAILABLE: { label: "Tersedia untuk Ditukar / Donasi", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  PENDING: { label: "Sedang Dalam Proses Transaksi", color: "text-amber-700 bg-amber-50 border-amber-200" },
  SWAPPED: { label: "Barang Sudah Berhasil Ditukar", color: "text-slate-700 bg-slate-100 border-slate-200" },
  DONATED: { label: "Barang Sudah Didonasikan", color: "text-slate-700 bg-slate-100 border-slate-200" },
};

export default async function ItemDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const viewerId = (session?.user as { id?: string } | undefined)?.id;

  const item = await db.item.findUnique({
    where: { id: params.id },
    include: { owner: { select: { id: true, name: true, email: true } } },
  });
  if (!item) notFound();

  const isOwner = viewerId === item.ownerId;
  const isBarter = item.type === "BARTER";

  let myItems: { id: string; title: string }[] = [];
  if (viewerId && !isOwner && isBarter && item.status === "AVAILABLE") {
    myItems = await db.item.findMany({
      where: { ownerId: viewerId, status: "AVAILABLE", id: { not: item.id } },
      select: { id: true, title: true },
      orderBy: { createdAt: "desc" },
    });
  }

  // Fetch related items in same category
  const relatedItems = await db.item.findMany({
    where: {
      category: item.category,
      id: { not: item.id },
      status: "AVAILABLE",
    },
    take: 3,
    include: { owner: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const statusInfo = STATUS_LABEL[item.status] ?? STATUS_LABEL.AVAILABLE;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 mx-auto max-w-6xl w-full px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link href="/catalog" className="inline-flex items-center gap-1 hover:text-emerald-600 transition">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Katalog</span>
          </Link>
          <span>/</span>
          <Link href={`/catalog?category=${item.category}`} className="hover:text-emerald-600 transition">
            {categoryLabel(item.category)}
          </Link>
          <span>/</span>
          <span className="truncate max-w-[200px] text-slate-800 font-semibold">{item.title}</span>
        </div>

        {/* Main Item Container */}
        <div className="grid gap-8 lg:grid-cols-12 rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200/80">
          {/* Left Column: Image Gallery Preview */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200/60 shadow-inner">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold text-white shadow-md backdrop-blur-md ${
                    isBarter ? "bg-amber-500/95" : "bg-emerald-600/95"
                  }`}
                >
                  {isBarter ? (
                    <>
                      <ArrowLeftRight className="h-3.5 w-3.5" />
                      <span>Barter</span>
                    </>
                  ) : (
                    <>
                      <Gift className="h-3.5 w-3.5" />
                      <span>Donasi Gratis</span>
                    </>
                  )}
                </span>

                <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-md">
                  {categoryLabel(item.category)}
                </span>
              </div>
            </div>

            {/* Quick Safety Reminder Box */}
            <div className="flex items-start gap-3 rounded-2xl bg-emerald-50/60 p-4 border border-emerald-100 text-xs text-emerald-900">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Keamanan Bertransaksi:</span>
                <p className="mt-0.5 text-emerald-800 leading-relaxed">
                  Lakukan pemeriksaan kondisi fisik barang secara langsung saat COD di lokasi ramai kampus.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="space-y-5">
              {/* Status Pill */}
              <div className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold shadow-xs">
                <div className={`h-2 w-2 rounded-full ${item.status === "AVAILABLE" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                <span className="text-slate-700">{statusInfo.label}</span>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {item.title}
                </h1>
                <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Area Kampus</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Diposting baru-baru ini</span>
                  </div>
                </div>
              </div>

              {/* Owner Profile Card */}
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-base font-bold text-white shadow-sm">
                    {item.owner.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.owner.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Mahasiswa Terverifikasi</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Deskripsi Barang
                </h4>
                <div className="mt-2.5 rounded-2xl bg-slate-50/60 p-4 border border-slate-100/80">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons Box */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              {isOwner ? (
                <div className="rounded-2xl bg-slate-100 p-4 text-center text-xs text-slate-600 border border-slate-200">
                  <p className="font-semibold text-slate-800">Ini adalah barang milikmu</p>
                  <p className="mt-0.5">Kelola status dan permintaan yang masuk melalui Dashboard.</p>
                  <Link
                    href="/dashboard"
                    className="mt-3 inline-block rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
                  >
                    Buka Dashboard Saya
                  </Link>
                </div>
              ) : item.status !== "AVAILABLE" ? (
                <div className="rounded-2xl bg-slate-100 p-4 text-center text-xs text-slate-600 border border-slate-200">
                  <p className="font-semibold text-slate-800">Barang ini sedang tidak tersedia</p>
                  <p className="mt-0.5">Barang ini sedang dalam proses barter atau sudah selesai diserahterimakan.</p>
                </div>
              ) : !viewerId ? (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="block w-full rounded-2xl bg-emerald-600 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition"
                  >
                    Masuk Akun untuk Mengajukan {isBarter ? "Barter" : "Donasi"}
                  </Link>
                  <p className="text-center text-[11px] text-slate-400">
                    Gratis & hanya butuh hitungan detik untuk bergabung
                  </p>
                </div>
              ) : (
                <ActionButtons itemId={item.id} itemType={item.type} myItems={myItems} />
              )}
            </div>
          </div>
        </div>

        {/* Related Items from Same Category */}
        {relatedItems.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Barang Serupa di {categoryLabel(item.category)}
                </h3>
                <p className="text-xs text-slate-500">Pilihan lain yang mungkin kamu butuhkan</p>
              </div>
              <Link
                href={`/catalog?category=${item.category}`}
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                Lihat Kategori Ini →
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedItems.map((rel) => (
                <ItemCard key={rel.id} item={rel} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
