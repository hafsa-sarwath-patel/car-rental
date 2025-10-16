import { NextResponse } from 'next/server';
import { providerService } from '@/server/services/providerService';

export async function POST(req) {
  try {
    const { mobile, otp } = await req.json();
    const result = await providerService.verifyMobileOTP(mobile, otp);
    return NextResponse.json(result, { status: result.statusCode });
  } catch (err) {
    console.error('Mobile OTP Error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
