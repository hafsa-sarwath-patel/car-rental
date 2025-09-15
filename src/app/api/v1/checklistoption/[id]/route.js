import prisma from "@/lib/prisma";

// PUT: Update checklist option
export async function PUT(req, { params }) {
  try {
    const { name, categoryId } = await req.json();
    const { id } = params;

    const updatedChecklist = await prisma.ChecklistOption.update({
      where: { id },
      data: { name, categoryId },
      include: { category: true },
    });

    return new Response(JSON.stringify(updatedChecklist), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Failed to update checklist option" }), { status: 500 });
  }
}

// DELETE: Delete checklist option
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await prisma.ChecklistOption.delete({ where: { id } });
    return new Response(JSON.stringify({ message: "Checklist option deleted successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Failed to delete checklist option" }), { status: 500 });
  }
}
