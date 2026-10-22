"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string } | undefined)?.role !== "ADMIN") {
    throw new Error("Hanya admin.");
  }
}

/** Hard delete barang yang tidak pantas/ilegal. Request terkait ikut terhapus (cascade). */
export async function deleteItem(formData: FormData) {
  await requireAdmin();
  const itemId = String(formData.get("itemId") ?? "");
  if (!itemId) throw new Error("ID barang tidak valid.");

  await db.item.delete({ where: { id: itemId } });

  revalidatePath("/admin");
  revalidatePath("/admin/items");
  revalidatePath("/catalog");
}
