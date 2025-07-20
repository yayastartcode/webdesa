# Desasa Web

Desasa Web adalah aplikasi web untuk masyarakat Indonesia, dirancang dengan bahasa dan perilaku yang sesuai dengan budaya lokal.

## 1. Persyaratan
- **Frontend**: Antarmuka pengguna yang responsif dan mudah digunakan.
- **Backend**: Integrasi database PostgreSQL melalui Neon untuk penyimpanan data yang aman.
- **Fitur Utama**: Kemampuan upload gambar menggunakan Uploadthing.
- **Deployment**: Mudah dideploy di Cloudflare atau Vercel.
- **Bahasa**: Dukungan penuh untuk bahasa Indonesia.
- **Desain**: Desain modern dan indah menggunakan Tailwind CSS dan shadcn/ui.

## 2. Tech Stack
- **Frontend**: Next.js 15 dengan TypeScript
- **Styling**: Tailwind CSS dan shadcn/ui untuk UI yang cantik
- **Database**: PostgreSQL (dihosting di Neon)
- **ORM**: Prisma untuk interaksi database yang type-safe
- **Upload Gambar**: Uploadthing
- **Deployment**: Vercel/Cloudflare

## 3. Milestone
- ✅ **Milestone 1**: Setup proyek dasar dengan Next.js, TypeScript, dan Tailwind CSS
- ✅ **Milestone 2**: Integrasi shadcn/ui untuk komponen UI yang indah
- ✅ **Milestone 3**: Setup Prisma untuk database management
- ✅ **Milestone 4**: Instalasi Uploadthing untuk fitur upload gambar
- ⏳ **Milestone 5**: Konfigurasi environment variables dan database connection
- ⏳ **Milestone 6**: Implementasi fitur dasar dan testing
- ⏳ **Milestone 7**: Deployment ke Vercel/Cloudflare

## 4. Instalasi dan Setup

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Akun Neon untuk database PostgreSQL
- Akun Uploadthing untuk file upload

### Environment Variables
Buat file `.env.local` dan tambahkan:

```env
# Database
DATABASE_URL="your-neon-postgresql-connection-string"

# Uploadthing
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
```

### Menjalankan Aplikasi

```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## 5. Struktur Proyek

```
desasa/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js App Router
│   ├── components/
│   │   └── ui/               # shadcn/ui components
│   └── lib/
│       └── utils.ts          # Utility functions
├── .env.local                # Environment variables
├── package.json
├── tailwind.config.ts        # Tailwind configuration
└── README.md
```

## 6. Kontribusi

Kami menyambut kontribusi dari komunitas! Silakan buat issue atau pull request.

## 7. Lisensi

MIT License - lihat file LICENSE untuk detail lengkap.

---

**Dibuat dengan ❤️ untuk Indonesia**


# Desasa Web

Desasa Web adalah aplikasi web untuk masyarakat Indonesia, dirancang dengan bahasa dan perilaku yang sesuai dengan budaya lokal.

## 1. Persyaratan
- **Frontend**: Antarmuka pengguna yang responsif dan mudah digunakan.
- **Backend**: Integrasi database PostgreSQL melalui Neon untuk penyimpanan data yang aman.
- **Fitur Utama**: Kemampuan upload gambar menggunakan Uploadthing.
- **Deployment**: Mudah dideploy di Cloudflare atau Vercel.
- **Bahasa**: Dukungan penuh untuk bahasa Indonesia.
- **Desain**: Desain modern dan indah menggunakan Tailwind CSS dan shadcn/ui.

## 2. Tech Stack
- **Frontend**: Next.js dengan TypeScript.
- **Styling**: Tailwind CSS dan shadcn/ui untuk UI yang cantik.
- **Database**: PostgreSQL (dihosting di Neon).
- **Upload Gambar**: Uploadthing.
- **Lainnya**: Prisma sebagai ORM untuk interaksi database.

## 3. Milestone
- **Milestone 1**: Setup proyek dasar dengan Next.js, TypeScript, dan Tailwind CSS.
- **Milestone 2**: Integrasi Prisma dan Neon PostgreSQL.
- **Milestone 3**: Implementasi fitur upload gambar dengan Uploadthing.
- **Milestone 4**: Penambahan komponen UI menggunakan shadcn/ui dan pengujian.
- **Milestone 5**: Deployment ke Vercel/Cloudflare dan pengoptimalan akhir.

## 4. Credentials

**PostgreSQL Neon**: postgresql://neondb_owner:npg_pvVrJlwUF71E@ep-jolly-dust-a1h9ldkc-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

**Uploadthing**:
- **API Key**: sk_live_bc8e58cef700145359ea4f13ae2e16a37273544f3c9ec5649ca9a4b3953d518c
