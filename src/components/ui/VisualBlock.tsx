import { Monitor } from 'lucide-react';

interface VisualBlockProps {
  children: React.ReactNode;
}

export function VisualBlock({ children }: VisualBlockProps) {
  return (
    <div className="my-4 p-4 rounded-lg bg-slate-50 border border-dashed border-slate-200">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest mb-2 text-amber-600">
        <Monitor className="w-3.5 h-3.5" />
        화면 구성
      </div>
      <div className="text-base text-slate-600 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
