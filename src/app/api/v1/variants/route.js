import prisma from "@/lib/prisma";

// GET  /api/v1/variants
// Fetch all variants with their related model (and brand if desired)
export async function GET() {
  try {
    const variants = await prisma.variant.findMany({
      include: {
        model: { include: { brand: true } }, // remove brand if not needed
      },
    });
    return new Response(JSON.stringify(variants), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch variants" }),
      { status: 500 }
    );
  }
}

// POST  /api/v1/variants
// Create a new variant
// Expected body: { name: string, modelId: string }
export async function POST(req) {
  try {
    const { name, modelId } = await req.json();

    if (!name || !modelId) {
      return new Response(
        JSON.stringify({ error: "name and modelId are required" }),
        { status: 400 }
      );
    }

    const newVariant = await prisma.variant.create({
      data: { name, modelId },
    });

    return new Response(JSON.stringify(newVariant), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create variant" }),
      { status: 500 }
    );
  }
}
