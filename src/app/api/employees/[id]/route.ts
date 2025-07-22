import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Session } from "next-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const employee = await prisma.employee.findUnique({
      where: { id }
    });

    if (!employee) {
      return NextResponse.json(
        { success: false, error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch employee" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 403 }
      );
    }

    const { name, position, photoUrl, order } = await request.json();

    if (!name || !position || order === undefined) {
      return NextResponse.json(
        { success: false, error: "Name, position, and order are required" },
        { status: 400 }
      );
    }

    // Get current employee
    const currentEmployee = await prisma.employee.findUnique({
      where: { id }
    });

    if (!currentEmployee) {
      return NextResponse.json(
        { success: false, error: "Employee not found" },
        { status: 404 }
      );
    }

    // If order is changing, handle reordering
    if (currentEmployee.order !== order) {
      const existingEmployee = await prisma.employee.findFirst({
        where: { 
          order, 
          isActive: true,
          id: { not: id }
        }
      });

      if (existingEmployee) {
        // Shift other employees' order
        if (order > currentEmployee.order) {
          // Moving down - shift up employees between old and new position
          await prisma.employee.updateMany({
            where: {
              order: { gt: currentEmployee.order, lte: order },
              isActive: true,
              id: { not: id }
            },
            data: {
              order: { decrement: 1 }
            }
          });
        } else {
          // Moving up - shift down employees between new and old position
          await prisma.employee.updateMany({
            where: {
              order: { gte: order, lt: currentEmployee.order },
              isActive: true,
              id: { not: id }
            },
            data: {
              order: { increment: 1 }
            }
          });
        }
      }
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        name,
        position,
        photoUrl,
        order
      }
    });

    return NextResponse.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 403 }
      );
    }

    // Get current employee to know its order
    const currentEmployee = await prisma.employee.findUnique({
      where: { id }
    });

    if (!currentEmployee) {
      return NextResponse.json(
        { success: false, error: "Employee not found" },
        { status: 404 }
      );
    }

    // Soft delete by setting isActive to false
    await prisma.employee.update({
      where: { id },
      data: { isActive: false }
    });

    // Shift remaining employees' order to fill the gap
    await prisma.employee.updateMany({
      where: {
        order: { gt: currentEmployee.order },
        isActive: true
      },
      data: {
        order: { decrement: 1 }
      }
    });

    return NextResponse.json({
      success: true,
      message: "Employee deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}