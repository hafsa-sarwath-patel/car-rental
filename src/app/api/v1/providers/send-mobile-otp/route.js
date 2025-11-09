import { NextResponse } from 'next/server';
import { providerService } from '@/server/services/providerService';

export async function POST(req) {
  try {
    const { mobile } = await req.json();
    const result = await providerService.sendMobileOTP(mobile);
    return NextResponse.json(result, { status: result.statusCode });
  } catch (err) {
    console.error('Send Mobile OTP Error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}