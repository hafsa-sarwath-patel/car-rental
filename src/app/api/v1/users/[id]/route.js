// src/app/api/v1/users/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // or your prisma client path
import bcrypt from "bcryptjs";

export async function PUT(req, { params }) {
  try {
   
    const id = await params;


    const data = await req.json();

    // Handle optional password
    const updateData = { ...data };
    if (!updateData.password) delete updateData.password;
    else updateData.password = await bcrypt.hash(updateData.password, 10);

    // Optional: make email truly optional
    if (updateData.email === "") delete updateData.email;

    // Prevent duplicate username/email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: updateData.username },
          ...(updateData.email ? [{ email: updateData.email }] : []),
        ],
        NOT: { id },
      },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username or Email already exists for another user" },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
