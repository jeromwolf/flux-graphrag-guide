import { notFound } from 'next/navigation';
import Link from 'next/link';
import { domainsMeta } from '@/data/domain-meta';
import { Factory, ArrowLeft, ArrowRight, Repeat } from 'lucide-react';

const stageColors = ['bg-sky-500', 'bg-blue-500', 'bg-violet-500', 'bg-amber-500'];
const stageTextColors = ['text-sky-600', 'text-blue-600', 'text-violet-600', 'text-amber-600'];
const stageBgColors = ['bg-sky-50', 'bg-blue-50', 'bg-violet-50', 'bg-amber-50'];
const stageBorderColors = ['border-sky-200', 'border-blue-200', 'border-violet-200', 'border-amber-200'];

export async function generateStaticParams() {
  return domainsMeta.map((d) => ({ domain: d.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }) {
  const { domain: domainId } = await params;
  const domain = domainsMeta.find((d) => d.id === domainId);
  if (!domain) return { title: 'Domain Not Found' };
  return {
    title: `${domain.name} (${domain.nameEn}) | GraphRAG Guide`,
    description: domain.description,
  };
}

export default async function DomainPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain: domainId } = await params;
  const domain = domainsMeta.find((d) => d.id === domainId);
  if (!domain) notFound();

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Back Link */}
      <Link href="/cases" className="inline-flex items-center gap-2 mb-8 text-sm text-sky-500 hover:gap-3 transition-all">
        <ArrowLeft className="w-4 h-4" />
        <span>케이스 스터디로 돌아가기</span>
      </Link>

      {/* Hero */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <Factory className="w-12 h-12 text-sky-500" />
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-2 gradient-text" style={{ fontFamily: 'var(--font-title)' }}>
              {domain.name} ({domain.nameEn})
            </h1>
            <p className="text-lg text-slate-700">{domain.description}</p>
          </div>
        </div>

        {/* Core Query */}
        <div className="p-6 rounded-xl mb-6 bg-white border border-sky-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono px-2 py-1 rounded bg-sky-50 text-sky-600">
              핵심 질의 ({domain.queryHops}-hop)
            </span>
            <span className="text-xs px-2 py-1 rounded bg-violet-50 text-violet-600">
              난이도 {domain.difficulty}/5
            </span>
          </div>
          <p className="text-xl font-semibold">&quot;{domain.coreQuery}&quot;</p>
        </div>

        {/* Scenario */}
        <div className="p-6 rounded-xl bg-slate-50 ring-card">
          <h3 className="text-sm font-mono mb-2 text-blue-500">시나리오</h3>
          <p className="text-slate-600">{domain.scenario}</p>
        </div>
      </div>

      {/* Why 4 Stages? */}
      <div className="mb-12 p-6 md:p-8 rounded-2xl bg-sky-50 border border-sky-200">
        <div className="flex items-center gap-3 mb-4">
          <Repeat className="w-6 h-6 text-sky-600" />
          <h2 className="text-2xl font-bold text-sky-800">왜 4단계로 나눴나?</h2>
        </div>
        <p className="text-slate-700 leading-relaxed">
          GraphRAG는 한 번에 이해하기 어렵습니다. 같은 도메인(브레이크 패드 제조)을 <strong className="text-sky-700">4번 반복</strong>하되,
          매번 규모와 복잡도를 높입니다. 반복할수록 이전 단계에서 배운 것이 자연스럽게 체화됩니다.
        </p>
      </div>

      {/* Horizontal Progression Diagram */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-6 text-center">4단계 학습 경로</h2>
        <div className="flex items-center justify-center gap-0 overflow-x-auto pb-4">
          {domain.stages.map((stage, idx) => (
            <div key={stage.stage} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center text-center w-28 md:w-32">
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-bold text-white text-xs ${stageColors[idx]}`}>
                  {stage.nodes}
                </div>
                <span className={`text-sm font-bold mt-2 ${stageTextColors[idx]}`}>{stage.name}</span>
                <span className="text-xs text-slate-400 mt-0.5">{stage.curriculumParts}</span>
              </div>
              {idx < domain.stages.length - 1 && (
                <ArrowRight className="w-5 h-5 mx-1 md:mx-3 text-slate-300 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stages Grid */}
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {domain.stages.map((stage, idx) => (
            <Link
              key={stage.stage}
              href={`/cases/${domain.id}/stage-${stage.stage}`}
              className={`group p-6 rounded-xl transition-all hover:-translate-y-1 ring-card ring-card-hover bg-white border-l-4 ${stageBorderColors[idx]}`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className={`text-xs font-mono px-2 py-1 rounded ${stageBgColors[idx]} ${stageTextColors[idx]}`}>
                  Stage {stage.stage}
                </span>
                <span className="text-sm text-slate-500">노드 {stage.nodes}</span>
              </div>
              <h3 className={`text-xl font-bold mb-2 ${stageTextColors[idx]}`}>{stage.name}</h3>
              <p className="text-sm mb-3 text-slate-700">{stage.curriculumParts}</p>
              <div className="p-3 rounded-lg text-sm bg-slate-50 ring-card mb-3">
                <span className="text-xs text-violet-500">마일스톤</span>
                <p className="mt-1 text-sm">{stage.milestone}</p>
              </div>
              <div className="flex items-center justify-end">
                <span className="text-xs text-sky-500 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  실습하기 <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Graph Structure - Manufacturing only */}
      <div className="p-6 rounded-xl ring-card bg-white">
        <h2 className="text-xl font-bold mb-4">그래프 구조 개요</h2>
        <div className="p-4 rounded-lg bg-slate-50 text-sm font-mono text-slate-600">
          <div>
            <p className="mb-2">엔티티 타입: Process(공정), Equipment(설비), Defect(결함), Inspection(검사), Component(부품)</p>
            <p>관계 타입: NEXT(순차), USES_EQUIPMENT(장비사용), USES_MATERIAL(자재사용), CAUSED_BY_PROCESS(공정유발), CAUSED_BY_EQUIPMENT(장비유발), DETECTED_AT(검출위치), INSPECTS(검사대상)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
