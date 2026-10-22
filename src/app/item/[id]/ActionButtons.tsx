"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { createBarterRequest, createDonationRequest } from "@/actions/swap";
import { ArrowLeftRight, Gift, PlusCircle, X, ShieldAlert } from "lucide-react";

function SubmitButton({ isBarter }: { isBarter: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl py-3.5 px-6 text-sm font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-60 ${
        isBarter
          ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/25"
          : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25"
      }`}
    >
      {pending ? (
        <span>Memproses Pengajuan...</span>
      ) : isBarter ? (
        <>
          <ArrowLeftRight className="h-4 w-4" />
          <span>Kirim Tawaran Barter</span>
        </>
      ) : (
        <>
          <Gift className="h-4 w-4" />
          <span>Ajukan Permintaan Donasi</span>
        </>
      )}
    </button>
  );
}

type MyItem = { id: string; title: string };

export function ActionButtons({
  itemId,
  itemType,
  myItems,
}: {
  itemId: string;
  itemType: "BARTER" | "DONASI";
  myItems: MyItem[];
}) {
  const [open, setOpen] = useState(false);

  if (itemType === "DONASI") {
    return (
      <div className="space-y-3">
        <form action={createDonationRequest}>
          <input type="hidden" name="targetItemId" value={itemId} />
          <SubmitButton isBarter={false} />
        </form>
        <p className="text-center text-[11px] text-slate-400">
          Barang ini didonasikan gratis. Pemilik akan menerima notifikasi permintaanmu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => setOpen(true)}
        disabled={myItems.length === 0}
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ArrowLeftRight className="h-4 w-4" />
        <span>Ajukan Barter Barang</span>
      </button>

      {myItems.length === 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900">
          <div className="flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Belum punya barang penawar?</span>
              <p className="mt-0.5 text-amber-800">
                Kamu perlu minimal 1 barang berstatus <i>Available</i> untuk ditawarkan barter.
              </p>
              <Link
                href="/dashboard/upload"
                className="mt-2 inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Unggah barang milikmu sekarang →</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-[11px] text-slate-400">
          Kamu memiliki {myItems.length} barang yang siap ditawarkan untuk barter ini.
        </p>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <ArrowLeftRight className="h-4 w-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Pilih Barang Penawar</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              Pilih salah satu barang milikmu yang ingin kamu tukarkan dengan barang ini. Pemilik barang akan meninjau tawaranmu sebelum menyetujui.
            </p>

            <form action={createBarterRequest} className="mt-4 space-y-4">
              <input type="hidden" name="targetItemId" value={itemId} />

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Barang Milikmu
                </label>
                <select
                  name="offeredItemId"
                  required
                  defaultValue=""
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100"
                >
                  <option value="" disabled>
                    -- Pilih barang yang ingin kamu tukar --
                  </option>
                  {myItems.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-2xl border border-slate-200 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-amber-500 py-3 text-xs font-bold text-white shadow-md shadow-amber-500/20 hover:bg-amber-600 transition"
                >
                  Kirim Tawaran Barter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
