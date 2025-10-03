import prisma from "@/lib/prisma";

// Update a state
export async function PUT(req, { params }) {
  const { id } = params;
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

    const state = await prisma.state.update({
      where: { id: Number(id) },
      data: { name, code, status },
    });

    return new Response(JSON.stringify(state), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to update state" }),
      { status: 500 }
    );
  }
}

// Delete a state
export async function DELETE(_, { params }) {
  const { id } = params;
  try {
    await prisma.state.delete({
      where: { id: Number(id) },
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to delete state" }),
      { status: 500 }
    );
  }
}
