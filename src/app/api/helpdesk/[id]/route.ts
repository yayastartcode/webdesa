import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, response } = body;

    // Validate status
    const validStatuses = ["pending", "in_progress", "resolved", "closed"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Status tidak valid" },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };
    
    if (status) {
      updateData.status = status;
    }
    
    if (response !== undefined) {
      updateData.response = response;
    }

    // Update helpdesk entry
    const updatedHelpdesk = await prisma.Helpdesk.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Helpdesk berhasil diperbarui",
      helpdesk: updatedHelpdesk,
    });
  } catch (error) {
    console.error("Error updating helpdesk:", error);
    
    // Check if record not found
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json(
        { error: "Helpdesk tidak ditemukan" },
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const helpdesk = await prisma.Helpdesk.findUnique({
      where: { id },
    });

    if (!helpdesk) {
      return NextResponse.json(
        { error: "Helpdesk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ helpdesk });
  } catch (error) {
    console.error("Error fetching helpdesk:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.Helpdesk.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Helpdesk berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting helpdesk:", error);
    
    // Check if record not found
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return NextResponse.json(
        { error: "Helpdesk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}