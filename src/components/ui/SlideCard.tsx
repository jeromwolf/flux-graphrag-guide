import { BookOpen, Wrench, CircleDot, MessageSquare } from 'lucide-react';
import { tagStyles, type SlideTag } from '@/data/theme';

const tagIcons: Record<SlideTag, React.ReactNode> = {
  theory: <BookOpen className="w-3.5 h-3.5" />,
  demo: <CircleDot className="w-3.5 h-3.5" />,
  practice: <Wrench className="w-3.5 h-3.5" />,
  discussion: <MessageSquare className="w-3.5 h-3.5" />,
};

interface SlideCardProps {
  id: string;
  tag: SlideTag;
  title: string;
  children: React.ReactNode;
}

export function SlideCard({ id, tag, title, children }: SlideCardProps) {
  const style = tagStyles[tag];
  return (
    <div id={id} className="mb-8 p-6 md:p-8 rounded-2xl ring-card transition-colors">
      <span
        className="inline-flex items-center gap-1.5 font-mono text-sm font-medium px-2.5 py-1 rounded-md mb-4 tracking-wide"
        style={{ background: style.bg, color: style.color }}
      >
        {tagIcons[tag]}
        {style.label}
      </span>
      <h3 className="text-xl font-bold mb-4 leading-snug text-slate-900">
        {title}
      </h3>
      {children}
    </div>
  );
}
