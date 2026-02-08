'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { curriculumMeta } from '@/data/curriculum-meta';

export default function CurriculumLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Detect active part from pathname like /curriculum/part3
  const activePart = pathname.match(/part(\d+)/)?.[1];
  const activePartNum = activePart ? parseInt(activePart) : null;

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto" style={{
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
      }}>
        <div className="p-4">
          <div className="mb-6">
            <h2 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              커리큘럼
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
              7개 Part · 11시간
            </p>
          </div>

          <nav className="space-y-2">
            {curriculumMeta.map((part) => {
              const isActive = activePartNum === part.part;

              return (
                <Link
                  key={part.part}
                  href={`/curriculum/part${part.part}`}
                  className="block p-3 rounded-lg transition-all"
                  style={{
                    background: isActive ? 'rgba(14,165,233,0.05)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--accent-cyan)' : '3px solid transparent',
                    paddingLeft: isActive ? 'calc(0.75rem - 3px)' : '0.75rem',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded font-mono font-bold text-xs" style={{
                      background: isActive
                        ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))'
                        : '#e2e8f0',
                      color: isActive ? '#ffffff' : '#475569',
                    }}>
                      {part.part}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold mb-1" style={{
                        color: isActive ? 'var(--accent-cyan)' : 'var(--text-primary)',
                      }}>
                        {part.title}
                      </div>
                      <div className="flex items-center gap-2 text-[0.65rem]" style={{ color: 'var(--text-dim)' }}>
                        <span>⏱ {part.duration}</span>
                        <span>{'⭐'.repeat(part.difficulty)}</span>
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
      <div className="lg:hidden fixed top-16 left-0 right-0 z-30 overflow-x-auto" style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="flex px-2 py-2 gap-2">
          {curriculumMeta.map((part) => {
            const isActive = activePartNum === part.part;

            return (
              <Link
                key={part.part}
                href={`/curriculum/part${part.part}`}
                className="flex-shrink-0 px-3 py-2 rounded-lg transition-all"
                style={{
                  background: isActive ? 'rgba(14,165,233,0.1)' : 'rgba(0,0,0,0.02)',
                  borderBottom: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                }}
              >
                <div className="text-xs font-semibold whitespace-nowrap" style={{
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                }}>
                  Part {part.part}
                </div>
                <div className="text-[0.6rem] mt-0.5" style={{ color: 'var(--text-dim)' }}>
                  {'⭐'.repeat(part.difficulty)}
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
