import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function RedirectPage({
  params,
}: {
  params: Promise<{ shortId: string }>;
}) {
  const { shortId } = await params;
  const start = Date.now();
  const link = await prisma.shortUrl.findUnique({
    where: { shortId },
  });

  const duration = Date.now() - start;
  console.log(`⏱️ Prisma query took ${duration}ms`);
  if (!link) {
    return <h1>404 - Short link not found or be expired</h1>;
  }

  const now = new Date();
  const newExpiry = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

  await prisma.shortUrl.update({
    where: { shortId },
    data: { expiresAt: newExpiry },
  });

  redirect(link.original);
}
