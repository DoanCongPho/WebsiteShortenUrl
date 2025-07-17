import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const start = Date.now(); 
  const { original, shortId, expiresAt } = body

  if (!original) {
    return NextResponse.json({ error: 'Missing URL' }, { status: 400 })
  }


  const finalShortId = shortId || Math.random().toString(36).substring(2, 8)

  let finalExpiresAt: Date
  if (expiresAt) {
    const parsedDate = new Date(expiresAt)
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: 'Invalid expiration date' }, { status: 400 })
    }
    finalExpiresAt = parsedDate
  } else {
    // ✅ Default to 48 hours from now
    finalExpiresAt = new Date(Date.now() +  2* 24 * 60 * 60 * 1000)
  }

  try {
    const created = await prisma.shortUrl.create({
      data: {
        shortId: finalShortId,
        original,
        expiresAt: finalExpiresAt,
      },
    })


    const baseUrl = req.nextUrl.origin

    const duration = Date.now() - start; 
   console.log(`⏱️ Prisma query took ${duration}ms`);
    return NextResponse.json({
      shortId: created.shortId,
      shortUrl: `${baseUrl}/${created.shortId}`,
      expiresAt: created.expiresAt,
    })
  } catch (err: unknown) {
    const error = err as { code?: string }

    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Short ID already exists' }, { status: 400 })
    }

    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
  
  
}