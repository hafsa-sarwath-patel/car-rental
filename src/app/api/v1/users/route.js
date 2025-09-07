import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET all users
export async function GET() {
  const users = await prisma.users.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      role_id: true,
      isAvailable: true,
    },
  });
  return NextResponse.json(users);
}

// Create new user (Register)
export async function POST(req) {
  try {
    const { name, username, password, role_id } = await req.json();

    // check duplicate username
    const existing = await prisma.users.findUnique({
      where: { username },
    });
    if (existing) {
      return NextResponse.json(
        { message: "Username already taken", statusCode: 400 },
        { status: 400 }
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        name,
        username,
        password: hashedPassword,
        role_id: role_id || "USER",
      },
      select: {
        id: true,
        name: true,
        username: true,
        role_id: true,
        isAvailable: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err.message, statusCode: 400 },
      { status: 400 }
    );
  }
}
