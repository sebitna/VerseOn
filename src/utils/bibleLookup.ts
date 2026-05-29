import categorySeeds from '../data/bible/category-seeds.json';
import enWeb from '../data/bible/en-web.json';
import koRevised from '../data/bible/ko-revised.json';
import zhCuv from '../data/bible/zh-cuv.json';
import type { AppLanguage, CategoryId, ResolvedVerse, VerseReference } from '../types/verse';
import { formatReference } from './bookMapping';

type BibleData = Record<string, Record<string, Record<string, string>>>;

const BIBLE_BY_LANG: Record<AppLanguage, BibleData> = {
  ko: koRevised,
  zh: zhCuv,
  en: enWeb,
};

function getVerseText(
  data: BibleData,
  book: string,
  chapter: number,
  verse: number,
): string | null {
  return data[book]?.[String(chapter)]?.[String(verse)] ?? null;
}

function lookupSingleReference(
  ref: VerseReference,
  lang: AppLanguage,
): ResolvedVerse | null {
  const data = BIBLE_BY_LANG[lang];
  const end = ref.verseEnd ?? ref.verseStart;
  const verses: string[] = [];

  for (let v = ref.verseStart; v <= end; v += 1) {
    const text = getVerseText(data, ref.book, ref.chapter, v);
    if (!text) return null;
    verses.push(text);
  }

  return {
    reference: ref,
    text: verses.join(' '),
    displayReference: formatReference(
      ref.book,
      ref.chapter,
      ref.verseStart,
      ref.verseEnd,
      lang,
    ),
  };
}

export function getSeedReferences(categoryId: CategoryId): VerseReference[] {
  return categorySeeds[categoryId] ?? [];
}

export function resolveReferences(
  refs: VerseReference[],
  lang: AppLanguage,
  categoryId?: CategoryId,
): ResolvedVerse[] {
  const resolved: ResolvedVerse[] = [];

  for (const ref of refs) {
    const verse = lookupSingleReference(ref, lang);
    if (verse) resolved.push(verse);
  }

  if (resolved.length > 0) return resolved.slice(0, 3);

  if (categoryId) {
    const seeds = getSeedReferences(categoryId);
    for (const ref of seeds) {
      const verse = lookupSingleReference(ref, lang);
      if (verse) resolved.push(verse);
      if (resolved.length >= 3) break;
    }
  }

  return resolved;
}

export function pickRandomSeedReferences(
  categoryId: CategoryId,
  count = 3,
): VerseReference[] {
  const seeds = [...getSeedReferences(categoryId)];
  seeds.sort(() => Math.random() - 0.5);
  return seeds.slice(0, count);
}
