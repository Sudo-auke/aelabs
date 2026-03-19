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

// POST: log initial pageview
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, referrer, utmSource, utmMedium, utmCampaign } = body as {
      path?: string
      referrer?: string
      utmSource?: string
      utmMedium?: string
      utmCampaign?: string
    }

    const ip = getIp(request)
    const payload = await getPayloadClient()

    await payload.create({
      collection: 'page-views',
      data: {
        ipHash: hashIp(ip),
        path: path ?? '/',
        referrer: referrer ?? '',
        utmSource: utmSource ?? '',
        utmMedium: utmMedium ?? '',
        utmCampaign: utmCampaign ?? '',
        userAgent: request.headers.get('user-agent') ?? '',
        country:
          request.headers.get('cf-ipcountry') ??
          request.headers.get('x-country') ??
          'Unknown',
        timestamp: new Date().toISOString(),
      },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}

// PATCH: update scroll/time on existing session (beacon)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, timeOnPage, scrollDepth } = body as {
      path?: string
      timeOnPage?: number
      scrollDepth?: number
    }

    // Find the most recent pageview for this session (same IP + path, last 30min)
    const ip = getIp(request)
    const ipHash = createHash('sha256').update(ip + (process.env.PAYLOAD_SECRET ?? '')).digest('hex')
    const payload = await getPayloadClient()

    const since = new Date(Date.now() - 30 * 60 * 1000).toISOString()
    const { docs } = await payload.find({
      collection: 'page-views',
      where: {
        and: [
          { ipHash: { equals: ipHash } },
          { path: { equals: path ?? '/' } },
          { timestamp: { greater_than: since } },
        ],
      },
      sort: '-timestamp',
      limit: 1,
    })

    if (docs.length > 0) {
      await payload.update({
        collection: 'page-views',
        id: docs[0].id,
        data: {
          scrollDepth: scrollDepth ?? (docs[0].scrollDepth as number),
          timeOnPage: timeOnPage ?? (docs[0].timeOnPage as number),
        },
      })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
