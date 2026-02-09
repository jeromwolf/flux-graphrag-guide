import { notFound } from 'next/navigation';
import Link from 'next/link';
import { domainsMeta } from '@/data/domain-meta';
import { Factory, Wallet, Scale, Globe, ArrowLeft } from 'lucide-react';

const domainIcons: Record<string, React.ReactNode> = {
  manufacturing: <Factory className="w-12 h-12 text-sky-500" />,
  finance: <Wallet className="w-12 h-12 text-sky-500" />,
  legal: <Scale className="w-12 h-12 text-sky-500" />,
  'it-telecom': <Globe className="w-12 h-12 text-sky-500" />,
};

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

  const isComingSoon = domain.status === 'coming-soon';

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Back Link */}
      <Link href="/cases" className="inline-flex items-center gap-2 mb-8 text-sm text-sky-500 hover:gap-3 transition-all">
        <ArrowLeft className="w-4 h-4" />
        <span>모든 도메인 보기</span>
      </Link>

      {/* Hero */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          {domainIcons[domain.id] || <Globe className="w-12 h-12 text-sky-500" />}
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-2 gradient-text" style={{ fontFamily: 'var(--font-title)' }}>
              {domain.name} ({domain.nameEn})
            </h1>
            <p className="text-lg text-slate-500">{domain.description}</p>
          </div>
          {isComingSoon && (
            <span className="ml-auto text-sm px-4 py-2 rounded-full whitespace-nowrap bg-amber-50 text-amber-600 border border-amber-200">
              Coming Soon
            </span>
          )}
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

      {/* Stages Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">4단계 학습 경로</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {domain.stages.map((stage) => {
            const content = (
              <>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs font-mono px-2 py-1 rounded bg-sky-50 text-sky-600">
                    Stage {stage.stage}
                  </span>
                  <span className="text-sm text-slate-400">노드 {stage.nodes}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{stage.name}</h3>
                <p className="text-sm mb-3 text-slate-500">{stage.curriculumParts}</p>
                <div className="p-3 rounded-lg text-sm bg-slate-50 ring-card">
                  <span className="text-xs text-violet-500">마일스톤</span>
                  <p className="mt-1 text-sm">{stage.milestone}</p>
                </div>
              </>
            );

            if (isComingSoon) {
              return (
                <div key={stage.stage} className="p-6 rounded-xl cursor-not-allowed opacity-50 ring-card bg-white">
                  {content}
                </div>
              );
            }

            return (
              <Link
                key={stage.stage}
                href={`/cases/${domain.id}/stage-${stage.stage}`}
                className="p-6 rounded-xl transition-all hover:-translate-y-1 ring-card ring-card-hover bg-white"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Graph Structure */}
      <div className="p-6 rounded-xl ring-card bg-white">
        <h2 className="text-xl font-bold mb-4">그래프 구조 개요</h2>
        <div className="p-4 rounded-lg bg-slate-50 text-sm font-mono text-slate-600">
          {domain.id === 'manufacturing' && (
            <div>
              <p className="mb-2">엔티티 타입: Process(공정), Equipment(설비), Defect(결함), Inspection(검사), Component(부품)</p>
              <p>관계 타입: NEXT(순차), USES_EQUIPMENT(장비사용), USES_MATERIAL(자재사용), CAUSED_BY_PROCESS(공정유발), CAUSED_BY_EQUIPMENT(장비유발), DETECTED_AT(검출위치), INSPECTS(검사대상)</p>
            </div>
          )}
          {domain.id === 'finance' && (
            <div>
              <p className="mb-2">엔티티 타입: Account(계좌), Transaction(거래), Person(고객), Pattern(패턴)</p>
              <p>관계 타입: TRANSFERS_TO(송금), OWNS(소유), MATCHES_PATTERN(패턴매칭), CONNECTED_TO(연결)</p>
            </div>
          )}
          {domain.id === 'legal' && (
            <div>
              <p className="mb-2">엔티티 타입: Case(판례), Law(조항), Court(법원), Judge(판사)</p>
              <p>관계 타입: CITES(인용), REFERENCES(참조), OVERRULES(무효화), DECIDED_BY(판결자)</p>
            </div>
          )}
          {domain.id === 'it-telecom' && (
            <div>
              <p className="mb-2">엔티티 타입: Service(서비스), Server(서버), Database(DB), Network(네트워크)</p>
              <p>관계 타입: DEPENDS_ON(의존), CONNECTS_TO(연결), IMPACTS(영향), MONITORS(모니터링)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
