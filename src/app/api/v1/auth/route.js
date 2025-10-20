// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generateToken } from "@/util/jwt-access";

export async function POST(req) {
  try {
    // 1️⃣ Parse JSON safely
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { message: "Invalid JSON", data: null },
        { status: 400 }
      );
    }
    

    const { username, password } = body;

    // 2️⃣ Validate input
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required", data: null },
        { status: 400 }
      );
    }

    // 3️⃣ Find user in DB by username only (auto-detect role)
    const user = await prisma.user.findFirst({
      where: {
        username
      }
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { message: "Invalid credentials", data: null },
        { status: 401 }
      );
    }

    // 4️⃣ Verify password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { message: "Invalid credentials", data: null },
        { status: 401 }
      );
    }

    // 5️⃣ Generate JWT
    const token = await generateToken({ id: user.id, role: user.role });

    // 6️⃣ Set httpOnly cookie and return response
    const res = NextResponse.json(
      { message: "Login successful", data: token },
      { status: 200 }
    );
    res.cookies.set("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, // 1 day
    });

    console.log("Login successful:", username, "Role:", user.role);
    return res;

  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { message: "Server error", data: null },
      { status: 500 }
    );
  }
}
