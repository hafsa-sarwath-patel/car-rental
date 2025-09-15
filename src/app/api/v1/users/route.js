import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

/** ── GET: list users with optional pagination ── **/
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    let data, total;

    if (pageParam && limitParam) {
      const page = parseInt(pageParam, 10);
      const limit = parseInt(limitParam, 10);
      const skip = (page - 1) * limit;

      [data, total] = await Promise.all([
        prisma.users.findMany({
          skip,
          take: limit,
          orderBy: { name: "asc" },
        }),
        prisma.users.count(),
      ]);

      return NextResponse.json({
        data,
        meta: { total, page, limit },
      });
    } else {
      data = await prisma.users.findMany({ orderBy: { name: "asc" } });
      total = data.length;

      return NextResponse.json({
        data,
        meta: { total },
      });
    }
  } catch (err) {
    console.error("GET /users error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** ── POST: create a new user ── **/
export async function POST(req) {
  try {
    const { name, username, email, password, role } = await req.json();

    // 1️⃣ Validate required fields
    if (!name || !username || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2️⃣ Check if username already exists
    const existingUser = await prisma.users.findUnique({ where: { username } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create new user
    const newUser = await prisma.users.create({
      data: { name, username, email, password: hashedPassword, role },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    console.error("POST /users error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
