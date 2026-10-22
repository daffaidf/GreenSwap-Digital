import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { normalizeWaNumber } from "@/lib/phone";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").toLowerCase().trim();
    const password = String(body?.password ?? "");
    const rawWaNumber = String(body?.waNumber ?? "").trim();
    const waNumber = normalizeWaNumber(rawWaNumber);

    if (!name || !email || !password || !rawWaNumber) {
      return NextResponse.json(
        { message: "Nama, email, password, dan nomor WhatsApp wajib diisi." },
        { status: 400 }
      );
    }
    if (!waNumber) {
      return NextResponse.json(
        {
          message:
            "Nomor WhatsApp tidak valid. Contoh: 081234567890 (minimal 10 digit).",
        },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "Format email tidak valid." },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password minimal 6 karakter." },
        { status: 400 }
      );
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: "Email sudah terdaftar. Silakan login." },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: { name, email, password: hashed, waNumber, role: "USER" },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json(
      { message: "Registrasi berhasil.", user },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
