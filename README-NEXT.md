This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

Production URL: https://greenswap-digital.vercel.app

```bash
vercel --prod          # deploy manual
vercel env ls          # cek env var (DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, NEXTAUTH_URL)
```

### Environment variables

| Variabel          | Kegunaan                                                        |
| ----------------- | --------------------------------------------------------------- |
| `DATABASE_URL`    | Runtime aplikasi → Supabase **transaction pooler** (port 6543) + `?pgbouncer=true` |
| `DIRECT_URL`      | Prisma CLI (migrate/resolve) → Supabase **session pooler** (port 5432) |
| `NEXTAUTH_SECRET` | Secret NextAuth (`openssl rand -base64 32`)                      |
| `NEXTAUTH_URL`    | URL production, mis. `https://greenswap-digital.vercel.app`      |
| `NODE_VERSION`    | `22`                                                             |

Session pooler hanya menyediakan 15 koneksi untuk seluruh project, jadi runtime
wajib memakai transaction pooler (6543) yang melakukan query multiplexing.

### Migrasi database

Migrasi **tidak** dijalankan di build step Vercel (butuh koneksi DB dan bisa
gagal saat pooler penuh). Jalankan manual dari mesin lokal:

```bash
npx prisma migrate deploy     # pakai DIRECT_URL
npx prisma generate
```

### Auto-deploy dari GitHub

Project belum terhubung ke repo GitHub. Pasang GitHub App Vercel di
https://github.com/apps/vercel (pilih repo `GreenSwap-Digital`), lalu
Settings → Git → Connect Git Repository.
