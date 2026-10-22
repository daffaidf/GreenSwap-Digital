import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";
import { ShieldCheck, BarChart3, Package, Compass, ArrowLeft } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3.5">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="group flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm transition-transform group-hover:scale-105">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-base font-extrabold text-slate-900">
                  GreenSwap <span className="text-emerald-600">Admin</span>
                </span>
                <span className="block text-[10px] font-semibold text-slate-400">
                  SDG 12 Command Center
                </span>
              </div>
            </Link>

            <nav className="hidden sm:flex items-center gap-1 text-xs font-semibold">
              <Link
                href="/admin"
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                <BarChart3 className="h-4 w-4 text-emerald-600" />
                <span>Statistik & Chart</span>
              </Link>
              <Link
                href="/admin/items"
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                <Package className="h-4 w-4 text-amber-500" />
                <span>Kelola Listing Barang</span>
              </Link>
              <Link
                href="/catalog"
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                <Compass className="h-4 w-4 text-slate-400" />
                <span>Katalog User</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>User Mode</span>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="flex-1">{children}</div>
    </div>
  );
}
