import { notFound } from 'next/navigation';
import Link from 'next/link';
import { domainsMeta } from '@/data/domain-meta';

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
      <Link
        href="/cases"
        className="inline-flex items-center gap-2 mb-8 text-sm hover:gap-3 transition-all"
        style={{ color: 'var(--accent-cyan)' }}
      >
        <span>←</span>
        <span>모든 도메인 보기</span>
      </Link>

      {/* Hero */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-6xl">{domain.icon}</span>
          <div>
            <h1
              className="text-4xl md:text-5xl font-black mb-2 gradient-text"
              style={{
                fontFamily: 'var(--font-title)',
              }}
            >
              {domain.name} ({domain.nameEn})
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              {domain.description}
            </p>
          </div>
          {isComingSoon && (
            <span
              className="ml-auto text-sm px-4 py-2 rounded-full whitespace-nowrap"
              style={{
                background: 'rgba(234,179,8,0.1)',
                color: 'var(--accent-yellow)',
                border: '1px solid rgba(234,179,8,0.2)',
              }}
            >
              Coming Soon
            </span>
          )}
        </div>

        {/* Core Query Highlight */}
        <div
          className="p-6 rounded-xl mb-6"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glow)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs font-mono px-2 py-1 rounded"
              style={{
                background: 'rgba(14,165,233,0.1)',
                color: 'var(--accent-cyan)'
              }}
            >
              핵심 질의 ({domain.queryHops}-hop)
            </span>
            <span
              className="text-xs px-2 py-1 rounded"
              style={{
                background: 'rgba(139,92,246,0.1)',
                color: 'var(--accent-purple)'
              }}
            >
              난이도 {domain.difficulty}/5
            </span>
          </div>
          <p className="text-xl font-semibold">&quot;{domain.coreQuery}&quot;</p>
        </div>

        {/* Scenario Description */}
        <div
          className="p-6 rounded-xl"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
          }}
        >
          <h3 className="text-sm font-mono mb-2" style={{ color: 'var(--accent-blue)' }}>
            시나리오
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>{domain.scenario}</p>
        </div>
      </div>

      {/* Stages Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">4단계 학습 경로</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {domain.stages.map((stage) => {
            const stageHref = `/cases/${domain.id}/stage-${stage.stage}`;
            const isDisabled = isComingSoon;

            const content = (
              <>
                <div className="flex items-start justify-between mb-4">
                  <span
                    className="text-xs font-mono px-2 py-1 rounded"
                    style={{
                      background: 'rgba(14,165,233,0.1)',
                      color: 'var(--accent-cyan)'
                    }}
                  >
                    Stage {stage.stage}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--text-dim)' }}>
                    노드 {stage.nodes}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{stage.name}</h3>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {stage.curriculumParts}
                </p>
                <div
                  className="p-3 rounded-lg text-sm"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <span className="text-xs" style={{ color: 'var(--accent-purple)' }}>마일스톤</span>
                  <p className="mt-1 text-sm">{stage.milestone}</p>
                </div>
              </>
            );

            if (isDisabled) {
              return (
                <div
                  key={stage.stage}
                  className="p-6 rounded-xl cursor-not-allowed opacity-50"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {content}
                </div>
              );
            }

            return (
              <Link
                key={stage.stage}
                href={stageHref}
                className="p-6 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                }}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Graph Structure Preview */}
      <div
        className="p-6 rounded-xl"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
        }}
      >
        <h2 className="text-xl font-bold mb-4">그래프 구조 개요</h2>
        <div
          className="p-4 rounded-lg"
          style={{
            background: 'var(--bg-code)',
            fontFamily: 'var(--font-code)',
            fontSize: '0.875rem'
          }}
        >
          {domain.id === 'manufacturing' && (
            <div style={{ color: 'var(--text-secondary)' }}>
              <p className="mb-2">엔티티 타입: Process(공정), Equipment(설비), Defect(결함), Inspection(검사), Component(부품)</p>
              <p>관계 타입: NEXT(순차), USES_EQUIPMENT(장비사용), USES_MATERIAL(자재사용), CAUSED_BY_PROCESS(공정유발), CAUSED_BY_EQUIPMENT(장비유발), DETECTED_AT(검출위치), INSPECTS(검사대상)</p>
            </div>
          )}
          {domain.id === 'finance' && (
            <div style={{ color: 'var(--text-secondary)' }}>
              <p className="mb-2">엔티티 타입: Account(계좌), Transaction(거래), Person(고객), Pattern(패턴)</p>
              <p>관계 타입: TRANSFERS_TO(송금), OWNS(소유), MATCHES_PATTERN(패턴매칭), CONNECTED_TO(연결)</p>
            </div>
          )}
          {domain.id === 'legal' && (
            <div style={{ color: 'var(--text-secondary)' }}>
              <p className="mb-2">엔티티 타입: Case(판례), Law(조항), Court(법원), Judge(판사)</p>
              <p>관계 타입: CITES(인용), REFERENCES(참조), OVERRULES(무효화), DECIDED_BY(판결자)</p>
            </div>
          )}
          {domain.id === 'it-telecom' && (
            <div style={{ color: 'var(--text-secondary)' }}>
              <p className="mb-2">엔티티 타입: Service(서비스), Server(서버), Database(DB), Network(네트워크)</p>
              <p>관계 타입: DEPENDS_ON(의존), CONNECTS_TO(연결), IMPACTS(영향), MONITORS(모니터링)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
