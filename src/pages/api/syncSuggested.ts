import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Optional: Accept tweet IDs or payload
    const { tweetId } = req.body;

    // 1. Fetch new tweets from main X-Tweet Supabase table
    let query = supabase.from('tweets').select('*').order('created_at', { ascending: false });
    if (tweetId) query = query.eq('id', tweetId);

    const { data: tweets, error } = await query;

    if (error) throw error;

    // 2. Extract hashtags, keywords, or trending topics
    const suggestedItems = tweets?.map(tweet => ({
      tweet_id: tweet.id,
      content: tweet.text,
      hashtags: tweet.hashtags || [],
      created_at: tweet.created_at,
    })) || [];

    if (suggestedItems.length === 0) {
      return res.status(200).json({ message: 'No new tweets to sync' });
    }

    // 3. Upsert into suggested content table
    const { error: upsertError } = await supabase
      .from('suggested_content')
      .upsert(suggestedItems, { onConflict: ['tweet_id'] });

    if (upsertError) throw upsertError;

    res.status(200).json({ message: 'Suggested content synced successfully', count: suggestedItems.length });
  } catch (err: any) {
    console.error('Sync error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
