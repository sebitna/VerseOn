import { useCallback, useEffect, useState } from 'react';
import { fetchVerseByQuery, fetchVerseRecommendations } from '../api/verse';
import type { AppLanguage, CategoryId, ResolvedVerse, VerseReference } from '../types/verse';
import { pickRandomSeedReferences, resolveReferences } from '../utils/bibleLookup';

const DEFAULT_FALLBACK: CategoryId = 'faith';

export function useVerseRecommend(language: AppLanguage) {
  const [verses, setVerses] = useState<ResolvedVerse[]>([]);
  const [storedRefs, setStoredRefs] = useState<VerseReference[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [activeQuery, setActiveQuery] = useState<string | null>(null);

  const fallbackCategory = activeCategory ?? DEFAULT_FALLBACK;

  useEffect(() => {
    if (storedRefs.length === 0) return;

    const resolved = resolveReferences(storedRefs, language, fallbackCategory);
    if (resolved.length > 0) {
      setVerses(resolved);
    }
  }, [language, storedRefs, fallbackCategory]);

  const applyReferences = useCallback(
    (refs: VerseReference[], categoryForFallback: CategoryId) => {
      setStoredRefs(refs);
      const resolved = resolveReferences(refs, language, categoryForFallback);
      if (resolved.length === 0) {
        throw new Error('No verses resolved');
      }
      setVerses(resolved);
    },
    [language],
  );

  const loadVerses = useCallback(
    async (categoryId: CategoryId, useRandomSeed = false) => {
      setIsLoading(true);
      setError(null);
      setActiveCategory(categoryId);
      setActiveQuery(null);

      try {
        const refs = useRandomSeed
          ? pickRandomSeedReferences(categoryId, 3)
          : (await fetchVerseRecommendations(categoryId, language)).references;

        applyReferences(refs, categoryId);
      } catch {
        const fallbackRefs = pickRandomSeedReferences(categoryId, 3);
        const fallback = resolveReferences(fallbackRefs, language, categoryId);
        if (fallback.length === 0) {
          setError('errorGeneric');
          setVerses([]);
          setStoredRefs([]);
        } else {
          setStoredRefs(fallbackRefs);
          setVerses(fallback);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [applyReferences, language],
  );

  const loadVersesByQuery = useCallback(
    async (query: string, useRandomSeed = false) => {
      const trimmed = query.trim();
      if (!trimmed) {
        setError('errorEmptyQuery');
        return;
      }

      setIsLoading(true);
      setError(null);
      setActiveCategory(null);
      setActiveQuery(trimmed);

      try {
        const refs = useRandomSeed
          ? pickRandomSeedReferences(DEFAULT_FALLBACK, 3)
          : (await fetchVerseByQuery(trimmed, language)).references;

        applyReferences(refs, DEFAULT_FALLBACK);
      } catch {
        const fallbackRefs = pickRandomSeedReferences(DEFAULT_FALLBACK, 3);
        const fallback = resolveReferences(fallbackRefs, language, DEFAULT_FALLBACK);
        if (fallback.length === 0) {
          setError('errorGeneric');
          setVerses([]);
          setStoredRefs([]);
        } else {
          setStoredRefs(fallbackRefs);
          setVerses(fallback);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [applyReferences, language],
  );

  const reload = useCallback(
    (useRandomSeed = false) => {
      if (activeQuery) {
        void loadVersesByQuery(activeQuery, useRandomSeed);
        return;
      }
      if (activeCategory) {
        void loadVerses(activeCategory, useRandomSeed);
      }
    },
    [activeCategory, activeQuery, loadVerses, loadVersesByQuery],
  );

  const reset = useCallback(() => {
    setVerses([]);
    setStoredRefs([]);
    setError(null);
    setActiveCategory(null);
    setActiveQuery(null);
  }, []);

  return {
    verses,
    isLoading,
    error,
    activeCategory,
    activeQuery,
    loadVerses,
    loadVersesByQuery,
    reload,
    reset,
  };
}
