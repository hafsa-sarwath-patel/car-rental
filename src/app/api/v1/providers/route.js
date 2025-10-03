import { NextResponse } from 'next/server'
import { providerService } from '@/server/services/providerService'

export async function POST(req) {
  try {
    const body = await req.json()
    const result = await providerService.register(body)

    return NextResponse.json(
      { message: result.message },
      { status: result.statusCode }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const providers = await providerService.list()
    return NextResponse.json(providers, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

