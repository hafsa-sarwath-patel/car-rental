// app/api/v1/upload/route.js
import { NextResponse } from "next/server";
import { generateUploadUrl } from "@/util/io";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.DO_SPACES_REGION,
  endpoint: process.env.DO_SPACES_ENDPOINT.replace(/\/$/, ""),
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
});

// OPTIONS → CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3001",
      "Access-Control-Allow-Methods": "POST, PUT, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// POST → generate signed PUT URL
export async function POST(req) {
  try {
    const body = await req.json();
    if (!body?.fileName || !body?.fileType) {
      return NextResponse.json({ error: "fileName and fileType required" }, { status: 400 });
    }

    const { uploadUrl, fileUrl, key } = await generateUploadUrl(body.fileName, body.fileType, 300);

    return NextResponse.json(
      { uploadUrl, fileUrl, key },
      { headers: { "Access-Control-Allow-Origin": "http://localhost:3001" } }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET → generate signed GET URL
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    if (!key) return NextResponse.json({ error: "key query param required" }, { status: 400 });

    const command = new GetObjectCommand({
      Bucket: process.env.DO_SPACES_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 300 });
    return NextResponse.json({ fileUrl: url }, {
      headers: { "Access-Control-Allow-Origin": "http://localhost:3001" },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
