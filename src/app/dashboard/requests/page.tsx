import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RequestCard } from "@/components/RequestCard";
import { ArrowLeft, Inbox, Send, Compass } from "lucide-react";

export default async function RequestsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const viewerId = (session.user as { id?: string }).id;
  if (!viewerId) redirect("/login");
  const viewerName = session.user?.name ?? "Pengguna GreenSwap";

  const include = {
    requester: { select: { id: true, name: true, waNumber: true } },
    receiver: { select: { id: true, name: true, waNumber: true } },
    targetItem: { select: { id: true, title: true, type: true } },
    offeredItem: { select: { id: true, title: true } },
  };

  const [incoming, sent] = await Promise.all([
    db.swapRequest.findMany({
      where: { receiverId: viewerId },
      include,
      orderBy: { createdAt: "desc" },
    }),
    db.swapRequest.findMany({
      where: { requesterId: viewerId },
      include,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 mx-auto max-w-5xl w-full px-4 py-8">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Dashboard</span>
          </Link>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Pusat Transaksi & Barter
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Kelola permintaan tukar barang atau donasi yang masuk dan keluar.
              </p>
            </div>
          </div>
        </div>

        {/* INCOMING REQUESTS */}
        <section className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <Inbox className="h-4 w-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Permintaan Masuk ({incoming.length})
            </h2>
          </div>

          {incoming.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-xs text-slate-500 shadow-xs">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-xl mb-2">
                📬
              </div>
              <p className="font-semibold text-slate-700">Belum ada permintaan masuk</p>
              <p className="mt-0.5 text-slate-400">
                Ketika mahasiswa lain mengajukan barter atau meminta donasi barangmu, tawarannya akan muncul di sini.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {incoming.map((req) => (
                <RequestCard
                  key={req.id}
                  req={req}
                  viewerId={viewerId}
                  viewerName={viewerName}
                />
              ))}
            </div>
          )}
        </section>

        {/* OUTGOING REQUESTS */}
        <section className="mt-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <Send className="h-4 w-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Permintaan yang Kamu Kirim ({sent.length})
            </h2>
          </div>

          {sent.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-xs text-slate-500 shadow-xs">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-xl mb-2">
                🧭
              </div>
              <p className="font-semibold text-slate-700">Kamu belum mengajukan permintaan apapun</p>
              <p className="mt-0.5 text-slate-400">
                Temukan barang yang kamu butuhkan di katalog dan ajukan barter atau donasi.
              </p>
              <Link
                href="/catalog"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Jelajahi Katalog Barang</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {sent.map((req) => (
                <RequestCard
                  key={req.id}
                  req={req}
                  viewerId={viewerId}
                  viewerName={viewerName}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
