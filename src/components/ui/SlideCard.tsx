import { tagStyles, type SlideTag } from '@/data/theme';

interface SlideCardProps {
  id: string;
  tag: SlideTag;
  title: string;
  children: React.ReactNode;
}

export function SlideCard({ id, tag, title, children }: SlideCardProps) {
  const style = tagStyles[tag];
  return (
    <div id={id} className="mb-8 p-6 md:p-8 rounded-2xl transition-colors" style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
    }}>
      <span className="inline-flex items-center gap-1 font-mono text-xs font-medium px-2.5 py-1 rounded-md mb-4 tracking-wide" style={{
        background: style.bg,
        color: style.color,
      }}>
        {style.label}
      </span>
      <h3 className="text-lg font-bold mb-4 leading-snug" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}
