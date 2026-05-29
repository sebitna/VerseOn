export type AppLanguage = 'ko' | 'zh' | 'en';

export type CategoryId =
  | 'faith'
  | 'prayer'
  | 'worship'
  | 'word'
  | 'grace'
  | 'repentance'
  | 'holiness'
  | 'love'
  | 'hope'
  | 'peace'
  | 'obedience'
  | 'witness'
  | 'trial'
  | 'thanksgiving'
  | 'fellowship'
  | 'guidance';

export interface VerseReference {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
}

export interface VerseRecommendRequest {
  language: AppLanguage;
  category?: CategoryId;
  query?: string;
}

export interface VerseRecommendResponse {
  references: VerseReference[];
}

export interface ResolvedVerse {
  reference: VerseReference;
  text: string;
  displayReference: string;
}

export interface CategoryItem {
  id: CategoryId;
  icon: string;
}
