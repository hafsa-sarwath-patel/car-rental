// util/io.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  region: process.env.DO_SPACES_REGION,
  endpoint: process.env.DO_SPACES_ENDPOINT.replace(/\/$/, ""),
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
});

// Generate signed URL for upload
export async function generateUploadUrl(fileName, fileType, expiresIn = 120) {
  const uniqueFileName = `${Date.now()}_${randomUUID()}_${fileName}`;

  const params = {
    Bucket: process.env.DO_SPACES_NAME,
    Key: `uploads/${uniqueFileName}`, // organized uploads folder
    ContentType: fileType,
  };

  const command = new PutObjectCommand(params);
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn });

  // Public URL (only works if Space is public; otherwise use signed GET)
  const endpoint = process.env.DO_SPACES_ENDPOINT.replace(/^https?:\/\//, "");
  const fileUrl = `https://${process.env.DO_SPACES_NAME}.${endpoint}/uploads/${uniqueFileName}`;

  // return uploadUrl + fileUrl (for debugging) + key (for signed GET later)
  return { uploadUrl, fileUrl, key: `uploads/${uniqueFileName}` };
}
