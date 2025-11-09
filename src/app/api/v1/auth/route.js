// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generateToken } from "@/util/jwt-access";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { message: "Invalid JSON", data: null },
        { status: 400 }
      );
    }

    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required", data: null },
        { status: 400 }
      );
    }

    const user = await prisma.users.findFirst({ where: { username } });

    if (!user || !user.password) {
      return NextResponse.json(
        { message: "Invalid credential", data: null },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { message: "Invalid credentials", data: null },
        { status: 401 }
      );
    }

    const token = await generateToken({ id: user.id, role: user.role });

    const res = NextResponse.json(
      { message: "Login successful", data: token },
      { status: 200 }
    );

    res.cookies.set("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60,
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
