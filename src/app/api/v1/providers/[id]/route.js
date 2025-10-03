import { NextResponse } from 'next/server'
import { providerService } from '@/server/services/providerService'

export async function GET(_, { params }) {
  try {
    const provider = await providerService.get(params.id)
    if (!provider) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(provider)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req, { params }) {
  try {
    const data = await req.json()
    const updated = await providerService.update(params.id, data)
    return NextResponse.json(updated)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(_, { params }) {
  try {
    await providerService.remove(params.id)
    return NextResponse.json({ message: 'Deleted successfully' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
