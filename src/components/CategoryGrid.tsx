import { useTranslation } from 'react-i18next';
import { CATEGORIES } from '../constants/categories';
import type { AppLanguage, CategoryId } from '../types/verse';

interface CategoryGridProps {
  language: AppLanguage;
  onSelect: (categoryId: CategoryId) => void;
  disabled?: boolean;
}

export default function CategoryGrid({ language, onSelect, disabled }: CategoryGridProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-4 gap-1.5">
      {CATEGORIES.map(({ id, icon }) => (
        <button
          key={id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(id)}
          className="jelly-btn group flex aspect-square flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-1.5 text-center"
        >
          <span className="text-sm leading-none drop-shadow-sm" aria-hidden>
            {icon}
          </span>
          <span className="w-full text-[10px] font-semibold leading-tight">
            {t(`categories.${id}`, { lng: language })}
          </span>
        </button>
      ))}
    </div>
  );
}
