import Link from 'next/link';
import {
  FileText,
  Compass,
  Scissors,
  Share2,
  Search,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ArrowDown,
  MessageSquare,
  XCircle,
  CheckCircle2,
} from 'lucide-react';

export const metadata = {
  title: 'GraphRAG 파이프라인 -- 전체 흐름 한 눈에 보기',
  description: '6단계로 이해하는 GraphRAG 파이프라인. 문서에서 AI 답변까지.',
};

/* ──────────────────────────────────────────────
   Step definitions
   ────────────────────────────────────────────── */

interface PipelineStep {
  num: number;
  icon: React.ReactNode;
  color: string;
  colorLight: string;
  colorBorder: string;
  title: string;
  subtitle: string;
  explanation: string;
  example: string;
  summaryLabel: string;
  summaryEmoji: string;
}

const STEPS: PipelineStep[] = [
  {
    num: 1,
    icon: <FileText className="w-6 h-6" />,
    color: '#64748b',
    colorLight: 'rgba(100,116,139,0.08)',
    colorBorder: 'rgba(100,116,139,0.3)',
    title: '문서가 있다',
    subtitle: 'Documents',
    explanation: '공장의 매뉴얼, 보고서, 설비이력 -- 답이 흩어져 있다',
    example: '품질보고서, 공정매뉴얼, 설비대장, 검사기록',
    summaryLabel: '문서',
    summaryEmoji: '\uD83D\uDCC4',
  },
  {
    num: 2,
    icon: <Compass className="w-6 h-6" />,
    color: '#0ea5e9',
    colorLight: 'rgba(14,165,233,0.08)',
    colorBorder: 'rgba(14,165,233,0.3)',
    title: '설계도를 그린다',
    subtitle: 'Ontology Design',
    explanation: '어떤 것(엔티티)이 있고, 어떻게 연결(관계)되는지 정의한다',
    example: '5종류: 공정, 설비, 결함, 검사, 자재 / 7종류 관계: NEXT, USES_EQUIPMENT ...',
    summaryLabel: '설계도',
    summaryEmoji: '\uD83D\uDCD0',
  },
  {
    num: 3,
    icon: <Scissors className="w-6 h-6" />,
    color: '#3b82f6',
    colorLight: 'rgba(59,130,246,0.08)',
    colorBorder: 'rgba(59,130,246,0.3)',
    title: '문서에서 뽑아낸다',
    subtitle: 'Entity Extraction',
    explanation: '문서를 읽고 설계도에 맞춰 노드와 관계를 추출한다 (수작업 or LLM)',
    example: "'접착 박리가 전단강도 시험에서 발견됨' \u2192 (접착 박리)--DETECTED_AT-->(전단강도 시험)",
    summaryLabel: '추출',
    summaryEmoji: '\uD83D\uDD0D',
  },
  {
    num: 4,
    icon: <Share2 className="w-6 h-6" />,
    color: '#8b5cf6',
    colorLight: 'rgba(139,92,246,0.08)',
    colorBorder: 'rgba(139,92,246,0.3)',
    title: '그래프에 넣는다',
    subtitle: 'Graph Construction',
    explanation: '추출한 노드와 관계를 Neo4j 그래프 DB에 저장한다',
    example: '[혼합] \u2192 [열압착] \u2192 [연마] / [접착 박리] \u2192 [전단강도 시험]',
    summaryLabel: '그래프',
    summaryEmoji: '\uD83D\uDD78\uFE0F',
  },
  {
    num: 5,
    icon: <Search className="w-6 h-6" />,
    color: '#f59e0b',
    colorLight: 'rgba(245,158,11,0.08)',
    colorBorder: 'rgba(245,158,11,0.3)',
    title: '질문한다',
    subtitle: 'Graph Retrieval',
    explanation: '자연어 질문을 Cypher 쿼리로 바꿔서 그래프를 검색한다 (Text2Cypher)',
    example: "MATCH (d:Defect)-[:DETECTED_AT]->(i)-[:INSPECTS]->(p)-[:USES_EQUIPMENT]->(e) RETURN e",
    summaryLabel: '검색',
    summaryEmoji: '\uD83D\uDCAC',
  },
  {
    num: 6,
    icon: <Sparkles className="w-6 h-6" />,
    color: '#10b981',
    colorLight: 'rgba(16,185,129,0.08)',
    colorBorder: 'rgba(16,185,129,0.3)',
    title: '답변을 만든다',
    subtitle: 'Answer Generation',
    explanation: '그래프에서 찾은 결과 + LLM = 정확한 자연어 답변',
    example: "'접착 박리 결함은 HP-01 열압착 프레스가 근본 원인입니다. 해당 설비는 열압착 공정에 사용됩니다.'",
    summaryLabel: '답변',
    summaryEmoji: '\uD83E\uDD16',
  },
];

/* ──────────────────────────────────────────────
   Curriculum mapping data
   ────────────────────────────────────────────── */

const CURRICULUM_MAP = [
  { step: 1, label: '문서', parts: [1], desc: 'Knowledge Graph 기초' },
  { step: 2, label: '설계도', parts: [2], desc: '온톨로지 설계' },
  { step: 3, label: '추출', parts: [3, 4, 5], desc: '데이터 모델링, 추출, 적재' },
  { step: 4, label: '그래프', parts: [1, 2, 3, 4, 5], desc: 'Part 1~5 전체' },
  { step: 5, label: '검색', parts: [6], desc: 'Text2Cypher + 검색' },
  { step: 6, label: '답변', parts: [6, 7], desc: 'RAG 통합 + 평가' },
];

/* ──────────────────────────────────────────────
   Comparison table data
   ────────────────────────────────────────────── */

interface ComparisonRow {
  label: string;
  vector: string;
  vectorStatus: 'pass' | 'warn' | 'fail' | 'normal';
  graph: string;
  graphStatus: 'pass' | 'warn' | 'fail' | 'normal';
}

const COMPARISON: ComparisonRow[] = [
  { label: '비유', vector: '도서관 사서', vectorStatus: 'normal', graph: '형사', graphStatus: 'normal' },
  { label: '방식', vector: '비슷한 문서 찾기', vectorStatus: 'normal', graph: '관계 추적', graphStatus: 'normal' },
  { label: '1-hop 질문', vector: '\u2705 정확', vectorStatus: 'pass', graph: '\u2705 정확', graphStatus: 'pass' },
  { label: '2-hop 질문', vector: '\u26A0\uFE0F 불확실', vectorStatus: 'warn', graph: '\u2705 정확', graphStatus: 'pass' },
  { label: '3-hop 질문', vector: '\u274C 불가능', vectorStatus: 'fail', graph: '\u2705 정확', graphStatus: 'pass' },
  { label: '대표 질문', vector: '"이게 뭐야?"', vectorStatus: 'normal', graph: '"이게 왜 생겼어?"', graphStatus: 'normal' },
];

/* ──────────────────────────────────────────────
   Page Component
   ────────────────────────────────────────────── */

export default function OverviewPage() {
  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* ─── Hero ─── */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_40%,rgba(14,165,233,0.06)_0%,transparent_55%),radial-gradient(ellipse_at_80%_60%,rgba(59,130,246,0.05)_0%,transparent_55%),radial-gradient(ellipse_at_50%_90%,rgba(139,92,246,0.04)_0%,transparent_50%)]" />
        {/* Subtle noise texture via repeating pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
            backgroundSize: '200px 200px',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', color: '#0284c7' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#0ea5e9' }} />
            6단계 파이프라인 인포그래픽
          </div>

          <h1
            className="text-4xl md:text-6xl font-black mb-4 gradient-text"
            style={{ fontFamily: 'var(--font-title)', lineHeight: 1.1 }}
          >
            GraphRAG 파이프라인
          </h1>

          <p className="text-xl md:text-2xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            6단계로 이해하는 전체 흐름
          </p>

          <p className="text-lg mb-0" style={{ color: 'var(--text-dim)' }}>
            문서에서 시작해서 AI 답변까지 -- 한 눈에 보는 GraphRAG
          </p>
        </div>
      </section>

      {/* ─── The Problem ─── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold mb-8 text-center"
            style={{ fontFamily: 'var(--font-title)', color: 'var(--text-primary)' }}
          >
            왜 GraphRAG가 필요한가?
          </h2>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'var(--bg-card)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04), inset 0 0 0 1px var(--border)',
            }}
          >
            {/* Question banner */}
            <div
              className="px-6 py-4 flex items-start gap-3"
              style={{
                background: 'linear-gradient(135deg, rgba(14,165,233,0.06) 0%, rgba(59,130,246,0.04) 100%)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <MessageSquare className="w-5 h-5 mt-0.5 shrink-0" style={{ color: '#0ea5e9' }} />
              <p className="text-base font-semibold" style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}>
                &quot;접착 박리 결함의 원인 설비는 뭐고, 그 설비를 사용하는 공정의 원자재는?&quot;
              </p>
            </div>

            {/* Document trail */}
            <div className="px-6 py-5 space-y-2" style={{ borderBottom: '1px solid var(--border)' }}>
              <p className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: 'var(--text-dim)' }}>
                4개 문서에 답이 흩어져 있다
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { doc: '품질보고서', fact: '접착 박리 = Critical' },
                  { doc: '검사기록', fact: '전단강도 시험에서 발견' },
                  { doc: '공정매뉴얼', fact: '전단강도 시험 = 열압착 검증' },
                  { doc: '설비대장', fact: '열압착 = HP-01 사용' },
                ].map((item) => (
                  <div
                    key={item.doc}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                    style={{ background: 'var(--bg-secondary)' }}
                  >
                    <FileText className="w-4 h-4 shrink-0" style={{ color: '#64748b' }} />
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.doc}</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" style={{ color: '#cbd5e1' }} />
                    <span style={{ color: 'var(--text-dim)' }}>{item.fact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verdict */}
            <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)' }}>
                <XCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: '#ef4444' }} />
                <div>
                  <p className="text-sm font-bold mb-1" style={{ color: '#dc2626' }}>ChatGPT (Vector RAG)</p>
                  <p className="text-sm" style={{ color: '#64748b' }}>4개 문서를 연결할 수 없음</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)' }}>
                <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: '#10b981' }} />
                <div>
                  <p className="text-sm font-bold mb-1" style={{ color: '#059669' }}>GraphRAG</p>
                  <p className="text-sm" style={{ color: '#64748b' }}>Cypher 한 줄로 3-hop 추적</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pipeline: 6 Steps ─── */}
      <section className="py-16 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold mb-3 text-center"
            style={{ fontFamily: 'var(--font-title)', color: 'var(--text-primary)' }}
          >
            GraphRAG 파이프라인 6단계
          </h2>
          <p className="text-center mb-12" style={{ color: 'var(--text-dim)' }}>
            각 단계를 클릭하면 해당 커리큘럼으로 이동합니다
          </p>

          {/* ── Horizontal pipeline (desktop) ── */}
          <div className="hidden lg:block">
            {/* Connecting track line */}
            <div className="relative mb-6">
              <div
                className="absolute top-1/2 left-[calc(8.33%+24px)] right-[calc(8.33%+24px)] h-0.5 -translate-y-1/2"
                style={{
                  background: 'linear-gradient(90deg, #64748b 0%, #0ea5e9 20%, #3b82f6 40%, #8b5cf6 55%, #f59e0b 75%, #10b981 100%)',
                  opacity: 0.35,
                }}
              />
              <div className="grid grid-cols-6 gap-4">
                {STEPS.map((step) => (
                  <div key={step.num} className="flex justify-center">
                    <div
                      className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
                      style={{
                        background: step.color,
                        boxShadow: `0 4px 14px ${step.colorBorder}`,
                      }}
                    >
                      {step.num}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step cards row */}
            <div className="grid grid-cols-6 gap-4">
              {STEPS.map((step) => (
                <div
                  key={step.num}
                  className="rounded-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                  style={{
                    background: 'var(--bg-card)',
                    borderLeft: `3px solid ${step.color}`,
                    boxShadow: 'var(--shadow-sm), inset 0 0 0 1px var(--border)',
                  }}
                >
                  <div className="p-4 flex-1 flex flex-col">
                    {/* Icon */}
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                      style={{ background: step.colorLight, color: step.color }}
                    >
                      {step.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                      {step.title}
                    </h3>
                    <p className="text-xs font-medium mb-2" style={{ color: step.color }}>
                      {step.subtitle}
                    </p>

                    {/* Explanation */}
                    <p className="text-sm mb-3 flex-1" style={{ color: 'var(--text-dim)', lineHeight: 1.6 }}>
                      {step.explanation}
                    </p>

                    {/* Example block */}
                    <div
                      className="p-2.5 rounded-lg text-xs leading-relaxed"
                      style={{
                        background: 'var(--bg-code)',
                        fontFamily: 'var(--font-code)',
                        color: 'var(--text-secondary)',
                        wordBreak: 'break-all',
                      }}
                    >
                      {step.example}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Vertical pipeline (mobile/tablet) ── */}
          <div className="lg:hidden space-y-0">
            {STEPS.map((step, idx) => (
              <div key={step.num}>
                <div className="flex gap-4">
                  {/* Left rail: number + connector line */}
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base shadow-md shrink-0"
                      style={{
                        background: step.color,
                        boxShadow: `0 4px 12px ${step.colorBorder}`,
                      }}
                    >
                      {step.num}
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className="w-0.5 flex-1 my-1" style={{ background: 'var(--border)' }} />
                    )}
                  </div>

                  {/* Right: card */}
                  <div
                    className="flex-1 rounded-xl mb-4"
                    style={{
                      background: 'var(--bg-card)',
                      borderLeft: `3px solid ${step.color}`,
                      boxShadow: 'var(--shadow-sm), inset 0 0 0 1px var(--border)',
                    }}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: step.colorLight, color: step.color }}
                        >
                          {step.icon}
                        </div>
                        <div>
                          <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                            {step.title}
                          </h3>
                          <p className="text-xs font-medium" style={{ color: step.color }}>
                            {step.subtitle}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm mb-3" style={{ color: 'var(--text-dim)', lineHeight: 1.6 }}>
                        {step.explanation}
                      </p>
                      <div
                        className="p-2.5 rounded-lg text-xs leading-relaxed"
                        style={{
                          background: 'var(--bg-code)',
                          fontFamily: 'var(--font-code)',
                          color: 'var(--text-secondary)',
                          wordBreak: 'break-all',
                        }}
                      >
                        {step.example}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Summary Bar ─── */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-xl font-bold mb-6 text-center"
            style={{ fontFamily: 'var(--font-title)', color: 'var(--text-primary)' }}
          >
            한 줄 요약
          </h2>

          <div
            className="flex items-center justify-between rounded-2xl px-4 py-5 md:px-8"
            style={{
              background: 'linear-gradient(135deg, rgba(14,165,233,0.04) 0%, rgba(139,92,246,0.04) 100%)',
              boxShadow: 'inset 0 0 0 1px var(--border)',
            }}
          >
            {STEPS.map((step, idx) => (
              <div key={step.num} className="flex items-center gap-0">
                {/* Node */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xl md:text-2xl leading-none">{step.summaryEmoji}</span>
                  <span
                    className="text-[10px] md:text-xs font-semibold whitespace-nowrap"
                    style={{ color: step.color }}
                  >
                    {step.summaryLabel}
                  </span>
                </div>

                {/* Arrow (not after last) */}
                {idx < STEPS.length - 1 && (
                  <>
                    {/* Desktop arrow */}
                    <ArrowRight
                      className="hidden sm:block w-4 h-4 mx-1 md:mx-3 shrink-0"
                      style={{ color: '#cbd5e1' }}
                    />
                    {/* Mobile arrow */}
                    <ChevronRight
                      className="sm:hidden w-3 h-3 mx-0.5 shrink-0"
                      style={{ color: '#cbd5e1' }}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Vector RAG vs GraphRAG ─── */}
      <section className="py-16 px-6" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold mb-3 text-center"
            style={{ fontFamily: 'var(--font-title)', color: 'var(--text-primary)' }}
          >
            Vector RAG vs GraphRAG
          </h2>
          <p className="text-center mb-8" style={{ color: 'var(--text-dim)' }}>
            1-hop이면 벡터로 충분. Multi-hop이 필요할 때 GraphRAG의 가치가 드러난다
          </p>

          <div
            className="rounded-2xl overflow-hidden"
            style={{ boxShadow: 'var(--shadow-sm), inset 0 0 0 1px var(--border)' }}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th
                    className="px-4 md:px-6 py-3.5 text-left text-xs font-semibold tracking-wider uppercase"
                    style={{ background: 'var(--bg-secondary)', color: 'var(--text-dim)', borderBottom: '1px solid var(--border)' }}
                  >
                    비교 항목
                  </th>
                  <th
                    className="px-4 md:px-6 py-3.5 text-left text-xs font-semibold tracking-wider uppercase"
                    style={{ background: 'var(--bg-secondary)', color: '#64748b', borderBottom: '1px solid var(--border)' }}
                  >
                    Vector RAG
                  </th>
                  <th
                    className="px-4 md:px-6 py-3.5 text-left text-xs font-semibold tracking-wider uppercase"
                    style={{ background: 'rgba(14,165,233,0.06)', color: '#0284c7', borderBottom: '1px solid var(--border)' }}
                  >
                    GraphRAG
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, idx) => (
                  <tr
                    key={row.label}
                    style={{
                      borderBottom: idx < COMPARISON.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    <td className="px-4 md:px-6 py-3 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {row.label}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-sm" style={{ color: statusColor(row.vectorStatus) }}>
                      {row.vector}
                    </td>
                    <td
                      className="px-4 md:px-6 py-3 text-sm font-medium"
                      style={{ color: statusColor(row.graphStatus), background: 'rgba(14,165,233,0.02)' }}
                    >
                      {row.graph}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── Curriculum Mapping ─── */}
      <section className="py-16 px-6" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold mb-3 text-center"
            style={{ fontFamily: 'var(--font-title)', color: 'var(--text-primary)' }}
          >
            커리큘럼 매핑
          </h2>
          <p className="text-center mb-10" style={{ color: 'var(--text-dim)' }}>
            6단계 파이프라인이 어떤 Part에서 다뤄지는지 확인하세요
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CURRICULUM_MAP.map((item) => {
              const step = STEPS[item.step - 1];
              return (
                <div
                  key={item.step}
                  className="rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: 'var(--bg-card)',
                    borderLeft: `3px solid ${step.color}`,
                    boxShadow: 'var(--shadow-sm), inset 0 0 0 1px var(--border)',
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: step.color }}
                    >
                      {item.step}
                    </div>
                    <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      STEP {item.step}: {item.label}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm mb-3" style={{ color: 'var(--text-dim)' }}>
                    {item.desc}
                  </p>

                  {/* Part links */}
                  <div className="flex flex-wrap gap-2">
                    {item.parts.map((part) => (
                      <Link
                        key={part}
                        href={`/curriculum/part${part}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors hover:opacity-80"
                        style={{
                          background: step.colorLight,
                          color: step.color,
                        }}
                      >
                        Part {part}
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 px-6 text-center" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-title)', color: 'var(--text-primary)' }}
          >
            이제 직접 만들어보세요
          </h2>
          <p className="text-lg mb-8" style={{ color: 'var(--text-dim)' }}>
            6단계 파이프라인을 따라 GraphRAG 시스템을 구축해 보세요
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/curriculum"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)' }}
            >
              커리큘럼 시작하기
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/cases/manufacturing"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 hover:scale-105 ring-card"
              style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}
            >
              제조 케이스 보기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Utility
   ────────────────────────────────────────────── */

function statusColor(status: 'pass' | 'warn' | 'fail' | 'normal'): string {
  switch (status) {
    case 'pass':
      return '#0ea5e9';
    case 'warn':
      return '#f59e0b';
    case 'fail':
      return '#ef4444';
    default:
      return '#475569';
  }
}
