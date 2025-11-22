import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@lib/supabase";

// Define allowed event types
type EventType =
  | "HASHTAGS"
  | "MENTIONS"
  | "SUGGESTED"
  | "TRENDING"
  | "SEARCH"
  | "MEDIA"
  | "VIDEOS"
  | "PROFILES"
  | "PAYMENTS"
  | "AI";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { eventType, payload } = req.body as { eventType: EventType; payload: any };

  try {
    switch (eventType) {
      case "HASHTAGS":
        await supabase.from("hashtags").upsert(payload);
        break;
      case "MENTIONS":
        await supabase.from("mentions").upsert(payload);
        break;
      case "SUGGESTED":
        await supabase.from("suggested").upsert(payload);
        break;
      case "TRENDING":
        await supabase.from("trending").upsert(payload);
        break;
      case "SEARCH":
        await supabase.from("searchIndex").upsert(payload);
        break;
      case "MEDIA":
        await supabase.from("media").upsert(payload);
        break;
      case "VIDEOS":
        await supabase.from("videos").upsert(payload);
        break;
      case "PROFILES":
        await supabase.from("profiles").upsert(payload);
        break;
      case "PAYMENTS":
        await supabase.from("payments").upsert(payload);
        break;
      case "AI":
        await supabase.from("aiResults").upsert(payload);
        break;
      default:
        return res.status(400).json({ error: "Unknown event type" });
    }

    res.status(200).json({ status: "success", eventType });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
