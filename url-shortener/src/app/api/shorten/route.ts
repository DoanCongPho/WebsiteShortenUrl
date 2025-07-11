import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { original, expiresIn } = body

  if (!original) {
    return NextResponse.json({ error: 'Missing URL' }, { status: 400 })
  }

  const shortId = Math.random().toString(36).substring(2, 8)

  const expiresAt = expiresIn
    ? new Date(Date.now() + parseInt(expiresIn) * 1000)
    : null

  const created = await prisma.shortUrl.create({
    data: { shortId, original, expiresAt },
  })

  const baseUrl = req.nextUrl.origin
  return NextResponse.json({
    shortUrl: `${baseUrl}/api/${created.shortId}`,
    expiresAt: created.expiresAt,
  })
}
