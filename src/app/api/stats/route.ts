import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 60 // Cache for 60 seconds

export async function GET() {
  try {
    const payload = await getPayloadClient()

    const { docs } = await payload.find({
      collection: 'counters',
      where: {
        key: {
          in: ['total-downloads', 'pro-interest'],
        },
      },
      limit: 2,
    })

    const downloads = docs.find(d => d.key === 'total-downloads')?.value ?? 0
    const proInterest = docs.find(d => d.key === 'pro-interest')?.value ?? 0

    return NextResponse.json({ downloads, proInterest })
  } catch {
    return NextResponse.json({ downloads: 0, proInterest: 0 })
  }
}
