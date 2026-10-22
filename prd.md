# 📄 Product Requirements Document (PRD)
**Project Name:** GreenSwap Digital
**Objective:** Mendukung SDG 12 (Konsumsi dan Produksi yang Bertanggung Jawab) melalui platform pertukaran dan donasi barang bekas antar mahasiswa.
**Target Release:** MVP (Minimum Viable Product)
**Version:** 1.1

---

## 1. Product Vision & Problem Statement

**Visi:** Menciptakan ekosistem *circular economy* di lingkungan kampus di mana mahasiswa dapat memperpanjang umur pakai barang bekas (buku, pakaian, alat tulis, dll) melalui pertukaran atau donasi, alih-alih membuangnya atau membeli baru.

**Masalah:**
* Banyak mahasiswa memiliki barang bekas layak pakai yang menumpuk di kos/kamar.
* Mahasiswa lain membutuhkan barang tersebut namun terkendala biaya.
* Tidak ada platform terpusat dan terpercaya di kampus untuk memfasilitasi pertukaran/donasi barang secara aman.

---

## 2. Target Audience & User Roles

Platform ini memiliki **2 role** utama:

### A. Mahasiswa (User)
Mahasiswa yang ingin menyalurkan barang bekas atau mencari barang bekas.
* **Kebutuhan:** Kemudahan *listing* barang, mencari barang yang dibutuhkan, dan keamanan saat bertransaksi (COD di kampus).

### B. Admin
Pengelola platform (bisa berupa tim BEM, UKM, atau Dosen).
* **Kebutuhan:** Memantau kesehatan platform, memoderasi barang yang tidak layak/ilegal, dan melihat laporan dampak lingkungan (SDG Metrics) **dalam bentuk visualisasi chart yang mudah dipahami**.

---

## 3. Functional Requirements (Fitur Utama)

### 3.1. Autentikasi & Profil (User)
* **Registrasi/Login:** Menggunakan Email & Password (email bebas, tidak ada validasi domain kampus di MVP).
* **Profil:** Menampilkan nama, nomor WhatsApp, dan daftar barang yang sedang di-*list*.

> 📌 *Catatan: Validasi email kampus (`.ac.id` / `.edu`) dipindahkan ke V2 sebagai fitur keamanan tambahan.*

### 3.2. Manajemen Barang (User)
* **Upload Barang:** Form untuk menambahkan barang (Judul, Deskripsi, Kategori, Foto, Kondisi).
* **Pilih Tipe Barang:** Pengguna harus memilih apakah barang ini untuk **DIBARTER** atau **DIDONASIKAN**.
* **Status Barang:** Otomatis berubah dari *Available* → *Pending* (saat ada yang minta) → *Swapped/Donated* (saat selesai).

### 3.3. Katalog & Pencarian (User)
* **Browse:** Melihat daftar barang yang tersedia dalam tampilan grid/list.
* **Filter:** Memfilter berdasarkan Kategori (Buku, Pakaian, Elektronik, dll) dan Tipe (Barter / Donasi).

### 3.4. Sistem Pengajuan Transaksi (Core Feature)
* **Ajukan Barter:** User A memilih barang User B, lalu sistem meminta User A memilih salah satu barang miliknya sebagai "penawar".
* **Ajukan Donasi:** User A memilih barang User B (tipe donasi). Tidak perlu memilih barang penawar.
* **Notifikasi Status:** Pemilik barang mendapat notifikasi *Pending Request*. Pemilik barang bisa *Accept* atau *Reject*.

### 3.5. Integrasi WhatsApp & Konfirmasi (User)
* **Deep Link WA:** Setelah request di-*Accept*, muncul tombol "Hubungi via WhatsApp". Tombol ini men-generate pesan otomatis:
  > *"Halo [Nama], saya [Nama] dari GreenSwap. Saya ingin COD untuk menukar/mengambil [Nama Barang]."*
* **Konfirmasi Selesai:** Kedua belah pihak memiliki tombol "Konfirmasi Barang Diterima". Jika kedua pihak klik, status transaksi berubah menjadi *Completed*.

### 3.6. Dashboard Admin & SDG Metrics (Admin) 🔁 *UPDATED*

#### A. Manajemen
* **User Management:** Melihat daftar user, fitur *ban* user yang melanggar.
* **Item Moderation:** Melihat dan menghapus barang yang tidak pantas/ilegal.

#### B. SDG Impact Metrics (Angka)
* **Total Barang Terselamatkan:** Count barang berstatus *Swapped* + *Donated*.
* **Estimasi Penghematan CO₂:** Total Barang × 2.5 kg.
* **Estimasi Nilai Ekonomi Dihemat:** Total Barang × Rp 50.000.
* **Total User Terdaftar.**
* **Total Transaksi Berhasil** (Barter vs Donasi).

#### C. 📊 Visualisasi Chart *(BARU)*

| Chart | Tipe | Data yang Ditampilkan | Tujuan |
|---|---|---|---|
| **Kategori Barang Terselamatkan** | Donut / Pie Chart | Persentase per kategori (Buku, Pakaian, Elektronik, Alat Tulis, Aksesoris, Lainnya) | Menunjukkan jenis barang apa yang paling banyak diselamatkan dari limbah |
| **Tren Transaksi Mingguan** | Bar Chart / Area Chart | Jumlah transaksi berhasil per minggu (4–8 minggu terakhir), dibedakan warna untuk Barter vs Donasi | Menunjukkan apakah platform makin aktif digunakan |
| **Rasio Barter vs Donasi** | Pie Chart | Perbandingan total transaksi Barter vs Donasi | Menunjukkan perilaku user: lebih suka tukar atau memberi |
| **Top 5 Barang Paling Ditukar** | Horizontal Bar Chart | 5 item dengan status *Completed* terbanyak berdasarkan kategori | Insight barang apa yang paling *in-demand* |

> 📌 *Rekomendasi library chart untuk Next.js: **Recharts** (ringan, React-native, mudah dikustomisasi) atau **Chart.js** via `react-chartjs-2`.*

---

## 4. Non-Functional Requirements
* **Platform:** Web-based (Responsive / Mobile-First).
* **Tech Stack:** Next.js (App Router), Tailwind CSS, PostgreSQL, Prisma ORM, NextAuth.js, **Recharts** (untuk dashboard chart).
* **Performance:** Load time halaman katalog di bawah 2 detik.
* **Security:** Password di-*hash* (bawaan NextAuth), proteksi route berdasarkan *role* (Middleware Next.js).

---

## 5. User Flow (Skenario Utama)

### Flow Barter (Head-to-Head)
```
User A login → Browse katalog
  → Klik barang User B
  → Pilih "Ajukan Barter"
  → Pilih barang milik User A sebagai penawar
  → Submit
    → User B dapat notifikasi
    → User B review barang penawaran
    → User B klik "Terima"
      → Sistem generate tombol "Chat via WA" (pre-filled text)
      → User A & B COD di kampus
      → User A & B klik "Konfirmasi Selesai"
      → Status kedua barang → SWAPPED ✅
```

### Flow Donasi
```
User A browse katalog → Filter tipe "Donasi"
  → Klik barang User B
  → Pilih "Minta Donasi"
  → Submit
    → User B terima request
    → Sistem generate link WA (pre-filled text)
    → COD di kampus
    → Kedua pihak klik "Konfirmasi Selesai"
    → Status barang → DONATED ✅
```

---

## 6. Data Model (High-Level Schema)

### User
| Field | Type | Notes |
|---|---|---|
| `id` | String (UUID) | Primary Key |
| `name` | String | |
| `email` | String | Unique |
| `password` | String | Hashed |
| `role` | Enum | `USER` / `ADMIN` |
| `wa_number` | String | Format: 628xxx |
| `createdAt` | DateTime | |

### Item
| Field | Type | Notes |
|---|---|---|
| `id` | String (UUID) | Primary Key |
| `ownerId` | String | FK → User |
| `title` | String | |
| `description` | String | |
| `category` | Enum | `BUKU`, `PAKAIAN`, `ELEKTRONIK`, `ALAT_TULIS`, `AKSESORIS`, `LAINNYA` |
| `type` | Enum | `BARTER`, `DONASI` |
| `status` | Enum | `AVAILABLE`, `PENDING`, `SWAPPED`, `DONATED` |
| `imageUrl` | String | |
| `createdAt` | DateTime | |

### SwapRequest
| Field | Type | Notes |
|---|---|---|
| `id` | String (UUID) | Primary Key |
| `requesterId` | String | FK → User (yang minta) |
| `receiverId` | String | FK → User (pemilik barang) |
| `targetItemId` | String | FK → Item (barang yang diincar) |
| `offeredItemId` | String? | FK → Item (penawar, *nullable* jika donasi) |
| `status` | Enum | `PENDING`, `ACCEPTED`, `REJECTED`, `COMPLETED` |
| `createdAt` | DateTime | |

---

## 7. Out of Scope

### MVP (Tidak dibangun sekarang)
* ❌ In-app Real-time Chat (diganti integrasi WhatsApp).
* ❌ Payment Gateway / Sistem Poin / Kredit.
* ❌ Fitur Pengiriman / Ekspedisi (fokus COD kampus).
* ❌ Rating & Review System.

### V2 (Rencana pengembangan selanjutnya)
* 🔜 Validasi email kampus (`.ac.id` / `.edu`) saat registrasi.
* 🔜 In-app chat.
* 🔜 Sistem reputasi / rating user.
* 🔜 Push notification (email / browser).
* 🔜 Export laporan SDG ke PDF.

---

## 8. Success Metrics (KPI)
* **Adopsi:** Minimal 50 mahasiswa terdaftar dalam 2 minggu pertama.
* **Transaksi:** Minimal 20 barang berhasil ditukar/didonasi.
* **Dampak SDG:** Tercatat minimal 50 kg estimasi penghematan CO₂ di dashboard.
* **Dashboard:** Semua chart ter-render dengan data yang akurat dan *real-time* dari database.

---

## 9. Halaman / Route Map

| Route | Akses | Deskripsi |
|---|---|---|
| `/` | Public | Landing page + CTA |
| `/login` | Public | Halaman login |
| `/register` | Public | Halaman registrasi |
| `/catalog` | User | Katalog barang (browse + filter) |
| `/item/[id]` | User | Detail barang + tombol Ajukan Barter/Donasi |
| `/dashboard` | User | Dashboard user: barang milik sendiri, riwayat request masuk/keluar, tombol konfirmasi |
| `/dashboard/upload` | User | Form upload barang baru |
| `/admin` | Admin | Dashboard admin: metrics angka + **4 chart visualisasi** |
| `/admin/users` | Admin | Kelola user |
| `/admin/items` | Admin | Moderasi barang |

---

### 💡 Quick Notes buat Lu:
1. **Recharts** itu paling gampang di-Next.js. Contoh pie chart cuma ~20 baris kode. Gue bisa bikinin *snippet*-nya kalau lu mau.
2. Buat **chart tren mingguan**, lu perlu query Prisma yang *group by week*. Gue bisa bantu tulis query-nya nanti.
3. Untuk **seed data dummy** biar chart-nya kelihatan hidup pas presentasi, gue bisa bikinin script `seed.ts` pakai Prisma juga.

Mau lanjut ke bagian mana? Gue bisa bantu:
- **Setup repo & struktur folder Next.js**
- **Prisma schema lengkap** (siap copy-paste)
- **Snippet component chart Recharts**
- **Script seed data dummy**