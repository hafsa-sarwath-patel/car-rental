import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generateToken } from "@/util/jwt-access";

const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:3001";

// ✅ Handle preflight CORS
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}

export async function POST(req) {
  try {
    const origin = req.headers.get("origin");
    // Only check CORS if origin header is present
    if (origin && origin !== allowedOrigin) {
      return NextResponse.json({ message: "CORS blocked" }, { status: 403 });
    }

    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ message: "Username and password required" }, { status: 400 });
    }

    // ✅ Find provider by username or email
    const provider = await prisma.providers.findFirst({ 
      where: { OR: [{ username: username }, { mobile: username }] } 
    });
    if (!provider) {
      return NextResponse.json({ message: "Provider not found" }, { status: 404 });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, provider.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // ✅ Generate JWT token using the utility function
    const token = await generateToken({ 
      id: provider.id, 
      username: provider.username,
      role: 'PROVIDER'
    });

    // Remove password from response
    const { password: _, ...providerData } = provider;

    return NextResponse.json(
      { message: "Login successful", token, provider: providerData },
      {
        status: 200,
        headers: { "Access-Control-Allow-Origin": allowedOrigin },
      }
    );
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
