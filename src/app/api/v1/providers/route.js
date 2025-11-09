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
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

export async function GET(req) {
  try {
    const origin = req.headers.get('origin');
    if (origin && origin !== allowedOrigin) {
      return NextResponse.json({ message: 'CORS blocked' }, { status: 403 });
    }

    const providers = await providerService.list();
    return NextResponse.json(providers, {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': allowedOrigin },
    });
  } catch (err) {
    console.error('List providers error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const origin = req.headers.get('origin');
    if (origin && origin !== allowedOrigin) {
      return NextResponse.json({ message: 'CORS blocked' }, { status: 403 });
    }

    const body = await req.json();
    const { name, username, email, mobile, password } = body;

    if (!name || !username || !email || !mobile || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    const result = await providerService.register({
      name,
      username,
      email,
      mobile,
      password,
    });

    return NextResponse.json(
      { message: result.message },
      {
        status: result.statusCode,
        headers: { 'Access-Control-Allow-Origin': allowedOrigin },
      }
    );
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
