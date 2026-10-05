import { NextResponse } from "next/server";
import { getPublishedArticles, CONTENT_CATEGORIES } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const tag = searchParams.get("tag") || undefined;
    const search = searchParams.get("search") || undefined;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 20;
    const skip = searchParams.get("skip") ? Number(searchParams.get("skip")) : 0;
    const featuredOnly = searchParams.get("featured") === "true";

    const result = await getPublishedArticles({
      category,
      tag,
      search,
      limit,
      skip,
      featuredOnly,
    });

    return NextResponse.json({
      success: true,
      categories: CONTENT_CATEGORIES,
      ...result,
    });
  } catch (error: any) {
    console.error("Content GET error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to retrieve travel articles." },
      { status: 500 }
    );
  }
}
