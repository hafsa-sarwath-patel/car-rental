import prisma from "@/lib/prisma";

// Update a city
export async function PUT(req, { params }) {
  try {
    const { name, stateId, status } = await req.json();
    const updatedCity = await prisma.City.update({
      where: { id: params.id }, // ensure id is string
      data: {
        name,
        stateId,
        status,
        updatedAt: new Date(),
      },
    });
    return new Response(JSON.stringify(updatedCity), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// Delete a city
export async function DELETE(req, { params }) {
  try {
    await prisma.City.delete({
      where: { id: params.id }, // ensure id is string
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
