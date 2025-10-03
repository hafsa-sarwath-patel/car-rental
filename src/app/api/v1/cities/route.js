import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cities = await prisma.City.findMany({
      include: { state: true },
      orderBy: { id: "asc" },
    });

    const result = cities.map((c) => ({
      id: c.id,
      name: c.name,
      stateId: c.stateId,
      stateName: c.state?.name || "",
      status: c.status,
    }));

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch cities" }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { name, stateId, status = "Active" } = await req.json();
    const city = await prisma.City.create({
      data: { name, stateId, status },
      include: { state: true },
    });
    return new Response(JSON.stringify(city), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create city" }),
      { status: 500 }
    );
  }
}
