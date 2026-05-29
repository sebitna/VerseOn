import { useTranslation } from 'react-i18next';
import type { AppLanguage, ResolvedVerse } from '../types/verse';

interface ShareButtonProps {
  verse: ResolvedVerse;
  language: AppLanguage;
}

export default function ShareButton({ verse, language }: ShareButtonProps) {
  const { t } = useTranslation();
  const appName = t('appName', { lng: language });
  const shareText = `"${verse.text}"\n— ${verse.displayReference}\n\n${appName}`;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: appName, text: shareText });
        return;
      }

      await navigator.clipboard.writeText(shareText);
      alert(t('shareCopied', { lng: language }));
    } catch {
      alert(t('shareFailed', { lng: language }));
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleShare()}
      className="jelly-btn min-h-10 rounded-full px-4 text-sm font-semibold"
    >
      {t('share', { lng: language })}
    </button>
  );
}
