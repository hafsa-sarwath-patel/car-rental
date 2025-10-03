import prisma from "@/lib/prisma";

// GET all states
export async function GET() {
  try {
    const states = await prisma.state.findMany({
      orderBy: { name: "asc" },
    });
    return new Response(JSON.stringify(states), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch states" }),
      { status: 500 }
    );
  }
}

// POST: create new state
export async function POST(req) {
  try {
    const { name, code, status } = await req.json();

    if (!name || !code) {
      return new Response(
        JSON.stringify({ error: "Name and code are required" }),
        { status: 400 }
      );
    }

    if (!["Active", "Inactive"].includes(status)) {
      return new Response(
        JSON.stringify({ error: "Status must be Active or Inactive" }),
        { status: 400 }
      );
    }

    const state = await prisma.state.create({
      data: { name, code, status },
    });

    return new Response(JSON.stringify(state), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create state" }),
      { status: 500 }
    );
  }
}
