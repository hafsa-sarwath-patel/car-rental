import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const model = await prisma.Model.findUnique({
      where: { id: params.id },
      include: { brand: true },
    });
    if (!model) return new Response(JSON.stringify({ message: "Model not found" }), { status: 404 });

    return new Response(
      JSON.stringify({ ...model, brandName: model.brand?.name }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ message: "Failed to fetch model" }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const updated = await prisma.Model.update({
      where: { id: params.id },
      data: {
        name: body.name,
        brandId: body.brandId,
        isActive: body.isActive ?? true,
      },
    });
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: "Failed to update model" }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await prisma.Model.delete({ where: { id: params.id } });
    return new Response(JSON.stringify({ message: "Model deleted" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: "Failed to delete model" }), { status: 500 });
  }
}
