import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get allowed origin from environment variable
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3001';

// ------------------------
// OPTIONS: CORS preflight
// ------------------------
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// ------------------------
// GET: fetch active document types
// ------------------------
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const forProviders = url.searchParams.get("forProviders") === "true"; // ?forProviders=true
    const forCustomers = url.searchParams.get("forCustomers") === "true"; // ?forCustomers=true

    const docTypes = await prisma.documentType.findMany({
      where: { is_active: true, forProviders, forCustomers },
      select: { id: true, name: true },
    });

    return NextResponse.json(docTypes, { 
      status: 200,
      headers: { 'Access-Control-Allow-Origin': allowedOrigin }
    });
  } catch (err) {
    console.error("DocumentType Fetch Error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': allowedOrigin }
    });
  }
}

// ------------------------
// POST: create a new document type
// Optional: later can be used for adding documents
// ------------------------
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, forProviders = false, forCustomers = false } = body;

    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { 
        status: 400,
        headers: { 'Access-Control-Allow-Origin': allowedOrigin }
      });
    }

    const docType = await prisma.documentType.create({
      data: { name, forProviders, forCustomers },
    });

    return NextResponse.json({ message: "Document type created", docType }, { 
      status: 201,
      headers: { 'Access-Control-Allow-Origin': allowedOrigin }
    });
  } catch (err) {
    console.error("DocumentType Creation Error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': allowedOrigin }
    });
  }
}
