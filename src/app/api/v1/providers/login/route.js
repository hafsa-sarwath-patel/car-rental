import { NextResponse } from 'next/server';
import { providerService } from '@/server/services/providerService';

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3001';

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

export async function POST(req) {
  try {
    const origin = req.headers.get('origin');
    if (origin && origin !== allowedOrigin) {
      return NextResponse.json({ message: 'CORS blocked' }, { status: 403 });
    }

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password required' },
        { status: 400 }
      );
    }

    const result = await providerService.login(username, password);

    return NextResponse.json(
      {
        message: result.message,
        token: result.token,
        provider: result.provider,
      },
      {
        status: result.statusCode,
        headers: { 'Access-Control-Allow-Origin': allowedOrigin },
      }
    );
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
