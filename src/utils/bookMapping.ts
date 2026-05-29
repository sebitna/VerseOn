import type { AppLanguage } from '../types/verse';

export const BOOK_DISPLAY_NAMES: Record<string, Record<AppLanguage, string>> = {
  Philippians: { ko: '빌립보서', zh: '腓立比书', en: 'Philippians' },
  Matthew: { ko: '마태복음', zh: '马太福音', en: 'Matthew' },
  '1Peter': { ko: '베드로전서', zh: '彼得前书', en: '1 Peter' },
  Psalms: { ko: '시편', zh: '诗篇', en: 'Psalms' },
  '1Corinthians': { ko: '고린도전서', zh: '哥林多前书', en: '1 Corinthians' },
  Colossians: { ko: '골로새서', zh: '歌罗西书', en: 'Colossians' },
  Ephesians: { ko: '에베소서', zh: '以弗所书', en: 'Ephesians' },
  Proverbs: { ko: '잠언', zh: '箴言', en: 'Proverbs' },
  Ecclesiastes: { ko: '전도서', zh: '传道书', en: 'Ecclesiastes' },
  Revelation: { ko: '요한계시록', zh: '启示录', en: 'Revelation' },
  Isaiah: { ko: '이사야', zh: '以赛亚书', en: 'Isaiah' },
  Joshua: { ko: '여호수아', zh: '约书亚记', en: 'Joshua' },
  Deuteronomy: { ko: '신명기', zh: '申命记', en: 'Deuteronomy' },
  Hebrews: { ko: '히브리서', zh: '希伯来书', en: 'Hebrews' },
  Jeremiah: { ko: '예레미야', zh: '耶利米书', en: 'Jeremiah' },
  Romans: { ko: '로마서', zh: '罗马书', en: 'Romans' },
  Mark: { ko: '마가복음', zh: '马可福音', en: 'Mark' },
  James: { ko: '야고보서', zh: '雅各书', en: 'James' },
  John: { ko: '요한복음', zh: '约翰福音', en: 'John' },
  '1John': { ko: '요한일서', zh: '约翰一书', en: '1 John' },
  Acts: { ko: '사도행전', zh: '使徒行传', en: 'Acts' },
  '1Thessalonians': { ko: '데살로니가전서', zh: '帖撒罗尼迦前书', en: '1 Thessalonians' },
  '3John': { ko: '요한삼서', zh: '约翰三书', en: '3 John' },
};

export function formatReference(
  book: string,
  chapter: number,
  verseStart: number,
  verseEnd: number | undefined,
  lang: AppLanguage,
): string {
  const bookName = BOOK_DISPLAY_NAMES[book]?.[lang] ?? book;
  const versePart =
    verseEnd && verseEnd !== verseStart ? `${verseStart}-${verseEnd}` : `${verseStart}`;
  return `${bookName} ${chapter}:${versePart}`;
}
