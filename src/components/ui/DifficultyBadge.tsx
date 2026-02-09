import { Signal } from 'lucide-react';

interface DifficultyBadgeProps {
  level: number;
  showLabel?: boolean;
}

const labels = ['입문', '기초', '중급', '고급', '전문가'];

export function DifficultyBadge({ level, showLabel = false }: DifficultyBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <Signal className="w-3.5 h-3.5 text-sky-500" />
      <span className="font-medium text-slate-700">Lv.{level}</span>
      {showLabel && (
        <span className="text-slate-500">
          {labels[level - 1] || ''}
        </span>
      )}
    </span>
  );
}
