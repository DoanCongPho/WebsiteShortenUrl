import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

interface ShortUrl {
  id: string;
  shortId: string;
  original: string;
  expiresAt: string;
}

export async function DELETE() {
  const now = new Date();

  const { data} = await supabase
    .from('ShortUrl')
    .delete()
    .lt('expiresAt', now) as { data: ShortUrl[] | null };


  return NextResponse.json({ message: `Deleted ${data?.length || 0} expired links` });
}
