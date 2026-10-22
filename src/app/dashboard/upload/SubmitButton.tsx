"use client";

import { useFormStatus } from "react-dom";
import { PlusCircle, Loader2 } from "lucide-react";

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition active:scale-95 disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Sedang Mengunggah Barang...</span>
        </>
      ) : (
        <>
          <PlusCircle className="h-4 w-4" />
          <span>Terbitkan Barang ke Katalog</span>
        </>
      )}
    </button>
  );
}
