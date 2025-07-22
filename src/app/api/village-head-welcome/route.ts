import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const welcome = await prisma.villageHeadWelcome.findFirst({
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: welcome || { content: "" }
    });
  } catch (error) {
    console.error("Error fetching village head welcome:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch village head welcome" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 403 }
      );
    }

    const { content } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 }
      );
    }

    // Check if welcome message already exists
    const existingWelcome = await prisma.villageHeadWelcome.findFirst();

    let welcome;
    if (existingWelcome) {
      // Update existing welcome message
      welcome = await prisma.villageHeadWelcome.update({
        where: { id: existingWelcome.id },
        data: { content }
      });
    } else {
      // Create new welcome message
      welcome = await prisma.villageHeadWelcome.create({
        data: { content }
      });
    }

    return NextResponse.json({
      success: true,
      data: welcome
    });
  } catch (error) {
    console.error("Error saving village head welcome:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save village head welcome" },
      { status: 500 }
    );
  }
}