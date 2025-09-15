import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const models = await prisma.Model.findMany({
      include: { brand: true }, // include brand name
    });

    // Map for frontend
    const mapped = models.map((m) => ({
      id: m.id,
      name: m.name,
      brandId: m.brandId,
      brandName: m.brand?.name || "",
      isActive: m.isActive,
    }));

    return new Response(JSON.stringify(mapped), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: "Failed to fetch models" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const model = await prisma.Model.create({
      data: {
        name: body.name,
        brandId: body.brandId,
        isActive: body.isActive ?? true,
      },
    });
    return new Response(JSON.stringify(model), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Failed to create model" }), { status: 500 });
  }
}
