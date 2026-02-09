import { Mic } from 'lucide-react';

interface ScriptBlockProps {
  children: React.ReactNode;
}

export function ScriptBlock({ children }: ScriptBlockProps) {
  return (
    <div className="relative my-4 py-5 px-6 rounded-r-xl text-base leading-loose bg-gradient-to-br from-sky-50/60 to-blue-50/40 border-l-[3px] border-l-sky-500 text-slate-800">
      <span className="absolute -top-2.5 left-3 inline-flex items-center gap-1 text-xs font-semibold px-2 tracking-wider rounded bg-white text-sky-500">
        <Mic className="w-3 h-3" />
        대본
      </span>
      {children}
    </div>
  );
}
