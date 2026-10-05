import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const sessionCookie = request.cookies.get("sah_session")?.value;

  // 1. Protected Admin API Routes: Return 401 JSON immediately if unauthenticated
  if (pathname.startsWith("/api/admin")) {
    if (!sessionCookie) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Administrative session required.",
        },
        { status: 401 }
      );
    }
  }

  // 2. Protected Admin Dashboard Page: Redirect to login if unauthenticated
  if (pathname.startsWith("/admin")) {
    if (!sessionCookie) {
      const redirectUrl = new URL("/auth/login", request.url);
      redirectUrl.searchParams.set("redirect", pathname + search);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 3. Protected Customer Account Routes
  if (pathname.startsWith("/account")) {
    if (!sessionCookie) {
      const redirectUrl = new URL("/auth/login", request.url);
      redirectUrl.searchParams.set("redirect", pathname + search);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 4. Prevent logged-in users from visiting login/register pages again
  if (pathname === "/auth/login" || pathname === "/auth/register") {
    if (sessionCookie) {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  // 5. Proceed and attach baseline security headers
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
    "/account",
    "/account/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
