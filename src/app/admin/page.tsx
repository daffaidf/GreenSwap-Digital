import { db } from "@/lib/db";
import { categoryLabel } from "@/lib/constants";
import { CATEGORY_COLORS } from "@/lib/chart-colors";
import { MetricCard } from "@/components/admin/MetricCard";
import { CategoryDonut } from "@/components/admin/CategoryDonut";
import { TransactionBar } from "@/components/admin/TransactionBar";
import {
  Leaf,
  Users,
  Package,
  TrendingUp,
  Sparkles,
  BarChart2,
  PieChart as PieChartIcon,
} from "lucide-react";

const CO2_PER_ITEM_KG = 2.5;
const VALUE_PER_ITEM_RP = 50000;

export default async function AdminPage() {
  const [savedCount, totalUsers, byCategory, barterDone, donasiDone] = await Promise.all([
    db.item.count({ where: { status: { in: ["SWAPPED", "DONATED"] } } }),
    db.user.count(),
    db.item.groupBy({
      by: ["category"],
      where: { status: { in: ["SWAPPED", "DONATED"] } },
      _count: { category: true },
    }),
    db.swapRequest.count({ where: { status: "COMPLETED", NOT: { offeredItemId: null } } }),
    db.swapRequest.count({ where: { status: "COMPLETED", offeredItemId: null } }),
  ]);

  const co2 = savedCount * CO2_PER_ITEM_KG;
  const value = savedCount * VALUE_PER_ITEM_RP;

  const donutDisplay = byCategory
    .filter((g) => g._count.category > 0)
    .map((g) => ({
      name: categoryLabel(g.category),
      value: g._count.category,
      color: CATEGORY_COLORS[categoryLabel(g.category)] ?? "#6b7280",
    }));

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Laporan Real-time Platform</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
            Dampak Lingkungan (SDG 12)
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Data metrik kalkulasi otomatis dari transaksi barter & donasi mahasiswa kampus.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Barang Terselamatkan"
          value={savedCount.toLocaleString("id-ID")}
          subtitle="Status SWAPPED + DONATED"
          icon={Package}
          trend="+ Circular"
        />
        <MetricCard
          title="Estimasi CO₂ Dihemat"
          value={`${co2.toLocaleString("id-ID")} kg`}
          subtitle={`Total × ${CO2_PER_ITEM_KG} kg / item`}
          icon={Leaf}
          trend="SDG 12"
        />
        <MetricCard
          title="Nilai Ekonomi Mahasiswa"
          value={`Rp ${value.toLocaleString("id-ID")}`}
          subtitle="Estimasi penghematan biaya"
          icon={TrendingUp}
        />
        <MetricCard
          title="Total Mahasiswa"
          value={totalUsers.toLocaleString("id-ID")}
          subtitle="User aktif terdaftar"
          icon={Users}
        />
      </div>

      {/* Chart Section */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              Kategori Barang Terselamatkan
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Persentase kategori item yang berhasil ditukar atau didonasikan
          </p>
          <div className="mt-4">
            <CategoryDonut data={donutDisplay} />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">
              Perbandingan Barter vs Donasi
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Total transaksi COMPLETED (Barter = tukar barang, Donasi = cuma-cuma)
          </p>
          <div className="mt-4">
            <TransactionBar
              data={[
                { name: "Barter", value: barterDone, color: "#f59e0b" },
                { name: "Donasi", value: donasiDone, color: "#10b981" },
              ]}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
