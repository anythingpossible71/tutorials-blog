import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.any(), // Rich text editor state
  categoryId: z.string().min(1, "Category is required"),
  status: z.enum(["draft", "published"]).default("draft"),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const validatedData = createPostSchema.parse(body);

    // Generate slug from title
    const slug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "A post with this title already exists" },
        { status: 400 }
      );
    }

    // Convert rich text editor state to string for storage
    const contentString = JSON.stringify(validatedData.content);
    
    // Extract text content for reading time calculation
    const extractTextFromEditorState = (editorState: any): string => {
      if (!editorState?.root?.children) return "";
      return editorState.root.children
        .map((node: any) => {
          if (node.children) {
            return node.children
              .map((child: any) => child.text || "")
              .join(" ");
          }
          return node.text || "";
        })
        .join(" ");
    };
    
    const textContent = extractTextFromEditorState(validatedData.content);
    
    // Create the post
    const post = await prisma.post.create({
      data: {
        title: validatedData.title,
        content: contentString,
        slug,
        status: validatedData.status,
        published_at: validatedData.status === "published" ? new Date() : null,
        author_id: user.id,
        reading_time: Math.ceil(textContent.split(" ").length / 200), // Rough estimate: 200 words per minute
      },
    });

    // Create the category relationship
    await prisma.postCategory.create({
      data: {
        post_id: post.id,
        category_id: validatedData.categoryId,
      },
    });

    return NextResponse.json({
      message: "Post created successfully",
      slug: post.slug,
      id: post.id,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
