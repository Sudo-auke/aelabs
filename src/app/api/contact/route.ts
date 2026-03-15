import { type NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation
    const required = ['firstName', 'lastName', 'email', 'message']
    for (const field of required) {
      if (!body[field]?.trim()) {
        return NextResponse.json({ error: `Le champ "${field}" est requis.` }, { status: 400 })
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    await payload.create({
      collection: 'contact-requests',
      data: {
        type: body.type ?? 'info',
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
        email: body.email.trim().toLowerCase(),
        company: body.company?.trim() ?? '',
        message: body.message.trim(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact] error:', err)
    return NextResponse.json({ error: 'Une erreur est survenue. Réessayez plus tard.' }, { status: 500 })
  }
}
