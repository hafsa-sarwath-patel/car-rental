import { NextResponse } from "next/server";
import { generateToken } from "@/util/jwt-access";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // 1️⃣ Find user by username
    const user = await prisma.users.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid username", data: null, statusCode: 401 },
        { status: 401 }
      );
    }

    // 2️⃣ Verify password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { message: "Invalid credentials", data: null, statusCode: 401 },
        { status: 401 }
      );
    }

    // 3️⃣ Generate JWT
    const token = await generateToken({ id: user.id, role: user.role });

    // 4️⃣ Send response + set cookie
    const res = NextResponse.json({
      message: "Login Successful",
      data: token, // optional, cookie is enough
      statusCode: 200,
    });

    res.cookies.set("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "lax", // works for cross-origin in deployment
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return res;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { message: "Server error", data: null, statusCode: 500 },
      { status: 500 }
    );
  }
}
