import { notFound, redirect } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'
export default async function RedirectPage({
  params,
}: {
  params: Promise<{ shortId: string }>;
}) {
  const { shortId } = await params;

  const { data: link } = await supabase
    .from('ShortUrl')
    .select('original, expiresAt')
    .eq('shortId', shortId)
    .single()

  if (!link) {
    return notFound();
  }

  const now = new Date();
  const newExpiry = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

  await supabase
    .from('ShortUrl')
    .update({ expiresAt: newExpiry.toISOString() })
    .eq('shortId', shortId)


  redirect(link.original);
}
