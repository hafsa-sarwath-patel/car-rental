import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:3001";

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
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

    const body = await req.json();
    const { name, username, email, mobile, password } = body;

    if (!name || !username || !email || !mobile || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const existing = await prisma.providers.findFirst({
      where: { OR: [{ email }, { mobile }] },
    });
    if (existing) {
      return NextResponse.json({ message: "Email or mobile already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const provider = await prisma.providers.create({
      data: { provider_name: name, email, mobile },
    });

    // Remove password from response
    const { password: _, ...providerData } = provider;

    return NextResponse.json(
      { message: "Signup successful", provider: providerData },
      {
        status: 201,
        headers: { "Access-Control-Allow-Origin": allowedOrigin },
      }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
