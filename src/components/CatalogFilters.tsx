"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";
import { Search, X, ArrowLeftRight, Gift } from "lucide-react";
import { useState, useTransition } from "react";

const CATEGORY_ICONS: Record<string, string> = {
  BUKU: "📚",
  PAKAIAN: "👕",
  ELEKTRONIK: "⚡",
  ALAT_TULIS: "✏️",
  AKSESORIS: "🎒",
  LAINNYA: "📦",
};

export function CatalogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const activeCategory = searchParams.get("category") ?? "";
  const activeType = searchParams.get("type") ?? "";
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);

  function applyFilter(updates: { category?: string; type?: string; q?: string }) {
    const params = new URLSearchParams(searchParams.toString());

    if ("category" in updates) {
      if (updates.category) params.set("category", updates.category);
      else params.delete("category");
    }

    if ("type" in updates) {
      if (updates.type) params.set("type", updates.type);
      else params.delete("type");
    }

    if ("q" in updates) {
      if (updates.q && updates.q.trim()) params.set("q", updates.q.trim());
      else params.delete("q");
    }

    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    applyFilter({ q: query });
  }

  function resetAll() {
    setQuery("");
    startTransition(() => {
      router.push(pathname);
    });
  }

  const hasActiveFilters = Boolean(activeCategory || activeType || initialQuery);

  return (
    <div className="space-y-4">
      {/* Top Search Bar & Type Quick Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari buku kuliah, kalkulator, kemeja, tas..."
            className="w-full rounded-2xl border border-slate-200/90 bg-white pl-10 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 shadow-sm"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                applyFilter({ q: "" });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        {/* Type Toggle Pills (Semua / Barter / Donasi) */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl shrink-0 self-start sm:self-auto border border-slate-200/60">
          <button
            type="button"
            onClick={() => applyFilter({ type: "" })}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              !activeType
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Semua Tipe
          </button>
          <button
            type="button"
            onClick={() => applyFilter({ type: "BARTER" })}
            className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              activeType === "BARTER"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-slate-600 hover:text-amber-700"
            }`}
          >
            <ArrowLeftRight className="h-3 w-3" />
            Barter
          </button>
          <button
            type="button"
            onClick={() => applyFilter({ type: "DONASI" })}
            className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              activeType === "DONASI"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:text-emerald-700"
            }`}
          >
            <Gift className="h-3 w-3" />
            Donasi Gratis
          </button>
        </div>
      </div>

      {/* Category Scrollable Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          type="button"
          onClick={() => applyFilter({ category: "" })}
          className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition border ${
            !activeCategory
              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          Semua Kategori
        </button>

        {CATEGORIES.map((c) => {
          const isSelected = activeCategory === c.value;
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => applyFilter({ category: isSelected ? "" : c.value })}
              className={`inline-flex items-center gap-1.5 shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition border ${
                isSelected
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/40"
              }`}
            >
              <span>{CATEGORY_ICONS[c.value] ?? "📦"}</span>
              <span>{c.label}</span>
            </button>
          );
        })}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-1 shrink-0 rounded-xl px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition ml-auto"
          >
            <X className="h-3.5 w-3.5" />
            Reset Filter
          </button>
        )}
      </div>
    </div>
  );
}
