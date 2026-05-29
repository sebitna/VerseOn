interface VerseReference {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
}

export interface RecommendOptions {
  language: string;
  category?: string;
  query?: string;
}

const SYSTEM_PROMPT = `You are a Bible verse recommendation assistant.
Return ONLY valid JSON with this exact shape:
{"references":[{"book":"Philippians","chapter":4,"verseStart":6,"verseEnd":7}]}

Rules:
- Recommend 2 to 3 verse references relevant to the user's faith need, question, or situation.
- NEVER include verse text, commentary, or markdown.
- Use English book slugs exactly as stored in a Bible database (examples: Philippians, 1Peter, 1Corinthians, Psalms, 3John).
- chapter, verseStart, verseEnd must be positive integers.
- verseEnd is optional; include it only for consecutive verse ranges.
- Only recommend real Bible references that exist.
- Prefer well-known comforting, guiding, or strengthening passages.`;

const CATEGORY_HINTS: Record<string, string> = {
  faith: 'trust, belief, and growing in faith',
  prayer: 'prayer, intercession, and communion with God',
  worship: 'worship, praise, and reverence for God',
  word: 'Scripture, Bible meditation, and God\'s word',
  grace: 'God\'s grace, mercy, and unmerited favor',
  repentance: 'repentance, confession, and turning from sin',
  holiness: 'holiness, sanctification, and living for God',
  love: 'God\'s love and loving others',
  hope: 'hope, eternal promise, and confident expectation',
  peace: 'peace, rest, and trust in God',
  obedience: 'obedience, following God\'s commands',
  witness: 'evangelism, testimony, and sharing the gospel',
  trial: 'trials, suffering, perseverance through hardship',
  thanksgiving: 'gratitude, thanksgiving, and praise',
  fellowship: 'church community, fellowship, and unity',
  guidance: 'God\'s guidance, direction, and wisdom',
};

const GEMINI_MODEL = 'gemini-2.5-flash';

function buildUserPrompt({ category, query, language }: RecommendOptions): string {
  if (query?.trim()) {
    return `Language context: ${language}.
User message: "${query.trim()}"
Analyze what the user is asking or going through in their faith life, then recommend 3 Bible verse references that speak to their situation.`;
  }

  const hint = category ? (CATEGORY_HINTS[category] ?? category) : 'general faith';
  return `Category: ${category} (${hint}). Language context: ${language}. Recommend 3 verse references suitable for Korean Reformed Bible readers.`;
}

export async function recommendVerses(
  options: RecommendOptions,
  apiKey: string,
): Promise<VerseReference[]> {
  const { category, query, language } = options;

  if (!category && !query?.trim()) {
    throw new Error('category or query is required');
  }

  const userPrompt = buildUserPrompt({ category, query, language });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json',
        },
      }),
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Gemini request failed: ${detail}`);
  }

  const payload = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const content = payload.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error('Empty response from Gemini');
  }

  const parsed = JSON.parse(content) as { references?: VerseReference[] };
  const references = (parsed.references ?? [])
    .filter(
      (ref) =>
        ref.book &&
        Number.isInteger(ref.chapter) &&
        Number.isInteger(ref.verseStart),
    )
    .slice(0, 3);

  if (references.length === 0) {
    throw new Error('No valid references returned');
  }

  return references;
}
