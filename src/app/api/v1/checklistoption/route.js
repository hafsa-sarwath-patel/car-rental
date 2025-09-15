import prisma from "@/lib/prisma";

// GET all checklist options
export async function GET() {
  try {
    const checklists = await prisma.ChecklistOption.findMany({
      include: { category: true }, // Include category name
    });
    return new Response(JSON.stringify(checklists), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch checklist options" }), { status: 500 });
  }
}

// POST new checklist option
export async function POST(req) {
  try {
    const { name, categoryId } = await req.json();
    const checklist = await prisma.ChecklistOption.create({
      data: { name, categoryId },
      include: { category: true },
    });
    return new Response(JSON.stringify(checklist), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Failed to create checklist option" }), { status: 500 });
  }
}
