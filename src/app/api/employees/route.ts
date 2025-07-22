import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Session } from "next-auth";

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        order: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: employees
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // Check if order already exists and adjust if needed
    const existingEmployee = await prisma.employee.findFirst({
      where: { order, isActive: true }
    });

    if (existingEmployee) {
      // Shift other employees' order
      await prisma.employee.updateMany({
        where: {
          order: { gte: order },
          isActive: true
        },
        data: {
          order: { increment: 1 }
        }
      });
    }

    const employee = await prisma.employee.create({
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
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create employee" },
      { status: 500 }
    );
  }
}