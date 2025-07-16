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
    return <h1>404 - Short link not found</h1>;
  }

  if (link.expiresAt && new Date() > new Date(link.expiresAt)) {
    return <h1>Link expired</h1>;
  }

  redirect(link.original);
}
