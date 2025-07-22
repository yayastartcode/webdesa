import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Session } from "next-auth";

// GET - Fetch population data
export async function GET() {
  try {
    const populationData = await prisma.populationData.findFirst({
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: populationData
    });
  } catch (error) {
    console.error('Error fetching population data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch population data' },
      { status: 500 }
    );
  }
}

// POST - Create or update population data
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      totalPopulation,
      malePopulation,
      femalePopulation,
      households,
      temporaryResidents,
      populationMutations
    } = body;

    // Validate required fields
    if (
      typeof totalPopulation !== 'number' ||
      typeof malePopulation !== 'number' ||
      typeof femalePopulation !== 'number' ||
      typeof households !== 'number' ||
      typeof temporaryResidents !== 'number' ||
      typeof populationMutations !== 'number'
    ) {
      return NextResponse.json(
        { success: false, error: 'All fields must be valid numbers' },
        { status: 400 }
      );
    }

    // Validate that male + female = total
    if (malePopulation + femalePopulation !== totalPopulation) {
      return NextResponse.json(
        { success: false, error: 'Male and female population must sum to total population' },
        { status: 400 }
      );
    }

    // Check if population data already exists
    const existingData = await prisma.populationData.findFirst();

    let populationData;
    if (existingData) {
      // Update existing data
      populationData = await prisma.populationData.update({
        where: { id: existingData.id },
        data: {
          totalPopulation,
          malePopulation,
          femalePopulation,
          households,
          temporaryResidents,
          populationMutations
        }
      });
    } else {
      // Create new data
      populationData = await prisma.populationData.create({
        data: {
          totalPopulation,
          malePopulation,
          femalePopulation,
          households,
          temporaryResidents,
          populationMutations
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: populationData
    });
  } catch (error) {
    console.error('Error saving population data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save population data' },
      { status: 500 }
    );
  }
}