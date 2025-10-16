import { NextResponse } from 'next/server';
import { documentService } from '@/server/services/documentService';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const result = await documentService.upload(formData);
    return NextResponse.json(result, { status: result.statusCode });
  } catch (err) {
    console.error('Document Upload Error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
