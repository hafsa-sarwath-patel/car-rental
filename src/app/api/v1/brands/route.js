import prisma from "@/lib/prisma";

// GET all brands
export async function GET() {
  try {
    const brands = await prisma.Brand.findMany({
      orderBy: { createdAt: "desc" },
    });
    return new Response(JSON.stringify(brands), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch brands" }), { status: 500 });
  }
}

// POST new brand
export async function POST(req) {
  try {
    const body = await req.json();

    // Check for unique name
    const existingBrand = await prisma.Brand.findUnique({
      where: { name: body.name },
    });
    if (existingBrand) {
      return new Response(JSON.stringify({ error: "Brand name already exists" }), { status: 400 });
    }

    const brand = await prisma.Brand.create({
      data: {
        name: body.name,
        image: body.image || null,
        isActive: body.isActive ?? true, // optional field
      },
    });

    return new Response(JSON.stringify(brand), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to create brand" }), { status: 500 });
  }
}
