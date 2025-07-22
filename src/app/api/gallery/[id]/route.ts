import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, imageUrl, category, order, isActive } = body;

    // Prepare update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (category !== undefined) updateData.category = category;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update gallery item
    const updatedGallery = await prisma.gallery.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Item galeri berhasil diperbarui",
      gallery: updatedGallery,
    });
  } catch (error) {
    console.error("Error updating gallery item:", error);
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json(
        { error: "Item galeri tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const gallery = await prisma.gallery.findUnique({
      where: { id },
    });

    if (!gallery) {
      return NextResponse.json(
        { error: "Item galeri tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ gallery });
  } catch (error) {
    console.error("Error fetching gallery item:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.gallery.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Item galeri berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return NextResponse.json(
        { error: "Item galeri tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}