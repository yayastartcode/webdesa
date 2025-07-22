import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/info/[id] - Get info by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const info = await prisma.info.findUnique({
      where: { id }
    });
    
    if (!info) {
      return NextResponse.json(
        { success: false, error: 'Halaman info tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: info
    });
  } catch (error) {
    console.error('Error fetching info:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// PATCH /api/info/[id] - Update info (Admin only)
export async function PATCH(
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
    const { title, slug, pdfUrl, isActive } = await request.json();
    
    // Check if info exists
    const existingInfo = await prisma.info.findUnique({
      where: { id }
    });
    
    if (!existingInfo) {
      return NextResponse.json(
        { success: false, error: 'Halaman info tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Check if slug is being changed and if it already exists
    if (slug && slug !== existingInfo.slug) {
      const slugExists = await prisma.info.findUnique({
        where: { slug }
      });
      
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Slug sudah digunakan' },
          { status: 400 }
        );
      }
    }
    
    // Prepare update data
    const updateData: {
      updatedAt: Date;
      title?: string;
      slug?: string;
      pdfUrl?: string;
      isActive?: boolean;
    } = {
      updatedAt: new Date()
    };
    
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (pdfUrl !== undefined) updateData.pdfUrl = pdfUrl;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    const updatedInfo = await prisma.info.update({
      where: { id },
      data: updateData
    });
    
    return NextResponse.json({
      success: true,
      data: updatedInfo,
      message: 'Halaman info berhasil diperbarui'
    });
  } catch (error) {
    console.error('Error updating info:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// DELETE /api/info/[id] - Delete info (Admin only)
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
    
    // Check if info exists
    const existingInfo = await prisma.info.findUnique({
      where: { id }
    });
    
    if (!existingInfo) {
      return NextResponse.json(
        { success: false, error: 'Halaman info tidak ditemukan' },
        { status: 404 }
      );
    }
    
    await prisma.info.delete({
      where: { id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Halaman info berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting info:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}