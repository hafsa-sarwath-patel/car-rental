import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cities = await prisma.City.findMany({
      include: { state: true }, // include state name
    });

    const result = cities.map(c => ({
      id: c.id,
      name: c.name,
      stateId: c.stateId,
      stateName: c.state?.name || "",
    }));

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch cities" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, stateId } = await req.json();
    const city = await prisma.City.create({
      data: { name, stateId },
    });
    return new Response(JSON.stringify(city), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Failed to create city" }), { status: 500 });
  }
}
