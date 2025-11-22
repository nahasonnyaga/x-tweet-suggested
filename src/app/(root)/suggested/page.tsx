'use client';
import { useEffect, useState } from 'react';

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  content: string;
}

export default function SuggestedPage() {
  const [items, setItems] = useState<RSSItem[]>([]);

  useEffect(() => {
    fetch('/api/suggested')
      .then(res => res.json())
      .then(setItems);
  }, []);

  return (
    <div>
      <h1>Suggested Content</h1>
      {items.map(item => (
        <div key={item.link} style={{ marginBottom: '1rem' }}>
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            <h2>{item.title}</h2>
          </a>
          <p>{item.content}</p>
        </div>
      ))}
    </div>
  );
}
