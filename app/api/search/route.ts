import { NextRequest, NextResponse } from "next/server";
import { performGlobalSearch } from "@/services/search-service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q") || "";
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  if (!q.trim()) {
    return NextResponse.json({
      query: "",
      destinations: [],
      countries: [],
      packages: [],
      activities: [],
      totalCount: 0,
    });
  }

  try {
    const results = await performGlobalSearch(q, limit);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Global search API error:", error);
    return NextResponse.json(
      { error: "Failed to execute database search" },
      { status: 500 }
    );
  }
}
