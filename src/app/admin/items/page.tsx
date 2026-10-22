import { db } from "@/lib/db";
import { categoryLabel } from "@/lib/constants";
import { deleteItem } from "@/actions/admin";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ExternalLink, ArrowLeftRight, Gift } from "lucide-react";

export default async function AdminItemsPage() {
  const items = await db.item.findMany({
    include: { owner: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Kelola & Moderasi Barang</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Daftar <span className="font-semibold text-emerald-600">{items.length} barang</span> terbaru. Hapus listing yang tidak pantas, melanggar etika kampus, atau duplikat.
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-4">Barang</th>
                <th className="px-5 py-4">Pemilik (Mahasiswa)</th>
                <th className="px-5 py-4">Kategori</th>
                <th className="px-5 py-4">Tipe</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-100">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs">📦</div>
                        )}
                      </div>
                      <div>
                        <Link
                          href={`/item/${item.id}`}
                          className="font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-1 line-clamp-1"
                        >
                          <span>{item.title}</span>
                          <ExternalLink className="h-3 w-3 text-slate-400 shrink-0" />
                        </Link>
                        <span className="text-[10px] text-slate-400">ID: {item.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-slate-800">{item.owner.name}</div>
                    <div className="text-[11px] text-slate-400">{item.owner.email}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                      {categoryLabel(item.category)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white ${
                        item.type === "BARTER" ? "bg-amber-500" : "bg-emerald-600"
                      }`}
                    >
                      {item.type === "BARTER" ? (
                        <>
                          <ArrowLeftRight className="h-2.5 w-2.5" />
                          <span>Barter</span>
                        </>
                      ) : (
                        <>
                          <Gift className="h-2.5 w-2.5" />
                          <span>Donasi</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        item.status === "AVAILABLE"
                          ? "bg-emerald-50 text-emerald-700"
                          : item.status === "PENDING"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <form action={deleteItem}>
                      <input type="hidden" name="itemId" value={item.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                        title="Hapus barang"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Hapus</span>
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    Belum ada barang di database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
