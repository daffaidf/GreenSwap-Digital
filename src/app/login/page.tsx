"use client";

import { useState, Suspense } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Email atau kata sandi tidak cocok.");
        return;
      }
      const session = await getSession();
      const role = (session?.user as { role?: string } | undefined)?.role;
      router.push(role === "ADMIN" ? "/admin" : "/dashboard");
      router.refresh();
    } catch {
      setError("Gagal terhubung ke server. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="blob absolute -left-32 top-10 h-96 w-96 bg-emerald-500/20" />
      <div className="blob absolute -right-32 bottom-10 h-96 w-96 bg-teal-400/15" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <Logo className="h-12 w-12 rounded-2xl bg-emerald-500 text-2xl shadow-xl shadow-emerald-500/30" />
            <div className="text-left">
              <span className="text-xl font-extrabold text-white">GreenSwap</span>
              <span className="block text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">
                Digital Campus
              </span>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-white p-7 sm:p-8 shadow-2xl ring-1 ring-slate-200/80">
          <div className="mb-6">
            <h1 className="text-xl font-extrabold text-slate-900">Masuk ke Akunmu</h1>
            <p className="mt-1 text-xs text-slate-500">
              Mulai barter dan donasi barang bekas di kampus.
            </p>
          </div>

          {registered && (
            <div className="mb-5 flex items-center gap-2 rounded-2xl bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
              <span>✅ Pendaftaran berhasil! Silakan masuk dengan akun barumu.</span>
            </div>
          )}

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-2xl bg-rose-50 p-3.5 text-xs font-semibold text-rose-700 border border-rose-200">
              <span>⚠️ {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Kampus / Umum
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@student.ac.id"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition active:scale-95 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memeriksa Akun...</span>
                </>
              ) : (
                <>
                  <span>Masuk Sekarang</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Belum punya akun GreenSwap?{" "}
              <Link href="/register" className="font-bold text-emerald-600 hover:underline">
                Daftar Gratis di sini
              </Link>
            </p>
          </div>
        </div>

        {/* Value reminders */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-slate-400">
          <span>🌱 Dukung SDG 12</span>
          <span>·</span>
          <span>🤝 100% Barter & Donasi</span>
          <span>·</span>
          <span>🔒 COD Aman</span>
        </div>
      </div>
    </main>
  );
}
