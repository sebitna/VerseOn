import { useTranslation } from 'react-i18next';
import type { AppLanguage } from '../types/verse';

interface LoadingStateProps {
  language: AppLanguage;
}

export default function LoadingState({ language }: LoadingStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-4 py-10 text-rose-900">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-200 border-t-rose-700" />
      <p className="animate-pulse text-base font-medium">{t('loading', { lng: language })}</p>
      <div className="mt-4 w-full max-w-sm space-y-3">
        <div className="h-20 animate-pulse rounded-2xl bg-white/70" />
        <div className="h-20 animate-pulse rounded-2xl bg-white/50" />
      </div>
    </div>
  );
}
