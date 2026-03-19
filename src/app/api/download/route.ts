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

function detectPlatform(userAgent: string) {
  if (/Windows/i.test(userAgent)) return 'Windows'
  if (/Mac/i.test(userAgent)) return 'macOS'
  if (/Linux/i.test(userAgent)) return 'Linux'
  return 'Unknown'
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
    const { platform, version } = body as { platform?: string; version?: string }

    if (!platform || !version) {
      return NextResponse.json({ error: 'Missing platform or version' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    // depth: 1 — populate the `file` upload relationship so we get the URL
    const { docs: versions } = await payload.find({
      collection: 'software-versions',
      where: { version: { equals: version }, isActive: { equals: true } },
      limit: 1,
      depth: 1,
    })

    if (!versions.length) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    }

    const sv = versions[0]
    const files = (sv.files as Array<{
      platform: string
      file?: { url?: string; filename?: string } | null
      fileName?: string
    }>) ?? []

    // Match by platform (unique per version)
    const entry = files.find(f => f.platform === platform)
    if (!entry) {
      return NextResponse.json({ error: 'Platform not found in this version' }, { status: 404 })
    }

    // Resolve download URL: uploaded file first, nothing else accepted
    const uploadedUrl = entry.file?.url
    if (!uploadedUrl) {
      return NextResponse.json({ error: 'File not yet uploaded for this platform' }, { status: 404 })
    }

    // Make URL absolute
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const downloadUrl = uploadedUrl.startsWith('http') ? uploadedUrl : `${baseUrl}${uploadedUrl}`

    const fileName = entry.fileName ?? entry.file?.filename ?? platform
    const ip = getIp(request)
    const userAgent = request.headers.get('user-agent') ?? ''

    // Log + increment counter (fire and forget)
    Promise.all([
      payload.create({
        collection: 'download-events',
        data: {
          fileName,
          version,
          ipHash: hashIp(ip),
          userAgent,
          country: getCountry(request),
          platform: detectPlatform(userAgent),
          referrer: request.headers.get('referer') ?? '',
          utmSource: new URL(request.url).searchParams.get('utm_source') ?? '',
          timestamp: new Date().toISOString(),
        },
      }),
      incrementCounter(payload, 'total-downloads'),
    ]).catch(() => {})

    return NextResponse.json({ url: downloadUrl })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
