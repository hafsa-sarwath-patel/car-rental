import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const states = await prisma.State.findMany();
    return new Response(JSON.stringify(states), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch states" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name } = await req.json();
    const state = await prisma.State.create({ data: { name } });
    return new Response(JSON.stringify(state), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Failed to create state" }), { status: 500 });
  }
}
