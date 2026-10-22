import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import Image from "next/image";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { categoryLabel } from "@/lib/constants";
import {
  PlusCircle,
  ArrowLeftRight,
  Package,
  Leaf,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const viewerId = (session.user as { id?: string }).id;
  if (!viewerId) redirect("/login");

  const role = (session.user as { role?: string }).role ?? "USER";

  // Fetch user's items and transaction counts
  const [myItems, incomingRequestsCount, completedCount] = await Promise.all([
    db.item.findMany({
      where: { ownerId: viewerId },
      orderBy: { createdAt: "desc" },
    }),
    db.swapRequest.count({
      where: { receiverId: viewerId, status: "PENDING" },
    }),
    db.item.count({
      where: { ownerId: viewerId, status: { in: ["SWAPPED", "DONATED"] } },
    }),
  ]);

  const co2Saved = completedCount * 2.5;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 mx-auto max-w-6xl w-full px-4 py-8">
        {/* User Hero Profile Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="blob absolute right-0 top-0 h-64 w-64 bg-emerald-500/20" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-2xl font-black text-white shadow-lg shadow-emerald-500/30">
                {session.user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                    {session.user.name}
                  </h1>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                    {role === "ADMIN" ? "Admin Kampus" : "Mahasiswa"}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-300">
                  {session.user.email}
                </p>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Akun Aktif GreenSwap Kampus</span>
                </div>
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/dashboard/upload"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition active:scale-95"
              >
                <PlusCircle className="h-4 w-4" />
                <span>+ Unggah Barang</span>
              </Link>

              <Link
                href="/dashboard/requests"
                className="inline-flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-md px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition border border-white/10"
              >
                <ArrowLeftRight className="h-4 w-4 text-amber-400" />
                <span>Permintaan</span>
                {incomingRequestsCount > 0 && (
                  <span className="ml-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-black text-white">
                    {incomingRequestsCount}
                  </span>
                )}
              </Link>

              {role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-emerald-300 hover:bg-slate-700 transition border border-slate-700"
                >
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Panel Admin</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Impact & Activity Stat Cards */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Barang Diunggah</span>
              <Package className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900">{myItems.length}</div>
            <p className="mt-1 text-[11px] text-slate-400">Total item di katalog</p>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Barang Terselamatkan</span>
              <Sparkles className="h-4 w-4 text-teal-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-teal-600">{completedCount}</div>
            <p className="mt-1 text-[11px] text-slate-400">Swapped / Donated</p>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Estimasi CO₂ Dihemat</span>
              <Leaf className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-600">{co2Saved.toFixed(1)} kg</div>
            <p className="mt-1 text-[11px] text-slate-400">Kontribusi SDG 12 kamu</p>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Request Masuk Pending</span>
              <ArrowLeftRight className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-amber-600">{incomingRequestsCount}</div>
            <Link
              href="/dashboard/requests"
              className="mt-1 text-[11px] font-semibold text-emerald-600 hover:underline inline-block"
            >
              Lihat di Request Center →
            </Link>
          </div>
        </div>

        {/* My Items Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Barang Milik Saya ({myItems.length})
              </h2>
              <p className="text-xs text-slate-500">
                Daftar barang yang pernah kamu listing di platform GreenSwap.
              </p>
            </div>
            <Link
              href="/dashboard/upload"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>+ Unggah Baru</span>
            </Link>
          </div>

          {myItems.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                📦
              </div>
              <h3 className="mt-3 text-base font-bold text-slate-800">
                Kamu belum mengunggah barang apapun
              </h3>
              <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
                Punya buku bekas kuliah, kemeja, atau kalkulator yang nganggur? Mulai barter atau donasikan sekarang.
              </p>
              <Link
                href="/dashboard/upload"
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
              >
                <PlusCircle className="h-4 w-4" />
                <span>+ Unggah Barang Pertamamu</span>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-xs transition hover:shadow-md"
                >
                  <div className="flex gap-3.5 p-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-100">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${
                            item.type === "BARTER" ? "bg-amber-500" : "bg-emerald-600"
                          }`}
                        >
                          {item.type}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          {categoryLabel(item.category)}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-[11px] text-slate-500 line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 flex items-center justify-between text-xs">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        item.status === "AVAILABLE"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "PENDING"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {item.status === "AVAILABLE"
                        ? "🟢 Tersedia"
                        : item.status === "PENDING"
                        ? "🟡 Sedang Swap"
                        : "⚪ Selesai"}
                    </span>

                    <Link
                      href={`/item/${item.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline text-[11px]"
                    >
                      <span>Lihat Halaman</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
