import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Fetch specific APB Desa data by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const apbData = await prisma.apbDesa.findUnique({
      where: { id }
    });
    
    if (!apbData) {
      return NextResponse.json(
        { success: false, error: 'Data APB Desa tidak ditemukan' },
        { status: 404 }
      );
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

// PUT - Update APB Desa data (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    const body = await request.json();
    const { year, pendapatanDesa, belanjaDesa, isActive } = body;
    
    // Check if APB data exists
    const existingData = await prisma.apbDesa.findUnique({
      where: { id }
    });
    
    if (!existingData) {
      return NextResponse.json(
        { success: false, error: 'Data APB Desa tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Check if year is being changed and conflicts with existing data
    if (year && year !== existingData.year) {
      const yearConflict = await prisma.apbDesa.findFirst({
        where: {
          year: parseInt(year),
          id: { not: id }
        }
      });
      
      if (yearConflict) {
        return NextResponse.json(
          { success: false, error: 'Data APB untuk tahun ini sudah ada' },
          { status: 400 }
        );
      }
    }
    
    const updateData: any = {};
    if (year !== undefined) updateData.year = parseInt(year);
    if (pendapatanDesa !== undefined) updateData.pendapatanDesa = parseFloat(pendapatanDesa);
    if (belanjaDesa !== undefined) updateData.belanjaDesa = parseFloat(belanjaDesa);
    if (isActive !== undefined) updateData.isActive = isActive;
    
    const apbData = await prisma.apbDesa.update({
      where: { id },
      data: updateData
    });
    
    return NextResponse.json({
      success: true,
      data: apbData
    });
  } catch (error) {
    console.error('Error updating APB Desa data:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// DELETE - Delete APB Desa data (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    
    // Check if APB data exists
    const existingData = await prisma.apbDesa.findUnique({
      where: { id }
    });
    
    if (!existingData) {
      return NextResponse.json(
        { success: false, error: 'Data APB Desa tidak ditemukan' },
        { status: 404 }
      );
    }
    
    await prisma.apbDesa.delete({
      where: { id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Data APB Desa berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting APB Desa data:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}