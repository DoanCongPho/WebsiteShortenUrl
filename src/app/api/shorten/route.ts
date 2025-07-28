import { supabase } from '@/lib/supabaseClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const start = Date.now()
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
    finalExpiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 48 hours
  }

  // Check if shortId already exists (Supabase doesn't throw like Prisma)
  const { data: existing, error: checkError } = await supabase
    .from('ShortUrl')
    .select('shortId')
    .eq('shortId', finalShortId)
    .single()

  if (checkError) {
    console.log('Check error :', checkError)
  }

  if (existing) {
    return NextResponse.json({ error: 'Short ID already exists' }, { status: 400 })
  }

  // Insert new short URL
  const { data: created, error: insertError } = await supabase
    .from('ShortUrl')
    .insert([
      {
        shortId: finalShortId,
        original,
        expiresAt: finalExpiresAt.toISOString(),
      },
    ])
    .select()
    .single()



  
  const duration = Date.now() - start
  console.log(`⏱️ Supabase query took ${duration}ms`)

  if (insertError || !created) {
    console.error(insertError)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  const baseUrl = req.nextUrl.origin

  return NextResponse.json({
    shortId: created.shortId,
    shortUrl: `${baseUrl}/${created.shortId}`,
    expiresAt: created.expiresAt,
  })
}
