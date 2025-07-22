import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Fetch APB Desa data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin');
    
    // Admin endpoint - return all APB data
    if (admin === 'true') {
      const session = await getServerSession(authOptions);
      
      if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }
      
      const allApbData = await prisma.apbDesa.findMany({
        orderBy: {
          year: 'desc'
        }
      });
      
      return NextResponse.json({
        success: true,
        data: allApbData
      });
    }
    
    // Public endpoint - return current/latest active data
    const currentYear = new Date().getFullYear();
    
    // Try to get current year's data first, fallback to latest available
    let apbData = await prisma.apbDesa.findFirst({
      where: {
        year: currentYear,
        isActive: true
      }
    });
    
    // If no data for current year, get the latest available
    if (!apbData) {
      apbData = await prisma.apbDesa.findFirst({
        where: {
          isActive: true
        },
        orderBy: {
          year: 'desc'
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      data: apbData
    });
  } catch (error) {
    console.error('Error fetching APB Desa data:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// POST - Create new APB Desa data (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { year, pendapatanDesa, belanjaDesa } = body;
    
    if (!year || !pendapatanDesa || !belanjaDesa) {
      return NextResponse.json(
        { success: false, error: 'Data tidak lengkap' },
        { status: 400 }
      );
    }
    
    // Check if data for this year already exists
    const existingData = await prisma.apbDesa.findUnique({
      where: { year: parseInt(year) }
    });
    
    if (existingData) {
      return NextResponse.json(
        { success: false, error: 'Data APB untuk tahun ini sudah ada' },
        { status: 400 }
      );
    }
    
    const apbData = await prisma.apbDesa.create({
      data: {
        year: parseInt(year),
        pendapatanDesa: parseFloat(pendapatanDesa),
        belanjaDesa: parseFloat(belanjaDesa)
      }
    });
    
    return NextResponse.json({
      success: true,
      data: apbData
    });
  } catch (error) {
    console.error('Error creating APB Desa data:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}