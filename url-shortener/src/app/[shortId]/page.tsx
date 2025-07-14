import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

type Props = {
  params: { shortId: string }
}

export default async function RedirectPage({ params }: Props) {
  const { shortId } = params

  const link = await prisma.shortUrl.findUnique({
    where: { shortId },
  })

  if (!link) {
    return <h1>404 - Short link not found</h1>
  }

  if (link.expiresAt && new Date() > new Date(link.expiresAt)) {
    return <h1>Link expired</h1>
  }

  redirect(link.original)
}
