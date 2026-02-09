import Link from 'next/link';
import { curriculumMeta } from '@/data/curriculum-meta';
import { domainsMeta } from '@/data/domain-meta';
import DifficultyCurve from '@/components/ui/DifficultyCurve';
import { Search, Puzzle, Zap, Database, Code, Link as LinkIcon, Bot, BarChart3, Factory, Wallet, Scale, Globe, ArrowRight, Signal, Clock } from 'lucide-react';

const domainIcons: Record<string, React.ReactNode> = {
  manufacturing: <Factory className="w-6 h-6 text-sky-500" />,
  finance: <Wallet className="w-6 h-6 text-sky-500" />,
  legal: <Scale className="w-6 h-6 text-sky-500" />,
  'it-telecom': <Globe className="w-6 h-6 text-sky-500" />,
};

const techStack = [
  { icon: <Database className="w-4 h-4" />, name: 'Neo4j' },
  { icon: <Code className="w-4 h-4" />, name: 'Python' },
  { icon: <LinkIcon className="w-4 h-4" />, name: 'LangChain' },
  { icon: <Search className="w-4 h-4" />, name: 'Cypher' },
  { icon: <Bot className="w-4 h-4" />, name: 'OpenAI' },
  { icon: <BarChart3 className="w-4 h-4" />, name: 'RAGAS' },
];

const partColors: Record<number, string> = {
  1: '#0ea5e9',
  2: '#3b82f6',
  3: '#8b5cf6',
  4: '#f59e0b',
  5: '#ef4444',
  6: '#0ea5e9',
  7: '#ca8a04',
};

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(14,165,233,0.06)_0%,transparent_50%),radial-gradient(ellipse_at_70%_30%,rgba(59,130,246,0.05)_0%,transparent_50%),radial-gradient(ellipse_at_50%_80%,rgba(139,92,246,0.04)_0%,transparent_50%)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 bg-sky-50 border border-sky-200 text-sky-600">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-sky-500" />
            11시간 실무 과정 · 4개 도메인 유스케이스
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-4 gradient-text" style={{ fontFamily: 'var(--font-title)', lineHeight: 1.15 }}>
            Knowledge Graph +<br />GraphRAG 실무 가이드
          </h1>

          <p className="text-xl mb-8 text-slate-700 font-light">
            벡터 RAG의 한계를 넘어, 온톨로지 설계부터 프로덕션 배포까지
          </p>

          <div className="flex justify-center gap-4">
            <Link href="/curriculum" className="px-8 py-3 rounded-xl font-semibold transition-transform hover:scale-105 bg-sky-500 text-white">
              커리큘럼 시작하기
            </Link>
            <Link href="/cases" className="px-8 py-3 rounded-xl font-semibold transition-transform hover:scale-105 bg-white ring-card text-slate-800">
              도메인 케이스 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Why GraphRAG? */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-slate-900" style={{ fontFamily: 'var(--font-title)' }}>
            왜 GraphRAG?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Search className="w-7 h-7 text-sky-500" />, title: 'Multi-hop 추론', desc: '벡터 검색으로는 불가능한 다단계 관계 탐색' },
              { icon: <Puzzle className="w-7 h-7 text-sky-500" />, title: '온톨로지 기반', desc: '도메인 지식을 구조화된 그래프로 표현' },
              { icon: <Zap className="w-7 h-7 text-sky-500" />, title: '정확한 답변', desc: 'LLM 환각 없이 그래프 경로 기반 근거 제시' },
            ].map((card) => (
              <div key={card.title} className="p-6 rounded-xl ring-card bg-white">
                <div className="mb-3">{card.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-sky-600">
                  {card.title}
                </h3>
                <p className="text-base text-slate-700">
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
          <p className="text-2xl font-bold mb-4 text-amber-600">
            &quot;1-hop이면 벡터로 충분. Multi-hop이 필요하니까 GraphRAG를 쓰는 것&quot;
          </p>
          <p className="text-lg text-slate-700">
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
      <section className="py-12 px-6 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-slate-900" style={{ fontFamily: 'var(--font-title)' }}>
            기술 스택
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech) => (
              <span
                key={tech.name}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-base font-medium bg-sky-50 border border-sky-100 text-slate-700"
              >
                <span className="text-sky-500">{tech.icon}</span>
                <span>{tech.name}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Overview */}
      <section className="py-16 px-6 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-center text-slate-900" style={{ fontFamily: 'var(--font-title)' }}>
            커리큘럼
          </h2>
          <p className="text-center mb-12 text-lg text-slate-600">
            7개 Part · 11시간 · 온톨로지 설계부터 프로덕션까지
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curriculumMeta.map((part) => (
              <Link
                key={part.part}
                href={`/curriculum/part${part.part}`}
                className="block rounded-2xl transition-all duration-300 hover:-translate-y-1 ring-card ring-card-hover bg-white text-slate-900"
                style={{ borderLeft: `3px solid ${partColors[part.part]}` }}
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-base font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-600">
                      Part {part.part}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {part.duration}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm text-slate-500">
                      <Signal className="w-3.5 h-3.5" />
                      Lv.{part.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {part.title}
                  </h3>
                  <p className="text-base mb-4 text-slate-700">
                    {part.description}
                  </p>
                  <p className="text-sm pt-3 text-slate-500 border-t border-slate-100">
                    {part.milestone}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Domain Cases */}
      <section className="py-16 px-6 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-center text-slate-900" style={{ fontFamily: 'var(--font-title)' }}>
            도메인 유스케이스
          </h2>
          <p className="text-center mb-12 text-lg text-slate-600">
            4개 도메인 × 4단계 = 16개 실습 프로젝트
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {domainsMeta.map((domain) => {
              const cardContent = (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    {domainIcons[domain.id] || <Globe className="w-6 h-6 text-sky-500" />}
                    <h3 className="text-xl font-bold">{domain.name}</h3>
                    <span className="text-sm px-2 py-0.5 rounded-full ml-auto bg-sky-50 text-sky-600 border border-sky-100">
                      {domain.queryHops}-hop
                    </span>
                    {domain.status === 'coming-soon' && (
                      <span className="text-sm px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-base mb-3 text-slate-700">
                    {domain.description}
                  </p>
                  <div className="p-3 rounded-lg text-base mb-4 bg-slate-50 text-sky-600">
                    핵심 질의: &quot;{domain.coreQuery}&quot;
                  </div>
                  <div className="flex gap-1">
                    {domain.stages.map((stage) => (
                      <div
                        key={stage.stage}
                        className="flex-1 h-1.5 rounded-full"
                        style={{
                          background: domain.status === 'active' && stage.stage === 0
                            ? '#0ea5e9'
                            : '#f1f5f9',
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-sm mt-2 text-slate-500">
                    {domain.status === 'active' ? 'Stage 0 이용 가능' : '준비 중'}
                  </p>
                </>
              );

              const cardClass = "block p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 ring-card bg-white text-slate-800";

              return domain.status === 'active' ? (
                <Link key={domain.id} href={`/cases/${domain.id}`} className={cardClass} style={{ opacity: 1 }}>
                  {cardContent}
                </Link>
              ) : (
                <div key={domain.id} className={cardClass} style={{ opacity: 0.5, cursor: 'default' }}>
                  {cardContent}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 text-center border-t border-slate-200">
        <h2 className="text-3xl font-bold mb-4 text-slate-900" style={{ fontFamily: 'var(--font-title)' }}>
          Ready to Start?
        </h2>
        <p className="text-lg mb-8 text-slate-700">
          GraphRAG 실무 여정을 지금 시작하세요
        </p>
        <div className="flex justify-center gap-4 mb-6">
          <Link href="/curriculum" className="px-8 py-3 rounded-xl font-semibold transition-transform hover:scale-105 bg-sky-500 text-white">
            커리큘럼 시작
          </Link>
          <Link href="/cases/manufacturing/stage-0" className="px-8 py-3 rounded-xl font-semibold transition-transform hover:scale-105 bg-white ring-card text-slate-800">
            제조 데모 보기
          </Link>
        </div>
        <p className="text-base text-slate-500">
          이미 기초를 아시나요? <Link href="/curriculum/part3" className="underline hover:no-underline text-sky-500">Part 3부터 시작하세요</Link>
          <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
        </p>
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm font-bold mb-1 text-sky-500">
            깊이가 곧 가치
          </p>
          <p className="text-xs text-slate-500">
            Root Bricks Co., Ltd. · FDE Academy
          </p>
        </div>
      </section>
    </div>
  );
}
