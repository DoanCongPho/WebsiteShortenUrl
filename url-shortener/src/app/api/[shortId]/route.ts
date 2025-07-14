import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'



export async function GET(req: NextRequest, context: { params: { shortId: string } }) {
  const { shortId } = context.params

  const link = await prisma.shortUrl.findUnique({
    where: { shortId },
  })

  if (!link) {
    return new NextResponse('URL not found', { status: 404 })
  }

  if (link.expiresAt && new Date() > link.expiresAt) {
    return new NextResponse('This URL has expired', { status: 410 })
  }

  return NextResponse.redirect(link.original)
}
