import type {
  AppLanguage,
  CategoryId,
  VerseRecommendRequest,
  VerseRecommendResponse,
} from '../types/verse';
import { pickRandomSeedReferences } from '../utils/bibleLookup';

const API_URL = '/api/recommend';

async function requestRecommendations(
  body: VerseRecommendRequest,
): Promise<VerseRecommendResponse> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  const data = (await response.json()) as VerseRecommendResponse;
  if (!data.references?.length) {
    throw new Error('Empty references');
  }

  return data;
}

export async function fetchVerseRecommendations(
  categoryId: CategoryId,
  language: AppLanguage,
): Promise<VerseRecommendResponse> {
  try {
    return await requestRecommendations({ category: categoryId, language });
  } catch {
    return { references: pickRandomSeedReferences(categoryId, 3) };
  }
}

export async function fetchVerseByQuery(
  query: string,
  language: AppLanguage,
): Promise<VerseRecommendResponse> {
  try {
    return await requestRecommendations({ query, language });
  } catch {
    return { references: pickRandomSeedReferences('faith', 3) };
  }
}
