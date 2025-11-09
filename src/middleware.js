import { NextResponse } from "next/server";
import { verifyToken } from "@/util/jwt-access";

const allowedOrigins = [
  "http://localhost:3001",
  "https://providers-car-rental.vercel.app",
  "https://car-rental-76gu.vercel.app",
];

export async function middleware(req) {
  const url = req.nextUrl;
  const origin = req.headers.get("origin");
  const method = req.method;

  // ✅ 1. Handle CORS preflight (OPTIONS)
  if (method === "OPTIONS") {
    const res = NextResponse.json({}, { status: 200 });
    const allowedOrigin = allowedOrigins.includes(origin)
      ? origin
      : allowedOrigins[0];
    res.headers.set("Access-Control-Allow-Origin", allowedOrigin);
    res.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return res;
  }

  // ✅ 2. Add CORS headers to every other response
  const response = NextResponse.next();
  const allowedOrigin = allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0];
  response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // ✅ 3. Public routes (skip auth)
  if (
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/api/v1/auth") ||
    url.pathname.startsWith("/api/v1/providers") ||
    url.pathname.startsWith("/api/v1/upload") // allow uploads to proceed
  ) {
    return response;
  }

  // ✅ 4. Get JWT from cookie or Authorization header
  const cookieToken = req.cookies.get("jwt")?.value;
  const authHeader = req.headers.get("authorization");
  const headerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;
  const token = cookieToken || headerToken;

  // ✅ 5. Protect specific paths
  const isProtected =
    url.pathname.startsWith("/api/users") ||
    url.pathname.startsWith("/admin/dashboard") ||
    url.pathname.startsWith("/api/v1/secure");

  if (!isProtected) return response;

  // 🔒 Require token
  if (!token) {
    console.warn("Unauthorized access, redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const payload = await verifyToken(token);
    if (!payload) throw new Error("Invalid token");
  } catch (err) {
    console.error("Token verification failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ If token vaid → continue
  return response;
}

// 🔧 6. Apply middleware to relevant paths
export const config = {
  matcher: [
    "/api/:path*",
    "/admin/:path*",
    "/login",
  ],
};
