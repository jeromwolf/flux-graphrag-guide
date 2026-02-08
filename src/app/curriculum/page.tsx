import Link from 'next/link';
import { curriculumMeta } from '@/data/curriculum-meta';

export const metadata = {
  title: '커리큘럼',
  description: 'Knowledge Graph + GraphRAG 실무 완성 과정 — 7개 Part, 11시간',
};

export default function CurriculumPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{
          background: 'rgba(14,165,233,0.1)',
          border: '1px solid rgba(14,165,233,0.25)',
          color: 'var(--accent-cyan)',
        }}>
          7개 Part · 11시간 · 실무 완성 과정
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 gradient-text" style={{
          fontFamily: 'var(--font-title)',
        }}>
          커리큘럼
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          온톨로지 설계부터 프로덕션 배포까지, 단계별로 학습합니다
        </p>
      </div>

      {/* Difficulty Curve */}
      <div className="mb-16 p-6 rounded-2xl" style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
          난이도 곡선
        </h3>
        <div className="flex items-end gap-2 h-32">
          {curriculumMeta.map((part) => (
            <div key={part.part} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-lg transition-all"
                style={{
                  height: `${part.difficulty * 25}%`,
                  background: `linear-gradient(to top, var(--accent-cyan), var(--accent-blue))`,
                  opacity: 0.5 + part.difficulty * 0.125,
                }}
              />
              <span className="text-[0.65rem] font-mono" style={{ color: 'var(--text-dim)' }}>
                P{part.part}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[0.6rem]" style={{ color: 'var(--text-dim)' }}>
          <span>⭐ 입문</span>
          <span>⭐⭐⭐⭐ 고급</span>
        </div>
      </div>

      {/* Part Cards */}
      <div className="space-y-6">
        {curriculumMeta.map((part) => (
          <Link
            key={part.part}
            href={`/curriculum/part${part.part}`}
            className="block p-6 md:p-8 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 group"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              {/* Part Number */}
              <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-xl font-mono font-bold text-lg text-white" style={{
                background: `linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))`,
              }}>
                {part.part}
              </div>

              <div className="flex-1">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-sm font-mono" style={{ color: 'var(--accent-cyan)' }}>
                    Part {part.part}: {part.subtitle}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--text-dim)' }}>
                    ⏱ {part.duration}
                  </span>
                  <span className="text-sm">
                    {'⭐'.repeat(part.difficulty)}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded" style={{
                    background: '#f1f5f9',
                    color: 'var(--text-secondary)',
                  }}>
                    {part.totalSlides}슬라이드
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold mb-2 group-hover:text-[var(--accent-cyan)] transition-colors">
                  {part.title}
                </h2>

                {/* Description */}
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {part.description}
                </p>

                {/* Milestone */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs" style={{
                  background: 'rgba(14,165,233,0.06)',
                  border: '1px solid rgba(14,165,233,0.15)',
                  color: 'var(--accent-cyan)',
                }}>
                  🏆 {part.milestone}
                </div>

                {/* Sections */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {part.sections.map((sec) => (
                    <span key={sec.id} className="text-xs px-2 py-1 rounded" style={{
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      color: 'var(--text-secondary)',
                    }}>
                      {sec.title} · {sec.time}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
