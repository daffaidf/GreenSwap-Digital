import { Suspense } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { ItemCard } from "@/components/ItemCard";
import { CatalogFilters } from "@/components/CatalogFilters";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PlusCircle, Sparkles } from "lucide-react";
import { categoryLabel } from "@/lib/constants";

const VALID_CATEGORIES = ["BUKU", "PAKAIAN", "ELEKTRONIK", "ALAT_TULIS", "AKSESORIS", "LAINNYA"];
const VALID_TYPES = ["BARTER", "DONASI"];

type SearchParams = {
  category?: string;
  type?: string;
  q?: string;
};

type ItemWhereInput = NonNullable<Parameters<typeof db.item.findMany>[0]>["where"];

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const category = VALID_CATEGORIES.includes(searchParams.category ?? "")
    ? searchParams.category
    : undefined;
  const type = VALID_TYPES.includes(searchParams.type ?? "")
    ? searchParams.type
    : undefined;
  const query = searchParams.q?.trim();

  const whereClause: ItemWhereInput = {
    status: "AVAILABLE",
    ...(category ? { category: category as "BUKU" } : {}),
    ...(type ? { type: type as "BARTER" } : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const items = await db.item.findMany({
    where: whereClause,
    include: { owner: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 mx-auto max-w-6xl w-full px-4 py-8">
        {/* Catalog Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Katalog Komunitas Kampus</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
              {category ? `${categoryLabel(category)} Kampus` : "Semua Barang Barter & Donasi"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Ditemukan <span className="font-semibold text-emerald-600">{items.length} barang</span> siap bertukar tangan.
            </p>
          </div>

          <Link
            href="/dashboard/upload"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition active:scale-95 shrink-0 self-start sm:self-auto"
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ Unggah Barang Baru</span>
          </Link>
        </div>

        {/* Filter Section */}
        <div className="mt-6">
          <Suspense fallback={<div className="h-20 w-full animate-pulse rounded-2xl bg-slate-100" />}>
            <CatalogFilters />
          </Suspense>
        </div>

        {/* Item Grid or Empty State */}
        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
              🔍
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">
              Tidak ada barang yang cocok
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
              Coba gunakan kata kunci lain atau bersihkan filter pencarian.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/catalog"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Reset Semua Filter
              </Link>
              <Link
                href="/dashboard/upload"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition"
              >
                + Jadi yang Pertama Listing
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
