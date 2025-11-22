import Parser from 'rss-parser';
import { supabase } from './supabase';

const parser = new Parser();

export async function fetchRSSFeed(url: string) {
  const feed = await parser.parseURL(url);
  const items = feed.items.map(item => ({
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
    content: item.contentSnippet || item.content,
  }));

  await supabase.from('rss_items').upsert(items, { onConflict: ['link'] });

  return items;
}
