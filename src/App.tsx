import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CategoryGrid from './components/CategoryGrid';
import LanguageSwitcher from './components/LanguageSwitcher';
import LoadingState from './components/LoadingState';
import QuestionInput from './components/QuestionInput';
import ShareButton from './components/ShareButton';
import VerseCard from './components/VerseCard';
import { useVerseRecommend } from './hooks/useVerseRecommend';
import type { AppLanguage, CategoryId } from './types/verse';

export default function App() {
  const { t } = useTranslation();
  const [language, setLanguage] = useState<AppLanguage>('ko');
  const [cardIndex, setCardIndex] = useState(0);
  const {
    verses,
    isLoading,
    error,
    activeQuery,
    loadVerses,
    loadVersesByQuery,
    reload,
    reset,
  } = useVerseRecommend(language);

  const handleLanguageChange = useCallback((lang: AppLanguage) => {
    setLanguage(lang);
  }, []);

  const handleCategorySelect = (categoryId: CategoryId) => {
    setCardIndex(0);
    void loadVerses(categoryId);
  };

  const handleQuerySubmit = (query: string) => {
    setCardIndex(0);
    void loadVersesByQuery(query);
  };

  const handleAnotherVerse = () => {
    setCardIndex(0);
    reload(true);
  };

  const showResults = verses.length > 0 && !isLoading;
  const safeCardIndex = Math.min(cardIndex, Math.max(verses.length - 1, 0));
  const currentVerse = verses[safeCardIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-pink-100 to-rose-100 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-6">
        <header className="mb-5 flex flex-col items-center gap-3 text-center text-rose-950">
          <LanguageSwitcher value={language} onChange={handleLanguageChange} />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('appName', { lng: language })}
            </h1>
          </div>
        </header>

        {isLoading && <LoadingState language={language} />}

        {!isLoading && !showResults && (
          <section className="animate-[fadeIn_0.4s_ease-out] text-center">
            <QuestionInput
              language={language}
              onSubmit={handleQuerySubmit}
              disabled={isLoading}
            />

            <p className="mb-3 text-xs text-rose-800/80">{t('orSelectCategory', { lng: language })}</p>

            <CategoryGrid
              language={language}
              onSelect={handleCategorySelect}
              disabled={isLoading}
            />
          </section>
        )}

        {!isLoading && error && (
          <div className="mt-6 rounded-2xl bg-red-500/90 px-4 py-3 text-center text-white">
            {t(error, { lng: language })}
          </div>
        )}

        {showResults && currentVerse && (
          <section className="animate-[fadeIn_0.4s_ease-out] flex flex-1 flex-col text-center">
            {activeQuery && (
              <p className="mb-4 rounded-2xl border border-rose-200 bg-white/85 px-4 py-3 text-left text-sm leading-relaxed text-rose-900">
                {t('yourQuestion', { lng: language })}: {activeQuery}
              </p>
            )}

            <VerseCard
              verse={currentVerse}
              label={t('verseOf', {
                lng: language,
                current: safeCardIndex + 1,
                total: verses.length,
              })}
            />

            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={safeCardIndex === 0}
                onClick={() => setCardIndex((i) => Math.max(0, i - 1))}
                className="jelly-btn min-h-10 min-w-10 rounded-full text-base font-bold disabled:opacity-40"
                aria-label="Previous verse"
              >
                ‹
              </button>
              <div className="flex gap-2">
                {verses.map((verse, i) => (
                  <span
                    key={verse.displayReference}
                    className={`h-2 w-2 rounded-full ${i === safeCardIndex ? 'bg-rose-600' : 'bg-rose-300'}`}
                  />
                ))}
              </div>
              <button
                type="button"
                disabled={safeCardIndex >= verses.length - 1}
                onClick={() => setCardIndex((i) => Math.min(verses.length - 1, i + 1))}
                className="jelly-btn min-h-10 min-w-10 rounded-full text-base font-bold disabled:opacity-40"
                aria-label="Next verse"
              >
                ›
              </button>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={reset}
                className="jelly-btn jelly-btn-primary min-h-10 rounded-full px-5 text-sm font-semibold"
              >
                {t('backToHome', { lng: language })}
              </button>
              <button
                type="button"
                onClick={handleAnotherVerse}
                className="jelly-btn min-h-10 rounded-full px-5 text-sm font-semibold"
              >
                {t('anotherVerse', { lng: language })}
              </button>
              <ShareButton verse={currentVerse} language={language} />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
