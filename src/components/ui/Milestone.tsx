import { Trophy } from 'lucide-react';

interface MilestoneProps {
  title: string;
  children: React.ReactNode;
}

export function Milestone({ title, children }: MilestoneProps) {
  return (
    <div className="my-8 p-6 md:p-8 rounded-2xl text-center bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200">
      <Trophy className="w-8 h-8 text-sky-500 mx-auto mb-3" />
      <h3 className="text-xl font-bold mb-3 text-sky-600">
        {title}
      </h3>
      <div className="text-sm text-slate-600 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
