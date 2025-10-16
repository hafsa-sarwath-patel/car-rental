import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';

export const documentService = {
  async upload(formData) {
    const providerId = formData.get('providerId');
    const documentTypeId = formData.get('documentTypeId');
    const files = formData.getAll('files');

    if (!providerId || !documentTypeId)
      return { statusCode: 400, message: 'Missing required fields' };

    const uploadedUrls = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name}`;
      const filePath = path.join(process.cwd(), 'public/uploads', filename);
      await writeFile(filePath, buffer);
      const fileUrl = `/uploads/${filename}`;

      await prisma.providerDocument.create({
        data: { providerId, documentTypeId, fileUrl },
      });

      uploadedUrls.push(fileUrl);
    }

    return { statusCode: 200, message: 'Documents uploaded', uploadedUrls };
  },
};
