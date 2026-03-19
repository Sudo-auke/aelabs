import { type NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { getPayloadClient } from '@/lib/payload'

function hashIp(ip: string) {
  return createHash('sha256').update(ip + (process.env.PAYLOAD_SECRET ?? '')).digest('hex')
}

function getIp(request: NextRequest) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    '127.0.0.1'
  )
}

function getCountry(request: NextRequest) {
  return (
    request.headers.get('cf-ipcountry') ??
    request.headers.get('x-country') ??
    'Unknown'
  )
}

async function incrementCounter(payload: Awaited<ReturnType<typeof getPayloadClient>>, key: string) {
  const { docs } = await payload.find({
    collection: 'counters',
    where: { key: { equals: key } },
    limit: 1,
  })
  if (docs.length > 0) {
    await payload.update({
      collection: 'counters',
      id: docs[0].id,
      data: { value: ((docs[0].value as number) ?? 0) + 1 },
    })
  } else {
    await payload.create({ collection: 'counters', data: { key, value: 1 } })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body as { email?: string }

    const ip = getIp(request)
    const ipHash = hashIp(ip)
    const payload = await getPayloadClient()

    // Check if already voted
    const { docs: existing } = await payload.find({
      collection: 'pro-interest',
      where: { ipHash: { equals: ipHash } },
      limit: 1,
    })

    if (existing.length > 0) {
      return NextResponse.json({ alreadyVoted: true })
    }

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
      }
    }

    // Create entry + increment counter
    await Promise.all([
      payload.create({
        collection: 'pro-interest',
        data: {
          ipHash,
          email: email?.trim().toLowerCase() || undefined,
          userAgent: request.headers.get('user-agent') ?? '',
          country: getCountry(request),
          timestamp: new Date().toISOString(),
        },
      }),
      incrementCounter(payload, 'pro-interest'),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    // Handle unique constraint violation (race condition)
    if (String(err).includes('unique') || String(err).includes('duplicate')) {
      return NextResponse.json({ alreadyVoted: true })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
