import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const info = await prisma.info.findUnique({
      where: { slug },
    });

    if (!info) {
      return NextResponse.json(
        { success: false, error: "Halaman info tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      data: info 
    });
  } catch (error) {
    console.error("Error fetching info:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}