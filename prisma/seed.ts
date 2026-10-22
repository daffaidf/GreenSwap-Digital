import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  // ── Clean ────────────────────────────────────────────
  await prisma.swapRequest.deleteMany();
  await prisma.item.deleteMany();
  await prisma.user.deleteMany();

  // ── 5 Users: 1 Admin + 4 User ────────────────────────
  const [admin, budi, siti, andi, dewi] = await Promise.all(
    [
      {
        name: "Admin GreenSwap",
        email: "admin@greenswap.id",
        role: "ADMIN" as const,
        waNumber: "6281111111111",
      },
      {
        name: "Budi Santoso",
        email: "budi@student.ac.id",
        role: "USER" as const,
        waNumber: "6282222222222",
      },
      {
        name: "Siti Rahma",
        email: "siti@student.ac.id",
        role: "USER" as const,
        waNumber: "6283333333333",
      },
      {
        name: "Andi Pratama",
        email: "andi@student.ac.id",
        role: "USER" as const,
        waNumber: "6284444444444",
      },
      {
        name: "Dewi Lestari",
        email: "dewi@student.ac.id",
        role: "USER" as const,
        waNumber: "6285555555555",
      },
    ].map((u) =>
      prisma.user.create({
        data: { ...u, password: passwordHash },
      })
    )
  );

  // ── 10 Items ─────────────────────────────────────────
  // 5 AVAILABLE, 2 PENDING (target request aktif),
  // 2 SWAPPED (pasangan barter COMPLETED), 1 DONATED (histori)
  const items = {} as Record<string, { id: string }>;

  const itemData = [
    {
      key: "bukuAlgoritma",
      ownerId: budi.id,
      title: "Buku Algoritma Pemrograman",
      description: "Buku kuliah semester 1, masih bagus, ada highlight sedikit.",
      category: "BUKU" as const,
      type: "BARTER" as const,
      status: "AVAILABLE" as const,
      imageUrl: "https://picsum.photos/seed/buku-algo/600/400",
    },
    {
      key: "jaket",
      ownerId: siti.id,
      title: "Jaket Hoodie Kampus",
      description: "Jaket hoodie size L, sudah dicuci bersih. Ditukar karena kebesaran.",
      category: "PAKAIAN" as const,
      type: "BARTER" as const,
      status: "SWAPPED" as const, // pasangan COMPLETED barter (R3)
      imageUrl: "https://picsum.photos/seed/jaket/600/400",
    },
    {
      key: "kalkulator",
      ownerId: andi.id,
      title: "Kalkulator Casio fx-991",
      description: "Kalkulator scientific normal, baterai baru. Gratis untuk yang butuh.",
      category: "ELEKTRONIK" as const,
      type: "DONASI" as const,
      status: "AVAILABLE" as const,
      imageUrl: "https://picsum.photos/seed/kalkulator/600/400",
    },
    {
      key: "alatTulis",
      ownerId: dewi.id,
      title: "Set Alat Tulis",
      description: "Pulpen, pensil, penggaris, dan stabilo. Cocok untuk maba.",
      category: "ALAT_TULIS" as const,
      type: "DONASI" as const,
      status: "AVAILABLE" as const,
      imageUrl: "https://picsum.photos/seed/alattulis/600/400",
    },
    {
      key: "tas",
      ownerId: budi.id,
      title: "Tas Ransel Eiger",
      description: "Tas ransel kapasitas 25L, resleting lancar, minus pemakaian wajar.",
      category: "AKSESORIS" as const,
      type: "BARTER" as const,
      status: "PENDING" as const, // target R1 (PENDING)
      imageUrl: "https://picsum.photos/seed/tas/600/400",
    },
    {
      key: "bukuFisika",
      ownerId: siti.id,
      title: "Buku Fisika Dasar",
      description: "Sudah didonasikan ke adik tingkat. Histori transaksi donasi.",
      category: "BUKU" as const,
      type: "DONASI" as const,
      status: "DONATED" as const,
      imageUrl: "https://picsum.photos/seed/fisika/600/400",
    },
    {
      key: "kemeja",
      ownerId: andi.id,
      title: "Kemeja Flanel",
      description: "Kemeja flanel size M, motif kotak. Barter dengan hoodie.",
      category: "PAKAIAN" as const,
      type: "BARTER" as const,
      status: "SWAPPED" as const, // target R3 (COMPLETED)
      imageUrl: "https://picsum.photos/seed/kemeja/600/400",
    },
    {
      key: "mouse",
      ownerId: dewi.id,
      title: "Mouse Logitech M170",
      description: "Mouse wireless normal, baterai masih awet. Penawar untuk tas.",
      category: "ELEKTRONIK" as const,
      type: "BARTER" as const,
      status: "AVAILABLE" as const, // penawar R1
      imageUrl: "https://picsum.photos/seed/mouse/600/400",
    },
    {
      key: "novel",
      ownerId: budi.id,
      title: "Novel Laskar Pelangi",
      description: "Novel bekas koleksi pribadi, halaman lengkap. Free untuk pecinta buku.",
      category: "BUKU" as const,
      type: "DONASI" as const,
      status: "PENDING" as const, // target R2 (ACCEPTED)
      imageUrl: "https://picsum.photos/seed/novel/600/400",
    },
    {
      key: "helm",
      ownerId: siti.id,
      title: "Helm Sepeda",
      description: "Helm sepeda lipat, busa dalam masih tebal, jarang dipakai.",
      category: "LAINNYA" as const,
      type: "BARTER" as const,
      status: "AVAILABLE" as const,
      imageUrl: "https://picsum.photos/seed/helm/600/400",
    },
  ];

  for (const { key, ...data } of itemData) {
    const created = await prisma.item.create({ data });
    items[key] = { id: created.id };
  }

  // ── 3 SwapRequests ───────────────────────────────────
  // R1 PENDING (barter): Dewi -> Budi, Tas <- Mouse
  await prisma.swapRequest.create({
    data: {
      requesterId: dewi.id,
      receiverId: budi.id,
      targetItemId: items["tas"].id,
      offeredItemId: items["mouse"].id,
      status: "PENDING",
    },
  });

  // R2 ACCEPTED (donasi): Andi -> Budi, Novel (tanpa penawar)
  await prisma.swapRequest.create({
    data: {
      requesterId: andi.id,
      receiverId: budi.id,
      targetItemId: items["novel"].id,
      offeredItemId: null,
      status: "ACCEPTED",
    },
  });

  // R3 COMPLETED (barter): Siti -> Andi, Kemeja <- Jaket
  await prisma.swapRequest.create({
    data: {
      requesterId: siti.id,
      receiverId: andi.id,
      targetItemId: items["kemeja"].id,
      offeredItemId: items["jaket"].id,
      status: "COMPLETED",
    },
  });

  console.log("Seed selesai: 5 users, 10 items, 3 requests.");
  console.log("Login dummy (password: password123):");
  console.log("- admin@greenswap.id (ADMIN)");
  console.log("- budi@student.ac.id / siti@student.ac.id / andi@student.ac.id / dewi@student.ac.id (USER)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
