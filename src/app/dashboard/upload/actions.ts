"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const VALID_CATEGORIES = ["BUKU", "PAKAIAN", "ELEKTRONIK", "ALAT_TULIS", "AKSESORIS", "LAINNYA"];
const VALID_TYPES = ["BARTER", "DONASI"];

export async function uploadItem(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const type = String(formData.get("type") ?? "");
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();

  if (!title || !description) {
    throw new Error("Judul dan deskripsi wajib diisi.");
  }
  if (!VALID_CATEGORIES.includes(category)) {
    throw new Error("Kategori tidak valid.");
  }
  if (!VALID_TYPES.includes(type)) {
    throw new Error("Tipe barang tidak valid.");
  }

  await db.item.create({
    data: {
      ownerId: userId,
      title,
      description,
      category: category as "BUKU",
      type: type as "BARTER",
      status: "AVAILABLE",
      imageUrl:
        imageUrl || `https://picsum.photos/seed/${Date.now()}/600/400`,
    },
  });

  revalidatePath("/catalog");
  redirect("/catalog");
}
