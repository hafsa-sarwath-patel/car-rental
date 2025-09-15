import prisma from "@/lib/prisma";

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.ChecklistCategory.findMany();
    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch categories" }), { status: 500 });
  }
}

// POST create new category
export async function POST(req) {
  try {
    const { name, description } = await req.json();
    if (!name) {
      return new Response(JSON.stringify({ error: "Name is required" }), { status: 400 });
    }
    const category = await prisma.ChecklistCategory.create({
      data: { name, description },
    });
    return new Response(JSON.stringify(category), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Failed to create category" }), { status: 500 });
  }
}
