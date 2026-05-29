import type { VercelRequest, VercelResponse } from '@vercel/node';
import { recommendVerses } from '../lib/recommendVerses';

interface RecommendBody {
  category?: string;
  query?: string;
  language: 'ko' | 'zh' | 'en';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
  }

  const body = req.body as RecommendBody;
  const { category, query, language } = body;

  if (!language || (!category && !query?.trim())) {
    return res.status(400).json({ error: 'language and category or query are required' });
  }

  try {
    const references = await recommendVerses({ category, query, language }, apiKey);
    return res.status(200).json({ references });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}
