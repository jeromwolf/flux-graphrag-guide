import Link from 'next/link';
import { curriculumMeta } from '@/data/curriculum-meta';
import { domainsMeta } from '@/data/domain-meta';
import DifficultyCurve from '@/components/ui/DifficultyCurve';

export default function HomePage() {
  const partColors: Record<number, string> = {
    1: '#0ea5e9',
    2: '#3b82f6',
    3: '#8b5cf6',
    4: '#f59e0b',
    5: '#ef4444',
    6: '#0ea5e9',
    7: '#ca8a04',
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(14,165,233,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(59,130,246,0.05) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(139,92,246,0.04) 0%, transparent 50%)',
        }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center" style={{ zIndex: 1 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{
            background: 'rgba(14,165,233,0.1)',
            border: '1px solid rgba(14,165,233,0.25)',
            color: 'var(--accent-cyan)',
          }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent-cyan)' }} />
            11시간 실무 과정 · 4개 도메인 유스케이스
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-4 gradient-text" style={{
            fontFamily: 'var(--font-title)',
            lineHeight: 1.15,
          }}>
            Knowledge Graph +<br />GraphRAG 실무 가이드
          </h1>

          <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)', fontWeight: 300 }}>
            벡터 RAG의 한계를 넘어, 온톨로지 설계부터 프로덕션 배포까지
          </p>

          <div className="flex justify-center gap-4">
            <Link href="/curriculum" className="px-8 py-3 rounded-xl font-semibold transition-transform hover:scale-105" style={{
              background: 'var(--accent-cyan)',
              color: '#ffffff',
            }}>
              커리큘럼 시작하기
            </Link>
            <Link href="/cases" className="px-8 py-3 rounded-xl font-semibold transition-transform hover:scale-105" style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}>
              도메인 케이스 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Why GraphRAG? */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ fontFamily: 'var(--font-title)', color: 'var(--text-primary)' }}>
            왜 GraphRAG?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🔍', title: 'Multi-hop 추론', desc: '벡터 검색으로는 불가능한 다단계 관계 탐색' },
              { icon: '🧩', title: '온톨로지 기반', desc: '도메인 지식을 구조화된 그래프로 표현' },
              { icon: '⚡', title: '정확한 답변', desc: 'LLM 환각 없이 그래프 경로 기반 근거 제시' },
            ].map((card) => (
              <div key={card.title} className="p-6 rounded-xl" style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
              }}>
                <div className="text-3xl mb-3">{card.icon}</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--accent-cyan)' }}>
                  {card.title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Message */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl font-bold mb-4" style={{ color: 'var(--accent-yellow)' }}>
            &quot;1-hop이면 벡터로 충분. Multi-hop이 필요하니까 GraphRAG를 쓰는 것&quot;
          </p>
          <p style={{ color: 'var(--text-secondary)' }}>
            GraphRAG부터 시작하지 마세요. 문제 정의부터 하세요.
          </p>
        </div>
      </section>

      {/* Difficulty Curve */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <DifficultyCurve />
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-12 px-6" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ fontFamily: 'var(--font-title)', color: 'var(--text-primary)' }}>
            기술 스택
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: '🗄️', name: 'Neo4j' },
              { icon: '🐍', name: 'Python' },
              { icon: '🔗', name: 'LangChain' },
              { icon: '🔍', name: 'Cypher' },
              { icon: '🤖', name: 'OpenAI' },
              { icon: '📊', name: 'RAGAS' },
            ].map((tech) => (
              <span
                key={tech.name}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: 'rgba(14,165,233,0.08)',
                  border: '1px solid rgba(14,165,233,0.2)',
                  color: 'var(--text-secondary)',
                }}
              >
                <span>{tech.icon}</span>
                <span>{tech.name}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Overview */}
      <section className="py-16 px-6" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-center" style={{ fontFamily: 'var(--font-title)', color: 'var(--text-primary)' }}>
            커리큘럼
          </h2>
          <p className="text-center mb-12" style={{ color: 'var(--text-secondary)' }}>
            7개 Part · 11시간 · 온톨로지 설계부터 프로덕션까지
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curriculumMeta.map((part) => (
              <Link
                key={part.part}
                href={`/curriculum/part${part.part}`}
                className="block rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderLeft: `3px solid ${partColors[part.part]}`,
                  color: 'var(--text-primary)',
                }}
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-mono px-2 py-0.5 rounded" style={{
                      background: 'rgba(14,165,233,0.1)',
                      color: 'var(--accent-cyan)',
                    }}>
                      Part {part.part}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-dim)' }}>
                      {part.duration}
                    </span>
                    <span className="text-sm">
                      {'⭐'.repeat(part.difficulty)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">
                    {part.title}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    {part.description}
                  </p>
                  <p className="text-xs pt-3" style={{
                    color: 'var(--text-dim)',
                    borderTop: '1px solid var(--border)',
                  }}>
                    {part.milestone}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Domain Cases */}
      <section className="py-16 px-6" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-center" style={{ fontFamily: 'var(--font-title)', color: 'var(--text-primary)' }}>
            도메인 유스케이스
          </h2>
          <p className="text-center mb-12" style={{ color: 'var(--text-secondary)' }}>
            4개 도메인 × 4단계 = 16개 실습 프로젝트
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {domainsMeta.map((domain) => {
              const cardContent = (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{domain.icon}</span>
                    <h3 className="text-lg font-bold">{domain.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full ml-auto" style={{
                      background: 'rgba(14,165,233,0.1)',
                      color: 'var(--accent-cyan)',
                      border: '1px solid rgba(14,165,233,0.2)',
                    }}>
                      {domain.queryHops}-hop
                    </span>
                    {domain.status === 'coming-soon' && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{
                        background: 'rgba(234,179,8,0.1)',
                        color: 'var(--accent-yellow)',
                      }}>
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                    {domain.description}
                  </p>
                  <div className="p-3 rounded-lg text-sm mb-4" style={{
                    background: 'var(--bg-secondary)',
                    color: 'var(--accent-cyan)',
                  }}>
                    핵심 질의: &quot;{domain.coreQuery}&quot;
                  </div>
                  <div className="flex gap-1">
                    {domain.stages.map((stage) => (
                      <div
                        key={stage.stage}
                        className="flex-1 h-1.5 rounded-full"
                        style={{
                          background: domain.status === 'active' && stage.stage === 0
                            ? 'var(--accent-cyan)'
                            : 'rgba(0,0,0,0.04)',
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs mt-2" style={{ color: 'var(--text-dim)' }}>
                    {domain.status === 'active' ? 'Stage 0 이용 가능' : '준비 중'}
                  </p>
                </>
              );

              const cardStyle = {
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                opacity: domain.status === 'coming-soon' ? 0.5 : 1,
                color: 'var(--text-primary)' as const,
              };
              const cardClass = "block p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1";

              return domain.status === 'active' ? (
                <Link key={domain.id} href={`/cases/${domain.id}`} className={cardClass} style={cardStyle}>
                  {cardContent}
                </Link>
              ) : (
                <div key={domain.id} className={cardClass} style={{ ...cardStyle, cursor: 'default' }}>
                  {cardContent}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 text-center" style={{ borderTop: '1px solid var(--border)' }}>
        <h2 className="text-3xl font-bold mb-4" style={{
          fontFamily: 'var(--font-title)',
          color: 'var(--text-primary)',
        }}>
          Ready to Start?
        </h2>
        <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
          GraphRAG 실무 여정을 지금 시작하세요
        </p>
        <div className="flex justify-center gap-4 mb-6">
          <Link href="/curriculum" className="px-8 py-3 rounded-xl font-semibold transition-transform hover:scale-105" style={{
            background: 'var(--accent-cyan)',
            color: '#ffffff',
          }}>
            커리큘럼 시작
          </Link>
          <Link href="/cases/manufacturing/stage-0" className="px-8 py-3 rounded-xl font-semibold transition-transform hover:scale-105" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}>
            제조 데모 보기
          </Link>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
          이미 기초를 아시나요? <Link href="/curriculum/part3" className="underline hover:no-underline" style={{ color: 'var(--accent-cyan)' }}>Part 3부터 시작하세요 →</Link>
        </p>
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-sm font-bold mb-1" style={{ color: 'var(--accent-cyan)' }}>
            깊이가 곧 가치
          </p>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
            Root Bricks Co., Ltd. · FDE Academy
          </p>
        </div>
      </section>
    </div>
  );
}
