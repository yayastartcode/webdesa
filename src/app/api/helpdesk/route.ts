import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY is not configured");
    return false;
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, nomorWhatsapp, kategoriPengaduan, pesanPengaduan, recaptchaToken } = body;

    // Validate required fields
    if (!nama || !nomorWhatsapp || !kategoriPengaduan || !pesanPengaduan || !recaptchaToken) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA (skip in development mode)
    const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
    const isRecaptchaEnabled = recaptchaSecretKey && recaptchaSecretKey !== 'your-recaptcha-secret-key-here';
    
    if (isRecaptchaEnabled && recaptchaToken !== 'development-mode') {
      const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
      if (!isRecaptchaValid) {
        return NextResponse.json(
          { error: "Verifikasi reCAPTCHA gagal" },
          { status: 400 }
        );
      }
    }

    // Validate kategori pengaduan
    const validKategori = ["umum", "kesehatan", "keamanan", "kebersihan"];
    if (!validKategori.includes(kategoriPengaduan)) {
      return NextResponse.json(
        { error: "Kategori pengaduan tidak valid" },
        { status: 400 }
      );
    }

    // Save to database
    const helpdesk = await prisma.helpdesk.create({
      data: {
        nama,
        nomorWhatsapp,
        kategoriPengaduan,
        pesanPengaduan,
        status: "pending",
        createdAt: new Date(),
      },
    });

    return NextResponse.json(
      { 
        message: "Pengaduan berhasil dikirim",
        id: helpdesk.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating helpdesk entry:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const kategori = searchParams.get("kategori");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: {
      status?: string;
      kategoriPengaduan?: string;
    } = {};
    if (status) where.status = status;
    if (kategori) where.kategoriPengaduan = kategori;

    // Get helpdesk entries with pagination
    const [helpdesks, total] = await Promise.all([
      prisma.helpdesk.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.helpdesk.count({ where }),
    ]);

    return NextResponse.json({
      helpdesks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching helpdesk entries:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}