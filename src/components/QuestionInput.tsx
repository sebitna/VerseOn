import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { AppLanguage } from '../types/verse';

interface QuestionInputProps {
  language: AppLanguage;
  onSubmit: (query: string) => void;
  disabled?: boolean;
}

const MIN_HEIGHT = 44;
const MAX_HEIGHT = 160;

export default function QuestionInput({ language, onSubmit, disabled }: QuestionInputProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = `${MIN_HEIGHT}px`;
    const nextHeight = Math.min(Math.max(el.scrollHeight, MIN_HEIGHT), MAX_HEIGHT);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY = el.scrollHeight > MAX_HEIGHT ? 'auto' : 'hidden';
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [query, language, adjustHeight]);

  const handleChange = (value: string) => {
    setQuery(value);
    requestAnimationFrame(adjustHeight);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-5 w-full text-left">
      <label htmlFor="faith-query" className="mb-2 block text-base font-semibold text-rose-950">
        {t('askQuestion', { lng: language })}
      </label>
      <textarea
        ref={textareaRef}
        id="faith-query"
        value={query}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={t('questionPlaceholder', { lng: language })}
        disabled={disabled}
        rows={1}
        maxLength={500}
        style={{ height: `${MIN_HEIGHT}px` }}
        className="w-full resize-none overflow-hidden rounded-2xl border border-rose-200 bg-white px-4 py-2.5 text-left text-sm leading-relaxed text-rose-950 placeholder:text-rose-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-300/60 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={disabled || !query.trim()}
        className="jelly-btn jelly-btn-primary mt-3 min-h-10 w-full rounded-full px-5 text-sm font-semibold disabled:cursor-not-allowed"
      >
        {t('findVerse', { lng: language })}
      </button>
    </form>
  );
}
