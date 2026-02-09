'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { curriculumMeta } from '@/data/curriculum-meta';
import { Clock, Signal } from 'lucide-react';

export default function CurriculumLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activePart = pathname.match(/part(\d+)/)?.[1];
  const activePartNum = activePart ? parseInt(activePart) : null;

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r border-slate-200 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto bg-slate-50/80">
        <div className="p-4">
          <div className="mb-6">
            <h2 className="text-sm font-bold mb-1 text-slate-900">
              커리큘럼
            </h2>
            <p className="text-xs text-slate-400">
              7개 Part · 11시간
            </p>
          </div>

          <nav className="space-y-1">
            {curriculumMeta.map((part) => {
              const isActive = activePartNum === part.part;

              return (
                <Link
                  key={part.part}
                  href={`/curriculum/part${part.part}`}
                  className={`block p-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-sky-50 border-l-[3px] border-l-sky-500 pl-[calc(0.75rem-3px)]'
                      : 'border-l-[3px] border-l-transparent hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded font-mono font-bold text-xs ${
                      isActive
                        ? 'bg-gradient-to-br from-sky-500 to-blue-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {part.part}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-semibold mb-1 ${
                        isActive ? 'text-sky-700' : 'text-slate-700'
                      }`}>
                        {part.title}
                      </div>
                      <div className="flex items-center gap-2 text-[0.65rem] text-slate-400">
                        <span className="inline-flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {part.duration}
                        </span>
                        <span className="inline-flex items-center gap-0.5">
                          <Signal className="w-2.5 h-2.5" />
                          Lv.{part.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-30 overflow-x-auto bg-white/95 backdrop-blur-xl border-b border-slate-200">
        <div className="flex px-2 py-2 gap-2">
          {curriculumMeta.map((part) => {
            const isActive = activePartNum === part.part;

            return (
              <Link
                key={part.part}
                href={`/curriculum/part${part.part}`}
                className={`flex-shrink-0 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-sky-50 border-b-2 border-b-sky-500'
                    : 'bg-slate-50 border-b-2 border-b-transparent'
                }`}
              >
                <div className={`text-xs font-semibold whitespace-nowrap ${
                  isActive ? 'text-sky-600' : 'text-slate-500'
                }`}>
                  Part {part.part}
                </div>
                <div className="flex items-center gap-0.5 text-[0.6rem] mt-0.5 text-slate-400">
                  <Signal className="w-2 h-2" />
                  Lv.{part.difficulty}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:mt-0 mt-14">
        {children}
      </main>
    </div>
  );
}
