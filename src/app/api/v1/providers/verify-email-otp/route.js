import { NextResponse } from 'next/server';
import { providerDal } from '@/server/dal/providerDal';
import { generateOTP } from '@/server/utils/otp';

export async function POST(req) {
  try {
    const { email } = await req.json();

    const provider = await providerDal.findByEmail(email);
    if (!provider) {
      return NextResponse.json({ message: 'Provider not found' }, { status: 404 });
    }

    const emailOTP = generateOTP();

    await providerDal.update(provider.id, { emailOTP });

    return NextResponse.json({
      message: 'OTP generated and stored successfully.',
      otp: emailOTP, // temporary for testing
    });
  } catch (err) {
    console.error('Email verification error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
