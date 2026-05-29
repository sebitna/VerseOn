import type { ResolvedVerse } from '../types/verse';

interface VerseCardProps {
  verse: ResolvedVerse;
  label: string;
}

export default function VerseCard({ verse, label }: VerseCardProps) {
  return (
    <article className="flex min-h-[18rem] w-full flex-col justify-between rounded-3xl bg-white/95 p-6 text-left shadow-xl shadow-rose-200/40">
      <div>
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-rose-500">
          {label}
        </p>
        <p className="text-lg leading-relaxed text-rose-950">{verse.text}</p>
      </div>
      <p className="mt-6 text-sm font-semibold text-rose-700">{verse.displayReference}</p>
    </article>
  );
}
