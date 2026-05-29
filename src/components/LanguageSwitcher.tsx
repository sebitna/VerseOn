import type { AppLanguage } from '../types/verse';
import { setAppLanguage } from '../i18n';

const LANGUAGES: { code: AppLanguage; label: string }[] = [
  { code: 'ko', label: '한국어' },
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'EN' },
];

interface LanguageSwitcherProps {
  value: AppLanguage;
  onChange: (lang: AppLanguage) => void;
}

export default function LanguageSwitcher({ value, onChange }: LanguageSwitcherProps) {
  const handleChange = (lang: AppLanguage) => {
    if (lang === value) return;
    onChange(lang);
    setAppLanguage(lang);
    document.documentElement.lang = lang;
  };

  return (
    <div className="jelly-track flex gap-1.5 rounded-full p-1">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => handleChange(code)}
          className={`min-h-9 min-w-14 rounded-full px-2.5 text-xs font-semibold transition-all ${
            value === code ? 'jelly-btn jelly-btn-selected' : 'text-rose-900 hover:bg-white/35'
          }`}
          aria-pressed={value === code}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
