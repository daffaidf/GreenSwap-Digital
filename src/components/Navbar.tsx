import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";
import { PlusCircle, Compass, ArrowLeftRight, User, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";

export async function Navbar() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <Logo className="h-9 w-9 rounded-xl bg-emerald-600 shadow-md shadow-emerald-600/20 transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-700 transition">
                GreenSwap <span className="text-emerald-600">Digital</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-medium text-slate-400">
                SDG 12 Campus Barter
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/catalog"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100/80 hover:text-emerald-700 transition"
            >
              <Compass className="h-4 w-4 text-emerald-600" />
              <span>Katalog</span>
            </Link>

            {session && (
              <>
                <Link
                  href="/dashboard/requests"
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100/80 hover:text-emerald-700 transition"
                >
                  <ArrowLeftRight className="h-4 w-4 text-amber-500" />
                  <span>Permintaan</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100/80 hover:text-emerald-700 transition"
                >
                  <User className="h-4 w-4 text-slate-500" />
                  <span>Dashboard Saya</span>
                </Link>
              </>
            )}

            {role === "ADMIN" && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-sm ml-1"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Panel Admin</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href={session ? "/dashboard/upload" : "/login"}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700 transition active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Unggah Barang</span>
          </Link>

          {session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden lg:flex items-center gap-2 rounded-xl bg-slate-100/80 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200/70 transition"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-800">
                  {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <span className="max-w-[100px] truncate">{session.user?.name}</span>
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition hidden sm:inline-block"
              >
                Daftar Gratis
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
