import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generateToken } from "@/util/jwt-access";



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

    // ✅ New check: make sure user has a valid role
    if (!user.role) {
      return NextResponse.json(
        { message: "User role missing", data: null, statusCode: 500 },
        { status: 500 }
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
      data: token,
      statusCode: 200,
    });

    res.cookies.set("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
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
