import { NextResponse } from "next/server";
import { getArticleBySlug, getRelatedArticles } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const article = await getArticleBySlug(slug);

    if (!article) {
      return NextResponse.json(
        { error: "Travel article not found." },
        { status: 404 }
      );
    }

    const relatedArticles = await getRelatedArticles(article.slug, article.category, 3);

    return NextResponse.json({
      success: true,
      article,
      relatedArticles,
    });
  } catch (error: any) {
    console.error("Single article GET error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to retrieve travel article." },
      { status: 500 }
    );
  }
}
