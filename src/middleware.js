import { NextResponse } from "next/server";
import { verifyToken } from "@/util/jwt-access";

export async function middleware(req) {
  const url = req.nextUrl;

  // ✅ Allow login page & auth API
  if (url.pathname.startsWith("/login") || url.pathname.startsWith("/api/v1/auth")) {
    return NextResponse.next();
  }

  // 🔒 Get JWT from cookie or Authorization header
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
    // Not authenticated → redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Verify token safely
  let payload;
  try {
    payload = await verifyToken(token);
  } catch (err) {
    console.error("Token verification failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!payload) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ Token valid, continue
  return NextResponse.next();
}

// 🔧 Protect specific paths
export const config = {
  matcher: [
    "/api/users/:path*",
    "/admin/dashboard/:path*",
  ],
};
