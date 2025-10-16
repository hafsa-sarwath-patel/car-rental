import { NextResponse } from "next/server";
import documentService from "@/server/services/documentService";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const result = await documentService.upload(formData);

    if (result.statusCode !== 201) {
      return NextResponse.json(
        { error: result.message },
        { status: result.statusCode }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Provider document upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    );
  }
}