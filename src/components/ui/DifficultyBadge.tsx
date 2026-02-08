interface DifficultyBadgeProps {
  level: number;
  showLabel?: boolean;
}

const labels = ['입문', '기초', '중급', '고급', '전문가'];

export function DifficultyBadge({ level, showLabel = false }: DifficultyBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span>{'⭐'.repeat(level)}</span>
      {showLabel && (
        <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
          {labels[level - 1] || ''}
        </span>
      )}
    </span>
  );
}
