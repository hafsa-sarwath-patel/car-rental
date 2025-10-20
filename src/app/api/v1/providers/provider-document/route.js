import { NextResponse } from "next/server";
import {documentService} from "@/server/services/documentService";

export async function POST(req) {
  try {
    // Get form data (must be multipart/form-data)
    const formData = await req.formData();
    const result = await documentService.upload(formData);

    if (!result || result.statusCode !== 200) {
      return NextResponse.json(
        { error: result?.message || "Document upload failed" },
        { status: result?.statusCode || 400 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Provider document upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    );
  }
}

