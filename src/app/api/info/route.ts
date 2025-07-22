import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, pdfUrl } = body;

    // Validate required fields
    if (!title || !slug || !pdfUrl) {
      return NextResponse.json(
        { error: "Title, slug, dan PDF URL wajib diisi" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingInfo = await prisma.info.findUnique({
      where: { slug },
    });

    if (existingInfo) {
      return NextResponse.json(
        { error: "Slug sudah digunakan" },
        { status: 400 }
      );
    }

    // Create info page
    const info = await prisma.info.create({
      data: {
        title,
        slug,
        pdfUrl,
      },
    });

    return NextResponse.json({
      message: "Halaman info berhasil dibuat",
      info,
    });
  } catch (error) {
    console.error("Error creating info:", error);
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
    const isActive = searchParams.get("isActive");

    // Build where clause
    const where: {
      isActive?: boolean;
    } = {};
    if (isActive !== null) {
      where.isActive = isActive === "true";
    }

    // Get info pages with pagination
    const [infos, total] = await Promise.all([
      prisma.info.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.info.count({ where }),
    ]);

    return NextResponse.json({
      infos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching infos:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}