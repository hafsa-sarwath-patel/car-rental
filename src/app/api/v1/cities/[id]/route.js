import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const city = await prisma.City.findUnique({
      where: { id: params.id },
      include: { state: true },
    });
    if (!city) return new Response(JSON.stringify({ error: "City not found" }), { status: 404 });

    const result = {
      id: city.id,
      name: city.name,
      stateId: city.stateId,
      stateName: city.state?.name || "",
    };

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch city" }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { name, stateId } = await req.json();
    const city = await prisma.City.update({
      where: { id: params.id },
      data: { name, stateId },
    });
    return new Response(JSON.stringify(city), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Failed to update city" }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await prisma.City.delete({ where: { id: params.id } });
    return new Response(JSON.stringify({ message: "City deleted" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Failed to delete city" }), { status: 500 });
  }
}
