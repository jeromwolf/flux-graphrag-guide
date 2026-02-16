import Link from 'next/link';
import { domainsMeta } from '@/data/domain-meta';
import { Factory, ArrowRight, BookOpen } from 'lucide-react';

const stageColors = ['bg-sky-500', 'bg-blue-500', 'bg-violet-500', 'bg-amber-500'];
const stageTextColors = ['text-sky-600', 'text-blue-600', 'text-violet-600', 'text-amber-600'];
const stageBgColors = ['bg-sky-50', 'bg-blue-50', 'bg-violet-50', 'bg-amber-50'];

export const metadata = {
  title: '케이스 스터디',
  description: '제조 도메인 4단계 확장 실습 — 7노드에서 5K+노드까지 GraphRAG를 체득합니다.',
};

export default function CasesPage() {
  const domain = domainsMeta[0];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black mb-4 gradient-text" style={{ fontFamily: 'var(--font-title)' }}>
          케이스 스터디
        </h1>
        <p className="text-lg text-slate-700">
          제조 도메인 x 4단계 확장 — 7노드에서 5K+노드까지
        </p>
      </div>

      {/* Intro */}
      <div className="p-6 md:p-8 rounded-2xl ring-card bg-white mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Factory className="w-8 h-8 text-sky-500" />
          <div>
            <h2 className="text-2xl font-bold">제조 (Manufacturing)</h2>
            <p className="text-sm text-slate-600">{domain.description}</p>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-slate-50 ring-card mb-6">
          <span className="text-xs font-mono text-sky-600">핵심 질의 ({domain.queryHops}-hop)</span>
          <p className="font-semibold mt-1">&quot;{domain.coreQuery}&quot;</p>
        </div>
        <div className="p-5 rounded-xl bg-sky-50 border border-sky-200">
          <p className="text-sm text-slate-700 leading-relaxed">
            같은 제조 도메인을 <strong className="text-sky-700">4번 반복</strong>하며 점점 확장합니다.
            처음에는 7개 노드로 그래프를 눈으로 확인하고, 마지막에는 5K+ 노드의 프로덕션 시스템을 완성합니다.
          </p>
        </div>
      </div>

      {/* Visual Progression Bar */}
      <div className="mb-12">
        <h2 className="text-lg font-bold mb-4 text-center text-slate-800">노드 확장 흐름</h2>
        <div className="flex items-center justify-center gap-0">
          {domain.stages.map((stage, idx) => (
            <div key={stage.stage} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-bold text-white text-sm ${stageColors[idx]}`}>
                  {stage.nodes}
                </div>
                <span className="text-xs mt-2 text-slate-500 font-medium">{stage.name}</span>
              </div>
              {idx < domain.stages.length - 1 && (
                <ArrowRight className="w-5 h-5 mx-2 md:mx-4 text-slate-300 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {domain.stages.map((stage, idx) => (
          <Link
            key={stage.stage}
            href={`/cases/${domain.id}/stage-${stage.stage}`}
            className="group p-6 rounded-2xl transition-all hover:-translate-y-1 ring-card ring-card-hover bg-white"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-mono px-2.5 py-1 rounded-lg font-bold ${stageBgColors[idx]} ${stageTextColors[idx]}`}>
                  Stage {stage.stage}
                </span>
                <span className={`text-2xl font-black ${stageTextColors[idx]}`}>{stage.name}</span>
              </div>
              <span className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {stage.nodes} 노드
              </span>
            </div>

            <div className="p-3 rounded-lg mb-4 bg-slate-50 ring-card">
              <span className="text-xs text-violet-500 font-medium">마일스톤</span>
              <p className="mt-1 text-sm text-slate-700">{stage.milestone}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{stage.curriculumParts}</span>
              </div>
              <span className="text-xs text-sky-500 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                실습하기 <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
