import prisma from "@/lib/prisma";

// GET brand by ID
export async function GET(req, { params }) {
  try {
    const brand = await prisma.Brand.findUnique({
      where: { id: params.id },
    });
    if (!brand) return new Response(JSON.stringify({ error: "Brand not found" }), { status: 404 });
    return new Response(JSON.stringify(brand), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch brand" }), { status: 500 });
  }
}

// PUT update brand by ID
export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const brand = await prisma.Brand.update({
      where: { id: params.id },
      data: {
        name: body.name,
        image: body.image || null,
        isActive: body.isActive ?? true,
      },
    });
    return new Response(JSON.stringify(brand), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to update brand" }), { status: 500 });
  }
}

// DELETE brand by ID

export async function DELETE(req, { params }) {
  try {
    // Await params before using
    const { id } = params;

    await prisma.Brand.delete({
      where: { id: id },
    });

    return new Response(JSON.stringify({ message: "Brand deleted" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return new Response(JSON.stringify({ message: "Failed to delete brand" }), { status: 500 });
  }
}

