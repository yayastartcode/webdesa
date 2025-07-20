import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const adminUser = await prisma.user.findFirst({
      where: {
        role: "ADMIN"
      }
    });

    return NextResponse.json({
      exists: !!adminUser
    });
  } catch (error) {
    console.error("Error checking admin:", error);
    return NextResponse.json(
      { error: "Gagal memeriksa admin" },
      { status: 500 }
    );
  }
}