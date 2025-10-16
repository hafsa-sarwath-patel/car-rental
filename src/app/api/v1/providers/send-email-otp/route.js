import { NextResponse } from 'next/server';
import { providerService } from '@/server/services/providerService';

export async function POST(req) {
  try {
    const { email } = await req.json();
    const result = await providerService.sendEmailOTP(email);
    return NextResponse.json(result, { status: result.statusCode });
  } catch (err) {
    console.error('Send Email OTP Error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
