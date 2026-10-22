"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

async function requireUserId() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) throw new Error("Harus login dulu.");
  return { userId, session };
}

function revalidateSwapPaths(itemId?: string) {
  revalidatePath("/catalog");
  revalidatePath("/dashboard/requests");
  if (itemId) revalidatePath(`/item/${itemId}`);
}

/** Minta donasi: tanpa barang penawar. */
export async function createDonationRequest(formData: FormData) {
  const { userId } = await requireUserId();
  const targetItemId = String(formData.get("targetItemId") ?? "");

  const target = await db.item.findUnique({ where: { id: targetItemId } });
  if (!target) throw new Error("Barang tidak ditemukan.");
  if (target.ownerId === userId) throw new Error("Tidak bisa meminta barang sendiri.");
  if (target.status !== "AVAILABLE") throw new Error("Barang sudah tidak tersedia.");
  if (target.type !== "DONASI") throw new Error("Barang ini hanya untuk barter.");

  const existing = await db.swapRequest.findFirst({
    where: { requesterId: userId, targetItemId, status: "PENDING" },
  });
  if (existing) throw new Error("Kamu sudah mengajukan request untuk barang ini.");

  await db.$transaction([
    db.swapRequest.create({
      data: {
        requesterId: userId,
        receiverId: target.ownerId,
        targetItemId,
        offeredItemId: null,
        status: "PENDING",
      },
    }),
    db.item.update({ where: { id: targetItemId }, data: { status: "PENDING" } }),
  ]);

  revalidateSwapPaths(targetItemId);
}

/** Ajukan barter: wajib pilih barang penawar milik sendiri yang AVAILABLE. */
export async function createBarterRequest(formData: FormData) {
  const { userId } = await requireUserId();
  const targetItemId = String(formData.get("targetItemId") ?? "");
  const offeredItemId = String(formData.get("offeredItemId") ?? "");

  if (!offeredItemId) throw new Error("Pilih barang penawarmu dulu.");

  const target = await db.item.findUnique({ where: { id: targetItemId } });
  if (!target) throw new Error("Barang tidak ditemukan.");
  if (target.ownerId === userId) throw new Error("Tidak bisa menukar barang sendiri.");
  if (target.status !== "AVAILABLE") throw new Error("Barang sudah tidak tersedia.");
  if (target.type !== "BARTER") throw new Error("Barang ini hanya untuk donasi.");

  const offered = await db.item.findUnique({ where: { id: offeredItemId } });
  if (!offered) throw new Error("Barang penawar tidak ditemukan.");
  if (offered.ownerId !== userId) throw new Error("Barang penawar harus milikmu.");
  if (offered.status !== "AVAILABLE") throw new Error("Barang penawar sudah tidak tersedia.");
  if (offeredItemId === targetItemId) throw new Error("Barang penawar tidak valid.");

  const existing = await db.swapRequest.findFirst({
    where: { requesterId: userId, targetItemId, status: "PENDING" },
  });
  if (existing) throw new Error("Kamu sudah mengajukan request untuk barang ini.");

  await db.$transaction([
    db.swapRequest.create({
      data: {
        requesterId: userId,
        receiverId: target.ownerId,
        targetItemId,
        offeredItemId,
        status: "PENDING",
      },
    }),
    db.item.update({ where: { id: targetItemId }, data: { status: "PENDING" } }),
  ]);

  revalidateSwapPaths(targetItemId);
}

/** Pemilik barang: Terima / Tolak request yang masih PENDING. */
export async function respondToRequest(formData: FormData) {
  const { userId } = await requireUserId();
  const requestId = String(formData.get("requestId") ?? "");
  const decision = String(formData.get("decision") ?? "");

  const req = await db.swapRequest.findUnique({ where: { id: requestId } });
  if (!req) throw new Error("Request tidak ditemukan.");
  if (req.receiverId !== userId) throw new Error("Hanya pemilik barang yang bisa merespons.");
  if (req.status !== "PENDING") throw new Error("Request sudah diproses.");

  if (decision === "accept") {
    await db.swapRequest.update({ where: { id: requestId }, data: { status: "ACCEPTED" } });
  } else if (decision === "reject") {
    await db.$transaction([
      db.swapRequest.update({ where: { id: requestId }, data: { status: "REJECTED" } }),
      db.item.update({ where: { id: req.targetItemId }, data: { status: "AVAILABLE" } }),
    ]);
  } else {
    throw new Error("Keputusan tidak valid.");
  }

  revalidateSwapPaths(req.targetItemId);
}

/** Kedua belah pihak (saat ACCEPTED): konfirmasi COD selesai. */
export async function completeRequest(formData: FormData) {
  const { userId } = await requireUserId();
  const requestId = String(formData.get("requestId") ?? "");

  const req = await db.swapRequest.findUnique({
    where: { id: requestId },
    include: { targetItem: true },
  });
  if (!req) throw new Error("Request tidak ditemukan.");
  if (req.requesterId !== userId && req.receiverId !== userId) {
    throw new Error("Kamu tidak terlibat dalam transaksi ini.");
  }
  if (req.status !== "ACCEPTED") throw new Error("Request belum diterima / sudah selesai.");

  const isBarter = req.offeredItemId !== null;
  const finalStatus = isBarter ? "SWAPPED" : "DONATED";

  await db.$transaction(async (tx) => {
    await tx.swapRequest.update({ where: { id: requestId }, data: { status: "COMPLETED" } });
    await tx.item.update({ where: { id: req.targetItemId }, data: { status: finalStatus as "SWAPPED" } });
    if (req.offeredItemId) {
      await tx.item.update({ where: { id: req.offeredItemId }, data: { status: "SWAPPED" } });
    }
    // Tolak request PENDING lain yang mengincar barang yang sama
    await tx.swapRequest.updateMany({
      where: { targetItemId: req.targetItemId, status: "PENDING" },
      data: { status: "REJECTED" },
    });
  });

  revalidateSwapPaths(req.targetItemId);
}
