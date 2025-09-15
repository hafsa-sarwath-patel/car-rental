import prisma from "@/lib/prisma";

// DELETE a variant
export async function DELETE(req, { params }) {
  try {
    const id = params.id;

    await prisma.Variant.delete({
      where: { id },
    });

    return new Response(JSON.stringify({ message: "Variant deleted" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to delete variant" }), { status: 500 });
  }
}

// PUT update a variant
export async function PUT(req, { params }) {
  try {
    const id = params.id;
    const body = await req.json();

    if (!body.name || !body.modelId) {
      return new Response(JSON.stringify({ error: "Missing name or modelId" }), { status: 400 });
    }

    const updatedVariant = await prisma.Variant.update({
      where: { id },
      data: {
        name: body.name,
        modelId: body.modelId,
      },
    });

    return new Response(JSON.stringify(updatedVariant), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// Optional: GET single variant
export async function GET(req, { params }) {
  try {
    const variant = await prisma.Variant.findUnique({
      where: { id: params.id },
    });
    return new Response(JSON.stringify(variant), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch variant" }), { status: 500 });
  }
}
