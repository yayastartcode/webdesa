import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/village-info - Get village information
export async function GET() {
  try {
    const villageInfo = await prisma.villageInfo.findFirst({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(villageInfo);
  } catch (error) {
    console.error('Error fetching village info:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil informasi desa' },
      { status: 500 }
    );
  }
}

// POST /api/village-info - Create or update village information
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { visi, misi, tujuan } = await request.json();

    if (!visi || !misi || !tujuan) {
      return NextResponse.json(
        { error: 'Visi, misi, dan tujuan harus diisi' },
        { status: 400 }
      );
    }

    // Check if village info already exists
    const existingInfo = await prisma.villageInfo.findFirst();

    let villageInfo;
    if (existingInfo) {
      // Update existing record
      villageInfo = await prisma.villageInfo.update({
        where: { id: existingInfo.id },
        data: {
          visi,
          misi,
          tujuan,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new record
      villageInfo = await prisma.villageInfo.create({
        data: {
          visi,
          misi,
          tujuan
        }
      });
    }

    return NextResponse.json(villageInfo);
  } catch (error) {
    console.error('Error creating/updating village info:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan informasi desa' },
      { status: 500 }
    );
  }
}