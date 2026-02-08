import Link from 'next/link';
import { domainsMeta } from '@/data/domain-meta';

export const metadata = {
  title: '도메인 유스케이스',
  description: '4개 도메인 × 4단계 — 제조, 금융, 법률, IT/통신 GraphRAG 실습',
};

export default function CasesPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black mb-4 gradient-text" style={{
          fontFamily: 'var(--font-title)',
        }}>
          도메인 유스케이스
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          4개 도메인 × 4단계 = 16개 실습 프로젝트
        </p>
      </div>

      <div className="grid gap-8">
        {domainsMeta.map((domain) => (
          <div
            key={domain.id}
            className="p-6 md:p-8 rounded-2xl"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              opacity: domain.status === 'coming-soon' ? 0.6 : 1,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{domain.icon}</span>
              <div>
                <h2 className="text-2xl font-bold">{domain.name} ({domain.nameEn})</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{domain.description}</p>
              </div>
              {domain.status === 'coming-soon' && (
                <span className="ml-auto text-xs px-3 py-1 rounded-full" style={{
                  background: 'rgba(234,179,8,0.1)',
                  color: 'var(--accent-yellow)',
                  border: '1px solid rgba(234,179,8,0.2)',
                }}>
                  Coming Soon
                </span>
              )}
            </div>

            <div className="p-4 rounded-lg mb-6" style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
            }}>
              <span className="text-xs font-mono" style={{ color: 'var(--accent-cyan)' }}>핵심 질의 ({domain.queryHops}-hop)</span>
              <p className="font-semibold mt-1">&quot;{domain.coreQuery}&quot;</p>
            </div>

            {/* Stages */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {domain.stages.map((stage) => {
                const content = (
                  <>
                    <div className="text-xs font-mono mb-1" style={{ color: 'var(--accent-cyan)' }}>
                      Stage {stage.stage}
                    </div>
                    <div className="font-semibold text-sm mb-1">{stage.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-dim)' }}>
                      노드 {stage.nodes} · {stage.curriculumParts}
                    </div>
                  </>
                );
                return domain.status === 'active' ? (
                  <Link
                    key={stage.stage}
                    href={`/cases/${domain.id}/stage-${stage.stage}`}
                    className="p-4 rounded-xl transition-all hover:-translate-y-0.5"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {content}
                  </Link>
                ) : (
                  <div
                    key={stage.stage}
                    className="p-4 rounded-xl"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      opacity: 0.5,
                      cursor: 'default',
                    }}
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
