import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/header-settings
export async function GET() {
  try {
    const headerSettings = await prisma.headerSettings.findFirst({
      include: {
        navigationItems: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      }
    });

    return NextResponse.json(headerSettings);
  } catch (error) {
    console.error("Error fetching header settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch header settings" },
      { status: 500 }
    );
  }
}

// POST /api/header-settings
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { logoUrl, navigationItems } = await request.json();

    // Check if header settings already exist
    let headerSettings = await prisma.headerSettings.findFirst();

    if (headerSettings) {
      // Update existing settings
      headerSettings = await prisma.headerSettings.update({
        where: { id: headerSettings.id },
        data: { logoUrl },
        include: {
          navigationItems: {
            orderBy: { order: 'asc' }
          }
        }
      });
    } else {
      // Create new settings
      headerSettings = await prisma.headerSettings.create({
        data: { logoUrl },
        include: {
          navigationItems: {
            orderBy: { order: 'asc' }
          }
        }
      });
    }

    // Update navigation items if provided
    if (navigationItems && Array.isArray(navigationItems)) {
      // Delete existing navigation items
      await prisma.navigationItem.deleteMany({
        where: { headerSettingsId: headerSettings.id }
      });

      // Create new navigation items
      if (navigationItems.length > 0) {
        await prisma.navigationItem.createMany({
          data: navigationItems.map((item: any, index: number) => ({
            label: item.label,
            href: item.href,
            order: item.order || index + 1,
            isActive: item.isActive !== false,
            headerSettingsId: headerSettings.id
          }))
        });
      }

      // Fetch updated settings with navigation items
      const updatedSettings = await prisma.headerSettings.findUnique({
        where: { id: headerSettings.id },
        include: {
          navigationItems: {
            where: { isActive: true },
            orderBy: { order: 'asc' }
          }
        }
      });
      
      if (updatedSettings) {
        headerSettings = updatedSettings;
      }
    }

    return NextResponse.json(headerSettings);
  } catch (error) {
    console.error("Error updating header settings:", error);
    return NextResponse.json(
      { error: "Failed to update header settings" },
      { status: 500 }
    );
  }
}