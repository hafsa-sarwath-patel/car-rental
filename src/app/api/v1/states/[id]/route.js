import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const state = await prisma.State.findUnique({ where: { id: params.id } });
    if (!state) return new Response(JSON.stringify({ error: "State not found" }), { status: 404 });
    return new Response(JSON.stringify(state), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch state" }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { name } = await req.json();
    const state = await prisma.State.update({
      where: { id: params.id },
      data: { name },
    });
    return new Response(JSON.stringify(state), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Failed to update state" }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await prisma.State.delete({ where: { id: params.id } });
    return new Response(JSON.stringify({ message: "State deleted" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Failed to delete state" }), { status: 500 });
  }
}
