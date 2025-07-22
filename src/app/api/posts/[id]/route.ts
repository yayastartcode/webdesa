import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/posts/[id] - Get a specific post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id] - Update a post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 403 }
      );
    }

    const { title, content, imageUrl, published } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        imageUrl,
        published: published !== undefined ? published : existingPost.published
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Delete a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 403 }
      );
    }

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    await prisma.post.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete post" },
      { status: 500 }
    );
  }
}