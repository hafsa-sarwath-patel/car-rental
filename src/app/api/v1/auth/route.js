import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generateToken } from "@/util/jwt-access";

export async function POST(req) {
  try {
    // 1️⃣ Parse JSON safely
    let body;
    try {
      body = await req.json();
    } catch (err) {
      console.error("Invalid JSON:", err);
      return NextResponse.json(
        { message: "Invalid request body", data: null },
        { status: 400 }
      );
    }

    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password required", data: null },
        { status: 400 }
      );
    }

    // 2️⃣ Ensure DB is connected
    try {
      await prisma.$connect();
    } catch (dbErr) {
      console.error("DB connection failed:", dbErr);
      return NextResponse.json(
        { message: "Database connection error", data: null },
        { status: 500 }
      );
    }

    // 3️⃣ Find user
    const user = await prisma.users.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json({ message: "Invalid username", data: null }, { status: 401 });
    }

    // 4️⃣ Verify password
    const valid = await bcrypt.compare(password, user.password || "");
    if (!valid) {
      return NextResponse.json({ message: "Invalid credentials", data: null }, { status: 401 });
    }

    // 5️⃣ Generate JWT
    const token = await generateToken({ id: user.id, role: user.role });

    // 6️⃣ Return JSON + set cookie
    const res = NextResponse.json({ message: "Login successful", data: token }, { status: 200 });
    res.cookies.set("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    console.log("Login successful:", username);
    return res;

  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ message: "Server error", data: null }, { status: 500 });
  } finally {
    // 7️⃣ Optional: disconnect after request
    await prisma.$disconnect();
  }
}
