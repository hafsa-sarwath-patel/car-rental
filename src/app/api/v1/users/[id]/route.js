import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Update User
export async function PUT(request, { params }) {
  try {
    const { id } = params; // dynamic route param
    const data = await request.json();

   const updatedUser = await prisma.users.update({
  where: { id: id },
  data: {
    name: data.name,
    role: data.role,
  },
  select: {
    id: true,
    name: true,
    username: true,
    role: true,
    isAvailable: true,
  },
});


    return NextResponse.json(updatedUser, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err.message, statusCode: 400 },
      { status: 400 }
    );
  }
}

// ✅ Delete User
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await prisma.users.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err.message, statusCode: 400 },
      { status: 400 }
    );
  }
}
