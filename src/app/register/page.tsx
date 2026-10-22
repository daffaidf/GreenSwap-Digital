"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Phone, Loader2, ArrowRight } from "lucide-react";
import { normalizeWaNumber } from "@/lib/phone";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    waNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const waPreview = form.waNumber.trim() ? normalizeWaNumber(form.waNumber) : null;
  const waInvalid = form.waNumber.trim().length > 0 && !waPreview;

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Registrasi gagal.");
        return;
      }
      router.push("/login?registered=1");
    } catch {
      setError("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 px-4 py-12 relative overflow-hidden">
      <div className="blob absolute -left-32 top-10 h-96 w-96 bg-emerald-500/20" />
      <div className="blob absolute -right-32 bottom-10 h-96 w-96 bg-teal-400/15" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-2xl text-white shadow-xl shadow-emerald-500/30">
              ♻️
            </div>
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
            <h1 className="text-xl font-extrabold text-slate-900">Buat Akun Mahasiswa</h1>
            <p className="mt-1 text-xs text-slate-500">
              Gabung komunitas kampus untuk barter dan donasi barang bekas secara gratis.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-2xl bg-rose-50 p-3.5 text-xs font-semibold text-rose-700 border border-rose-200">
              <span>⚠️ {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nama Lengkap / Panggilan
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Contoh: Dary Azhari"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="nama@student.ac.id atau email aktif"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nomor WhatsApp (untuk janjian COD)
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  required
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={form.waNumber}
                  onChange={(e) => update("waNumber", e.target.value)}
                  placeholder="Contoh: 081234567890"
                  aria-invalid={waInvalid}
                  className={`w-full rounded-2xl border bg-slate-50/50 pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:bg-white focus:ring-4 focus:ring-emerald-50 ${
                    waInvalid
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-50"
                      : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-50"
                  }`}
                />
              </div>
              {waInvalid ? (
                <p className="mt-1 text-[11px] font-semibold text-rose-600">
                  Nomor WhatsApp tidak valid. Contoh: 081234567890
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-slate-400">
                  Boleh tulis 08…, +62, atau 628… — otomatis disimpan jadi format
                  internasional supaya tombol chat WhatsApp berfungsi.
                  {waPreview && (
                    <span className="mt-0.5 block font-semibold text-emerald-600">
                      Akan disimpan sebagai: {waPreview}
                    </span>
                  )}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Kata Sandi (min. 6 karakter)
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
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
                  <span>Mendaftarkan Akun...</span>
                </>
              ) : (
                <>
                  <span>Buat Akun & Mulai Berbagi</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-bold text-emerald-600 hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
