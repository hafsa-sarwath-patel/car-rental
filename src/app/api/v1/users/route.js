import { NextResponse } from "next/server";
import { listUsers, registerUser } from "@/server/services/usersService";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const { data, total } = await listUsers(page, limit);
  return NextResponse.json({ data, meta: { total, page, limit } });
}

export async function POST(req) {
  const body = await req.json();
  const newUser = await registerUser(body);
  return NextResponse.json(newUser, { status: 201 });


}





