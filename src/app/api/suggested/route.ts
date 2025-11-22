import type { NextRequest } from 'next/server';
import { supabase } from '@lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('suggested_content')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
