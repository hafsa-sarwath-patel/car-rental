import { NextResponse } from "next/server";
import { verifyToken } from "@/util/jwt-access";

export async function middleware(req) {
  const url = req.nextUrl;

  // ✅ Allow the login page and the auth API
  if (url.pathname === "/login" || url.pathname === "/api/v1/auth") {
    return NextResponse.next();
  }

  // 🔒 Check JWT in cookie or Authorization header (Bearer)
  const cookieToken = req.cookies.get("jwt")?.value;
  const authHeader = req.headers.get("authorization");
  const headerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  const token = cookieToken || headerToken;

  // Only enforce on protected paths
  const isProtected =
    url.pathname.startsWith("/api/users") ||
    url.pathname.startsWith("/admin/dashboard");

  if (!isProtected) return NextResponse.next();

  if (!token) {
    // Not authenticated → send to login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// 🔧 Protect only what you need blocked.
// (Login + /api/v1/auth are implicitly allowed because they’re not matched.)
export const config = {
  matcher: [
    "/api/users/:path*",
    "/admin/dashboard/:path*",
  ],
};
