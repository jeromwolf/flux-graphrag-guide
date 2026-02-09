'use client';

import { useState } from 'react';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import dynamic from 'next/dynamic';
import { Target, Puzzle, Wrench, Zap, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';

const guideComponents: Record<string, React.ComponentType> = {
  'graphrag-decision': dynamic(() => import('@/components/guides/GraphragDecisionGuide')),
  'ontology-design': dynamic(() => import('@/components/guides/OntologyDesignGuide')),
  'text2cypher': dynamic(() => import('@/components/guides/Text2CypherGuide')),
  'neo4j-optimization': dynamic(() => import('@/components/guides/Neo4jOptimizationGuide')),
  'ragas-evaluation': dynamic(() => import('@/components/guides/RagasEvaluationGuide')),
};

const guideIcons: Record<string, React.ReactNode> = {
  'graphrag-decision': <Target className="w-7 h-7 text-sky-500" />,
  'ontology-design': <Puzzle className="w-7 h-7 text-sky-500" />,
  'text2cypher': <Wrench className="w-7 h-7 text-sky-500" />,
  'neo4j-optimization': <Zap className="w-7 h-7 text-sky-500" />,
  'ragas-evaluation': <BarChart3 className="w-7 h-7 text-sky-500" />,
};

interface Guide {
  slug: string;
  title: string;
  description: string;
  difficulty: number;
  readingTime: string;
  sections: string[];
  status: 'ready' | 'preparing';
}

const guides: Guide[] = [
  {
    slug: 'graphrag-decision',
    title: 'GraphRAG 도입 판단 가이드',
    description: '도입 5단계 프로세스, 1-hop 기준, ROI 판단',
    difficulty: 2,
    readingTime: '10분',
    sections: [
      '1-hop vs Multi-hop 판단 기준',
      '도입 결정 5단계 체크리스트',
      '비용 대비 효과 계산법',
      'GraphRAG가 필요 없는 케이스',
    ],
    status: 'ready',
  },
  {
    slug: 'ontology-design',
    title: '온톨로지 설계 패턴 + Prefix 9가지',
    description: '관계 설계의 정석, Meta-Dictionary 만들기',
    difficulty: 4,
    readingTime: '25분',
    sections: [
      '9가지 관계 설계 패턴',
      'Prefix 표준화 전략',
      'Meta-Dictionary 구조',
      '도메인별 온톨로지 템플릿',
    ],
    status: 'ready',
  },
  {
    slug: 'text2cypher',
    title: 'Text2Cypher 삽질 가이드',
    description: '기본 → Agent 단계, 실패 사례와 해결법',
    difficulty: 3,
    readingTime: '20분',
    sections: [
      'Text2Cypher 3단계 진화',
      '실패하는 쿼리 패턴 12가지',
      'Agent 기반 자가 수정',
      'Few-shot 예제 선정법',
    ],
    status: 'ready',
  },
  {
    slug: 'neo4j-optimization',
    title: 'Neo4j 성능 최적화 7가지',
    description: '인덱스, 쿼리 튜닝, 메모리 설정',
    difficulty: 4,
    readingTime: '30분',
    sections: [
      '인덱스 전략 (Composite, Fulltext)',
      'APOC 활용 쿼리 최적화',
      '메모리 튜닝 공식',
      '대용량 그래프 처리 패턴',
    ],
    status: 'ready',
  },
  {
    slug: 'ragas-evaluation',
    title: 'RAGAS 평가 방법론',
    description: 'Multi-hop + Common Knowledge 메트릭',
    difficulty: 3,
    readingTime: '18분',
    sections: [
      'RAGAS 메트릭 이해',
      'Multi-hop 질문 생성',
      'Common Knowledge 필터링',
      '평가 결과 해석과 개선',
    ],
    status: 'ready',
  },
];

export default function GuidesPage() {
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);

  const toggleGuide = (slug: string) => {
    setExpandedGuide(expandedGuide === slug ? null : slug);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black mb-4 gradient-text" style={{ fontFamily: 'var(--font-title)' }}>
          실전 가이드
        </h1>
        <p className="text-slate-700">
          GraphRAG 실무 적용을 위한 핵심 가이드
        </p>
      </div>

      <div className="space-y-6">
        {guides.map((guide) => (
          <div
            key={guide.slug}
            className="rounded-2xl overflow-hidden ring-card bg-white"
          >
            {/* Guide header */}
            <div
              className={`p-6 cursor-pointer transition-colors ${expandedGuide === guide.slug ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
              onClick={() => guide.status === 'ready' && toggleGuide(guide.slug)}
            >
              <div className="flex items-start gap-4">
                {guideIcons[guide.slug]}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">{guide.title}</h3>
                    <DifficultyBadge level={guide.difficulty} />
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                      {guide.readingTime}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">
                    {guide.description}
                  </p>

                  {/* Key sections preview */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {guide.sections.map((section, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 rounded-full bg-sky-50 text-sky-600 border border-sky-100"
                      >
                        {section}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {guide.status === 'preparing' ? (
                    <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-600">
                      준비중
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-sky-50 text-sky-600">
                      {expandedGuide === guide.slug ? (
                        <>접기 <ChevronUp className="w-3 h-3" /></>
                      ) : (
                        <>자세히 보기 <ChevronDown className="w-3 h-3" /></>
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Expandable content */}
            {expandedGuide === guide.slug && guideComponents[guide.slug] && (() => {
              const GuideContent = guideComponents[guide.slug];
              return <GuideContent />;
            })()}
          </div>
        ))}
      </div>
    </div>
  );
}
