import { completeRequest, respondToRequest } from "@/actions/swap";
import {
  ArrowLeftRight,
  Gift,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Clock,
  Check,
  LucideIcon,
} from "lucide-react";
import { normalizeWaNumber } from "@/lib/phone";

export type RequestView = {
  id: string;
  status: string;
  createdAt: Date;
  requester: { id: string; name: string; waNumber: string };
  receiver: { id: string; name: string; waNumber: string };
  targetItem: { id: string; title: string; type: string };
  offeredItem: { id: string; title: string } | null;
};

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string; icon: LucideIcon }> = {
  PENDING: {
    label: "Menunggu Persetujuan",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    icon: Clock,
  },
  ACCEPTED: {
    label: "Disetujui — Janji COD via WA",
    badgeClass: "bg-sky-100 text-sky-800 border-sky-200",
    icon: MessageSquare,
  },
  REJECTED: {
    label: "Ditolak",
    badgeClass: "bg-rose-100 text-rose-700 border-rose-200",
    icon: XCircle,
  },
  COMPLETED: {
    label: "Transaksi Berhasil Selesai",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: CheckCircle2,
  },
};

function waLink(
  counterpartName: string,
  myName: string,
  itemTitle: string,
  isBarter: boolean,
  waNumber: string
) {
  const verb = isBarter ? "menukar" : "mengambil";
  const text = `Halo ${counterpartName}, saya ${myName} dari GreenSwap Kampus. Saya ingin COD untuk ${verb} "${itemTitle}". Kapan dan di mana bisa janjian?`;
  const digits =
    normalizeWaNumber(waNumber) ?? waNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function RequestCard({
  req,
  viewerId,
  viewerName,
}: {
  req: RequestView;
  viewerId: string;
  viewerName: string;
}) {
  const isReceiver = req.receiver.id === viewerId;
  const counterpart = isReceiver ? req.requester : req.receiver;
  const isBarter = req.offeredItem !== null;
  const config = STATUS_CONFIG[req.status] ?? STATUS_CONFIG.PENDING;
  const StatusIcon = config.icon;

  return (
    <div className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-200/80 shadow-xs transition hover:shadow-md">
      {/* Header with Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white ${
              isBarter ? "bg-amber-500" : "bg-emerald-600"
            }`}
          >
            {isBarter ? <ArrowLeftRight className="h-3 w-3" /> : <Gift className="h-3 w-3" />}
            <span>{isBarter ? "Barter" : "Donasi"}</span>
          </span>

          <span className="text-xs text-slate-400">
            {isReceiver ? "Permintaan Masuk" : "Permintaan Dikirim"}
          </span>
        </div>

        <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.badgeClass}`}>
          <StatusIcon className="h-3.5 w-3.5" />
          <span>{config.label}</span>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Barang Target
          </span>
          <p className="mt-1 text-sm font-bold text-slate-900">{req.targetItem.title}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            Pemilik: <span className="font-semibold text-slate-700">{req.receiver.name}</span>
          </p>
        </div>

        {isBarter && req.offeredItem ? (
          <div className="rounded-2xl bg-amber-50/50 p-4 border border-amber-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
              Barang Penawar (Barter)
            </span>
            <p className="mt-1 text-sm font-bold text-slate-900">{req.offeredItem.title}</p>
            <p className="mt-0.5 text-xs text-slate-500">
              Penawar: <span className="font-semibold text-slate-700">{req.requester.name}</span>
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-emerald-50/50 p-4 border border-emerald-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Tipe Pengajuan
            </span>
            <p className="mt-1 text-sm font-bold text-emerald-950">Donasi Gratis (Tanpa Barang Penawar)</p>
            <p className="mt-0.5 text-xs text-emerald-700">
              Pemohon: <span className="font-semibold">{req.requester.name}</span>
            </p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          Partner COD: <b className="text-slate-800">{counterpart.name}</b>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Receiver Action for Pending */}
          {req.status === "PENDING" && isReceiver && (
            <>
              <form action={respondToRequest}>
                <input type="hidden" name="requestId" value={req.id} />
                <input type="hidden" name="decision" value="reject" />
                <button className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
                  Tolak
                </button>
              </form>

              <form action={respondToRequest}>
                <input type="hidden" name="requestId" value={req.id} />
                <input type="hidden" name="decision" value="accept" />
                <button className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition">
                  <Check className="h-3.5 w-3.5" />
                  <span>Terima & Lanjut WA</span>
                </button>
              </form>
            </>
          )}

          {/* Pending for Requester */}
          {req.status === "PENDING" && !isReceiver && (
            <span className="text-xs text-slate-400 italic">
              Menunggu konfirmasi dari {req.receiver.name}...
            </span>
          )}

          {/* Accepted State: WA Chat + Complete Confirmation */}
          {req.status === "ACCEPTED" && (
            <>
              <a
                href={waLink(counterpart.name, viewerName, req.targetItem.title, isBarter, counterpart.waNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#20bd5a] transition"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Chat Janjian via WhatsApp</span>
              </a>

              <form action={completeRequest}>
                <input type="hidden" name="requestId" value={req.id} />
                <button className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Konfirmasi Selesai</span>
                </button>
              </form>
            </>
          )}

          {req.status === "COMPLETED" && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Selesai Ditukar / Didonasikan
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
