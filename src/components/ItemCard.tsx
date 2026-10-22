"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { categoryLabel } from "@/lib/constants";
import { ArrowLeftRight, Gift, MapPin } from "lucide-react";

type ItemCardProps = {
  item: {
    id: string;
    title: string;
    category: string;
    type: string;
    imageUrl: string;
    status?: string;
    createdAt?: Date | string;
    owner: { name: string };
  };
};

export function ItemCard({ item }: ItemCardProps) {
  const isBarter = item.type === "BARTER";
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/item/${item.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {imgError || !item.imageUrl ? (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
            <span className="text-4xl mb-1">📦</span>
            <span className="text-[11px] font-medium">Foto barang</span>
          </div>
        ) : (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        )}

        {/* Overlay gradient for badge readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute left-3 top-3 right-3 flex items-center justify-between gap-1">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 backdrop-blur-md shadow-sm">
            {categoryLabel(item.category)}
          </span>

          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-md ${
              isBarter ? "bg-amber-500/95" : "bg-emerald-600/95"
            }`}
          >
            {isBarter ? (
              <>
                <ArrowLeftRight className="h-3 w-3" />
                <span>Barter</span>
              </>
            ) : (
              <>
                <Gift className="h-3 w-3" />
                <span>Donasi</span>
              </>
            )}
          </span>
        </div>

        {/* Status Indicator if not available */}
        {item.status && item.status !== "AVAILABLE" && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px]">
            <span className="rounded-lg bg-white/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 shadow-md">
              {item.status === "PENDING" ? "Sedang Proses Swap" : item.status === "SWAPPED" ? "Sudah Ditukar" : "Terdonasi"}
            </span>
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition">
            {item.title}
          </h3>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-700">
              {item.owner.name.charAt(0).toUpperCase()}
            </div>
            <span className="truncate font-medium text-slate-700">{item.owner.name}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
            <MapPin className="h-3 w-3 text-emerald-600" />
            <span>Kampus</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
