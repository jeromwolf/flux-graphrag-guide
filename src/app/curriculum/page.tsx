import Link from 'next/link';
import { curriculumMeta } from '@/data/curriculum-meta';
import { Trophy, Clock, Signal } from 'lucide-react';

export const metadata = {
  title: '커리큘럼',
  description: 'Knowledge Graph + GraphRAG 실무 완성 과정 — 7개 Part, 11시간',
};

export default function CurriculumPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 bg-sky-50 border border-sky-200 text-sky-600">
          7개 Part · 11시간 · 실무 완성 과정
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 gradient-text" style={{ fontFamily: 'var(--font-title)' }}>
          커리큘럼
        </h1>
        <p className="text-lg text-slate-700">
          온톨로지 설계부터 프로덕션 배포까지, 단계별로 학습합니다
        </p>
      </div>

      {/* Difficulty Curve */}
      <div className="mb-16 p-6 rounded-2xl bg-white ring-card">
        <h3 className="text-sm font-semibold mb-4 text-slate-700">
          난이도 곡선
        </h3>
        <div className="flex items-end gap-2 h-32">
          {curriculumMeta.map((part) => (
            <div key={part.part} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-lg transition-all bg-gradient-to-t from-sky-500 to-blue-500"
                style={{
                  height: `${part.difficulty * 25}%`,
                  opacity: 0.5 + part.difficulty * 0.125,
                }}
              />
              <span className="text-[0.65rem] font-mono text-slate-400">
                P{part.part}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[0.6rem] text-slate-400">
          <span>Lv.1 입문</span>
          <span>Lv.4 고급</span>
        </div>
      </div>

      {/* Part Cards */}
      <div className="space-y-6">
        {curriculumMeta.map((part) => (
          <Link
            key={part.part}
            href={`/curriculum/part${part.part}`}
            className="block p-6 md:p-8 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 group ring-card ring-card-hover bg-white"
          >
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              {/* Part Number */}
              <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-xl font-mono font-bold text-lg text-white bg-gradient-to-br from-sky-500 to-blue-500">
                {part.part}
              </div>

              <div className="flex-1">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-sm font-mono text-sky-600">
                    Part {part.part}: {part.subtitle}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {part.duration}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-slate-500">
                    <Signal className="w-3.5 h-3.5" />
                    Lv.{part.difficulty}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {part.totalSlides}슬라이드
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold mb-2 group-hover:text-sky-600 transition-colors">
                  {part.title}
                </h2>

                {/* Description */}
                <p className="text-sm mb-3 text-slate-700">
                  {part.description}
                </p>

                {/* Milestone */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-sky-50 border border-sky-100 text-sky-600">
                  <Trophy className="w-3.5 h-3.5" />
                  {part.milestone}
                </div>

                {/* Sections */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {part.sections.map((sec) => (
                    <span key={sec.id} className="text-xs px-2 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700">
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
