import Link from 'next/link';
import { curriculumMeta } from '@/data/curriculum-meta';
import { domainsMeta } from '@/data/domain-meta';
import DifficultyCurve from '@/components/ui/DifficultyCurve';
import { Search, Puzzle, Zap, Database, Code, Link as LinkIcon, Bot, BarChart3, Factory, ArrowRight, Signal, Clock, Play } from 'lucide-react';

const stageColors = ['bg-sky-500', 'bg-blue-500', 'bg-violet-500', 'bg-amber-500'];

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
  8: '#06b6d4',
  9: '#14b8a6',
  10: '#8b5cf6',
  11: '#f97316',
  12: '#ec4899',
  13: '#6366f1',
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
            23시간 실무 과정 · 기초 + 심화 · 4단계 제조 케이스 스터디
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

      {/* Global KG Use Cases */}
      <section className="py-16 px-6 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-center text-slate-900" style={{ fontFamily: 'var(--font-title)' }}>
            글로벌 KG 활용 사례
          </h2>
          <p className="text-center mb-12 text-lg text-slate-600">
            세계 최고 기업들이 지식그래프로 만드는 가치
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                company: 'Google',
                stat: '540억 엔티티',
                desc: 'Knowledge Graph로 검색 품질 혁신. Knowledge Panel, AI Overview, E-E-A-T 시그널을 구동하는 세계 최대 지식그래프.',
                color: '#4285F4',
                svg: (
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.35-4.35" />
                    <circle cx="11" cy="8" r="1" fill="currentColor" />
                    <circle cx="8" cy="13" r="1" fill="currentColor" />
                    <circle cx="14" cy="12" r="1" fill="currentColor" />
                    <path d="M11 8l-3 5M11 8l3 4M8 13l6-1" strokeWidth="0.8" />
                  </svg>
                ),
              },
              {
                company: 'Amazon',
                stat: 'COSMO · 18개 도메인',
                desc: '상식 지식그래프(COSMO)로 "인간처럼 쇼핑하는" 추천 시스템 구현. 제품-기능-사용자 맥락 관계 모델링.',
                color: '#FF9900',
                svg: (
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <path d="M10 6.5h4M6.5 10v4M17.5 10v4M10 17.5h4" strokeDasharray="2 1" />
                  </svg>
                ),
              },
              {
                company: 'LinkedIn',
                stat: '39,000+ 스킬',
                desc: 'Skills Graph로 8.75억 회원의 직무-기술-회사 관계를 매핑. GNN 기반 링크 예측으로 추천 정확도 향상.',
                color: '#0A66C2',
                svg: (
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="5" r="2.5" />
                    <circle cx="5" cy="14" r="2.5" />
                    <circle cx="19" cy="14" r="2.5" />
                    <circle cx="9" cy="20" r="1.5" />
                    <circle cx="15" cy="20" r="1.5" />
                    <path d="M12 7.5v2M10 10l-3.5 2.5M14 10l3.5 2.5M6.5 16l2 3M17.5 16l-2 3" />
                  </svg>
                ),
              },
              {
                company: 'Netflix',
                stat: '엔터테인먼트 KG',
                desc: 'RDF 기반 온톨로지로 영화-배우-장르-콘셉트를 그래프 임베딩으로 표현. 콜드스타트 문제 해결 및 콘텐츠 가치 평가.',
                color: '#E50914',
                svg: (
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="4" y="2" width="16" height="14" rx="2" />
                    <polygon points="10,5 10,13 16,9" fill="currentColor" opacity="0.3" stroke="currentColor" />
                    <circle cx="6" cy="20" r="1.5" />
                    <circle cx="12" cy="20" r="1.5" />
                    <circle cx="18" cy="20" r="1.5" />
                    <path d="M6 18.5v-2M12 16v2.5M18 18.5v-2" />
                  </svg>
                ),
              },
              {
                company: 'Samsung',
                stat: 'Galaxy AI · 온디바이스',
                desc: '2024년 Oxford Semantic Technologies 인수. Galaxy 기기에 개인 지식그래프 탑재, SmartThings 라이프스타일 분석.',
                color: '#1428A0',
                svg: (
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="6" y="2" width="12" height="20" rx="2" />
                    <circle cx="12" cy="12" r="3" />
                    <circle cx="12" cy="12" r="1" fill="currentColor" />
                    <path d="M9.5 10l-1-2M14.5 10l1-2M9.5 14l-1 2M14.5 14l1 2" strokeWidth="1" />
                  </svg>
                ),
              },
              {
                company: 'Naver',
                stat: 'HyperCLOVA X + KG',
                desc: '한국 특화 지식그래프로 지역 축제, 인물, 문화 맥락을 반영. Cue AI 검색에서 엔티티 기반 팩트 그라운딩 제공.',
                color: '#03C75A',
                svg: (
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <path d="M8 8v8l4-5 4 5V8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.company}
                className="group p-6 rounded-xl ring-card ring-card-hover bg-white transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${item.color}10`, color: item.color }}
                  >
                    {item.svg}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{item.company}</h3>
                    <span className="text-sm font-medium" style={{ color: item.color }}>{item.stat}</span>
                  </div>
                </div>
                <p className="text-base text-slate-700 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Difficulty Curve */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <DifficultyCurve />
        </div>
      </section>

      {/* 2025-2026 KG Trends */}
      <section className="py-16 px-6 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-center text-slate-900" style={{ fontFamily: 'var(--font-title)' }}>
            2025–2026 트렌드
          </h2>
          <p className="text-center mb-12 text-lg text-slate-600">
            지식그래프 생태계의 핵심 변화와 시장 전망
          </p>

          {/* Trend Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              {
                icon: (
                  <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="16" cy="16" r="12" strokeDasharray="4 2" />
                    <circle cx="10" cy="12" r="2.5" fill="rgba(14,165,233,0.2)" stroke="currentColor" />
                    <circle cx="22" cy="12" r="2.5" fill="rgba(14,165,233,0.2)" stroke="currentColor" />
                    <circle cx="16" cy="22" r="2.5" fill="rgba(14,165,233,0.2)" stroke="currentColor" />
                    <path d="M12 13l3 7M20 13l-3 7M12 12h8" strokeWidth="1" />
                  </svg>
                ),
                title: '경량 GraphRAG',
                badge: 'LazyGraphRAG · LightRAG',
                desc: '인덱싱 비용 99.9% 절감, 쿼리 레이턴시 30% 감소. 중소기업도 도입 가능한 GraphRAG 시대.',
                color: '#0ea5e9',
              },
              {
                icon: (
                  <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="4" y="8" width="10" height="10" rx="2" />
                    <rect x="18" y="4" width="10" height="10" rx="2" />
                    <rect x="18" y="18" width="10" height="10" rx="2" />
                    <path d="M14 13h4M14 17l4 4" strokeWidth="1.2" />
                    <circle cx="23" cy="9" r="1.5" fill="currentColor" opacity="0.3" />
                    <circle cx="23" cy="23" r="1.5" fill="currentColor" opacity="0.3" />
                  </svg>
                ),
                title: 'Agentic KG',
                badge: 'Graphiti · KARMA',
                desc: 'AI 에이전트의 장기 기억 장치로 KG 활용. Bi-temporal 모델로 시간에 따른 지식 변화를 추적.',
                color: '#8b5cf6',
              },
              {
                icon: (
                  <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="16" cy="16" r="12" />
                    <path d="M10 14c2-4 10-4 12 0" strokeWidth="1.2" />
                    <path d="M10 18c2 4 10 4 12 0" strokeWidth="1.2" />
                    <line x1="16" y1="4" x2="16" y2="28" strokeWidth="0.8" strokeDasharray="2 2" />
                    <circle cx="16" cy="11" r="1.5" fill="currentColor" opacity="0.3" />
                    <circle cx="16" cy="21" r="1.5" fill="currentColor" opacity="0.3" />
                  </svg>
                ),
                title: 'KG + LLM 융합',
                badge: '하이브리드 RAG',
                desc: '2026년까지 기업 85%가 벡터+그래프 하이브리드 RAG 도입 전망. KG로 LLM 환각을 교정.',
                color: '#3b82f6',
              },
              {
                icon: (
                  <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="4" y="10" width="8" height="12" rx="1" />
                    <rect x="16" y="6" width="12" height="8" rx="1" />
                    <path d="M20 14v4h-4" strokeWidth="1.2" />
                    <circle cx="8" cy="16" r="2" strokeDasharray="1.5 1" />
                    <path d="M22 8l2 2-2 2" strokeWidth="1" />
                    <rect x="16" y="20" width="12" height="6" rx="1" />
                    <path d="M19 23h6" strokeWidth="1" />
                  </svg>
                ),
                title: '멀티모달 KG',
                badge: 'GNN · R-GAT',
                desc: '텍스트+이미지+음성을 통합하는 멀티모달 KG. MLPerf v5.0에 최초 GNN 벤치마크 등록.',
                color: '#f59e0b',
              },
            ].map((trend) => (
              <div
                key={trend.title}
                className="flex gap-4 p-6 rounded-xl ring-card bg-white"
              >
                <div
                  className="flex-shrink-0 p-2 rounded-lg h-fit"
                  style={{ backgroundColor: `${trend.color}10`, color: trend.color }}
                >
                  {trend.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">{trend.title}</h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: `${trend.color}10`, color: trend.color }}
                    >
                      {trend.badge}
                    </span>
                  </div>
                  <p className="text-base text-slate-700">{trend.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Market Growth Bar */}
          <div className="p-6 rounded-xl ring-card bg-gradient-to-r from-sky-50 to-violet-50">
            <h3 className="text-lg font-bold mb-4 text-center text-slate-900">KG 시장 성장 전망</h3>
            <div className="flex items-end justify-center gap-8">
              {[
                { year: '2024', value: '$1.1B', height: '40px', color: '#e2e8f0' },
                { year: '2025', value: '$1.5B', height: '55px', color: '#0ea5e9' },
                { year: '2027', value: '$2.8B', height: '100px', color: '#3b82f6' },
                { year: '2030', value: '$6.9B', height: '160px', color: '#8b5cf6' },
              ].map((bar) => (
                <div key={bar.year} className="flex flex-col items-center gap-2">
                  <span className="text-sm font-bold text-slate-700">{bar.value}</span>
                  <div
                    className="w-16 rounded-t-lg transition-all duration-500"
                    style={{ height: bar.height, backgroundColor: bar.color }}
                  />
                  <span className="text-xs font-medium text-slate-500">{bar.year}</span>
                </div>
              ))}
            </div>
            <p className="text-center mt-4 text-sm text-slate-500">
              CAGR 36.6% · 아시아 태평양 최고 성장률 22.4% · 클라우드 KG 58.7%
            </p>
          </div>
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
            13개 Part · 23시간 · 기초에서 프로덕션까지
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
                    <span className={`text-base font-mono px-2 py-0.5 rounded ${part.track === 'advanced' ? 'bg-violet-50 text-violet-600' : 'bg-sky-50 text-sky-600'}`}>
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
                    {part.track === 'advanced' && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase bg-violet-100 text-violet-600 border border-violet-200">
                        ADV
                      </span>
                    )}
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

      {/* Case Study */}
      <section className="py-16 px-6 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-center text-slate-900" style={{ fontFamily: 'var(--font-title)' }}>
            제조 케이스 스터디
          </h2>
          <p className="text-center mb-12 text-lg text-slate-600">
            같은 도메인을 4단계로 확장 — 7노드에서 5K+노드까지
          </p>

          {(() => {
            const domain = domainsMeta[0];
            return (
              <div>
                {/* Domain intro */}
                <Link href="/cases/manufacturing" className="block p-6 rounded-2xl mb-8 transition-all hover:-translate-y-0.5 ring-card bg-white text-slate-800">
                  <div className="flex items-center gap-3 mb-3">
                    <Factory className="w-6 h-6 text-sky-500" />
                    <h3 className="text-xl font-bold">{domain.name}</h3>
                    <span className="text-sm px-2 py-0.5 rounded-full ml-auto bg-sky-50 text-sky-600 border border-sky-100">
                      {domain.queryHops}-hop
                    </span>
                  </div>
                  <p className="text-base mb-3 text-slate-700">{domain.description}</p>
                  <div className="p-3 rounded-lg text-base bg-slate-50 text-sky-600">
                    핵심 질의: &quot;{domain.coreQuery}&quot;
                  </div>
                </Link>

                {/* 4 stage cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {domain.stages.map((stage, idx) => (
                    <Link
                      key={stage.stage}
                      href={`/cases/manufacturing/stage-${stage.stage}`}
                      className="group block p-4 rounded-xl transition-all hover:-translate-y-1 ring-card ring-card-hover bg-white text-center"
                    >
                      <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center font-bold text-white text-xs mb-3 ${stageColors[idx]}`}>
                        {stage.nodes}
                      </div>
                      <div className="text-sm font-bold mb-1 text-slate-800">{stage.name}</div>
                      <div className="text-xs text-slate-500 mb-2">{stage.curriculumParts}</div>
                      <div className="flex items-center gap-1">
                        {domain.stages.map((s) => (
                          <div
                            key={s.stage}
                            className={`flex-1 h-1 rounded-full ${s.stage <= stage.stage ? 'bg-sky-500' : 'bg-slate-100'}`}
                          />
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* YouTube 시리즈 */}
      <section className="py-16 px-6 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-center text-slate-900" style={{ fontFamily: 'var(--font-title)' }}>
            YouTube 시리즈
          </h2>
          <p className="text-center mb-12 text-lg text-slate-600">
            영상으로 배우는 GraphRAG — 실습과 함께
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                ep: 'EP1',
                title: '지식그래프 처음 만들기',
                desc: 'Neo4j에 첫 그래프를 만들고, 노드와 관계의 힘을 직접 체험합니다. Cypher 기초부터 시작.',
                duration: '약 30분',
                parts: 'Part 1~2 연계',
                status: 'ready' as const,
              },
              {
                ep: 'EP2',
                title: 'LLM으로 KG 자동 구축',
                desc: 'GPT로 텍스트에서 엔티티와 관계를 자동 추출하여 지식그래프를 생성하는 파이프라인.',
                duration: '약 35분',
                parts: 'Part 3~4 연계',
                status: 'coming' as const,
              },
              {
                ep: 'EP3',
                title: 'GraphRAG 질의 시스템',
                desc: 'Text2Cypher Agent로 자연어 질문을 그래프 쿼리로 변환하는 RAG 시스템 구축.',
                duration: '약 40분',
                parts: 'Part 5~6 연계',
                status: 'coming' as const,
              },
            ].map((video) => (
              <div
                key={video.ep}
                className={`p-6 rounded-xl ring-card bg-white transition-all duration-300 ${video.status === 'ready' ? 'ring-card-hover hover:-translate-y-1' : 'opacity-75'}`}
              >
                {/* Thumbnail placeholder */}
                <div className="relative mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 aspect-video flex items-center justify-center">
                  <div className="absolute top-2 left-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${video.status === 'ready' ? 'bg-red-500 text-white' : 'bg-slate-600 text-slate-300'}`}>
                      {video.ep}
                    </span>
                  </div>
                  <Play className={`w-12 h-12 ${video.status === 'ready' ? 'text-red-400' : 'text-slate-500'}`} />
                  {video.status === 'coming' && (
                    <span className="absolute bottom-2 right-2 text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                      Coming Soon
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold mb-2 text-slate-900">{video.title}</h3>
                <p className="text-sm mb-3 text-slate-600">{video.desc}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {video.duration}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Signal className="w-3 h-3" />
                    {video.parts}
                  </span>
                </div>
              </div>
            ))}
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
          <br />
          <span className="mt-2 inline-block">
            기초를 마쳤나요? <Link href="/curriculum/part8" className="underline hover:no-underline text-violet-500">Part 8 심화 과정으로</Link>
            <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
          </span>
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
