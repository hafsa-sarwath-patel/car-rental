import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const category = await prisma.ChecklistCategory.findUnique({ where: { id: params.id } });
    if (!category) return new Response(JSON.stringify({ error: "Category not found" }), { status: 404 });
    return new Response(JSON.stringify(category), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch category" }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { name, description } = await req.json();
    const category = await prisma.ChecklistCategory.update({
      where: { id: params.id },
      data: { name, description },
    });
    return new Response(JSON.stringify(category), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Failed to update category" }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await prisma.ChecklistCategory.delete({ where: { id: params.id } });
    return new Response(JSON.stringify({ message: "Category deleted" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Failed to delete category" }), { status: 500 });
  }
}
