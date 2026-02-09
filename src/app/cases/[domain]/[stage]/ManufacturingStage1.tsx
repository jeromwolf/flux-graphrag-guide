'use client';

import { useState } from 'react';
import { CypherRunner, CypherQuery } from '@/components/domain/CypherRunner';

// ── Section toggle state type ──
type SectionId = 'ontology' | 'comparison' | 'quality' | 'queries' | 'learning';

// ── Pre-computed query results for 35-node graph ──
const queries: CypherQuery[] = [
  {
    id: 'q0',
    title: '설비별 결함 조회',
    description: '특정 설비(HP-01)에서 발생한 모든 결함을 조회합니다.',
    cypher: `MATCH (e:Equipment {name: 'HP-01'})
  <-[:USES_EQUIPMENT]-(p:Process)
  <-[:CAUSED_BY_PROCESS]-(d:Defect)
RETURN e.name AS equipment,
       p.name AS process,
       d.name AS defect,
       d.severity AS severity;`,
    result: {
      columns: ['equipment', 'process', 'defect', 'severity'],
      rows: [
        ['HP-01', '열압착', '접착 박리', 'Critical'],
        ['HP-01', '열압착', '기포 발생', 'Major'],
        ['HP-01', '열압착', '두께 편차', 'Minor'],
      ],
    },
    learningPoint: '설비를 기점으로 역방향 탐색하면 해당 설비가 유발한 모든 결함을 즉시 확인할 수 있습니다.',
  },
  {
    id: 'q1',
    title: '작업자별 공정 할당',
    description: '각 작업자에게 할당된 공정 목록을 조회합니다.',
    cypher: `MATCH (o:Operator)-[:OPERATES]->(p:Process)
RETURN o.name AS operator,
       o.skill_level AS skill,
       collect(p.name) AS processes,
       count(p) AS process_count
ORDER BY process_count DESC;`,
    result: {
      columns: ['operator', 'skill', 'processes', 'process_count'],
      rows: [
        ['김기사', 'Senior', '열압착, 성형, 코팅', '3'],
        ['이기사', 'Mid', '혼합, 건조', '2'],
        ['박기사', 'Senior', '연마, 검사', '2'],
        ['최기사', 'Junior', '포장', '1'],
      ],
    },
    learningPoint: 'Operator 노드를 추가하면 작업자 역량과 공정 할당을 연계 분석할 수 있습니다.',
  },
  {
    id: 'q2',
    title: '자재-공정-결함 인과 체인',
    description: '자재에서 시작하여 공정을 거쳐 결함까지의 인과 경로를 추적합니다.',
    cypher: `MATCH chain = (m:Material)-[:USED_IN]->(p:Process)
  <-[:CAUSED_BY_PROCESS]-(d:Defect)
RETURN m.name AS material,
       m.lot_no AS lot,
       p.name AS process,
       d.name AS defect
ORDER BY m.name;`,
    result: {
      columns: ['material', 'lot', 'process', 'defect'],
      rows: [
        ['페놀수지', 'LOT-2024-A1', '혼합', '경도 불량'],
        ['마찰분말', 'LOT-2024-B3', '혼합', '밀도 편차'],
        ['접착제', 'LOT-2024-C2', '열압착', '접착 박리'],
        ['철판', 'LOT-2024-D1', '성형', '치수 불량'],
      ],
    },
    learningPoint: 'Material → Process → Defect 3-hop 체인으로 자재 불량이 최종 결함으로 이어지는 경로를 추적합니다.',
  },
  {
    id: 'q3',
    title: '설비 유지보수-결함률 상관',
    description: '설비 유지보수 이력과 결함 발생률의 상관관계를 분석합니다.',
    cypher: `MATCH (e:Equipment)
OPTIONAL MATCH (e)<-[:USES_EQUIPMENT]-(p:Process)
  <-[:CAUSED_BY_PROCESS]-(d:Defect)
RETURN e.name AS equipment,
       e.last_maintenance AS last_maint,
       e.maintenance_cycle AS cycle_days,
       count(d) AS defect_count
ORDER BY defect_count DESC;`,
    result: {
      columns: ['equipment', 'last_maint', 'cycle_days', 'defect_count'],
      rows: [
        ['HP-01', '2024-01-15', '90', '3'],
        ['MX-02', '2024-02-20', '60', '2'],
        ['GR-01', '2024-03-01', '30', '1'],
        ['DR-01', '2024-03-10', '45', '0'],
        ['PK-01', '2024-03-15', '120', '0'],
      ],
    },
    learningPoint: '유지보수 주기가 긴 설비일수록 결함 발생 빈도가 높은 패턴을 그래프에서 직접 확인할 수 있습니다.',
  },
  {
    id: 'q4',
    title: '품질 검사 커버리지',
    description: '각 공정에 대한 검사 커버리지를 분석합니다.',
    cypher: `MATCH (p:Process)
OPTIONAL MATCH (i:Inspection)-[:INSPECTS]->(p)
RETURN p.name AS process,
       count(i) AS inspection_count,
       CASE WHEN count(i) > 0 THEN 'Covered' ELSE 'Uncovered' END AS status
ORDER BY inspection_count;`,
    result: {
      columns: ['process', 'inspection_count', 'status'],
      rows: [
        ['포장', '0', 'Uncovered'],
        ['건조', '0', 'Uncovered'],
        ['코팅', '1', 'Covered'],
        ['혼합', '1', 'Covered'],
        ['성형', '1', 'Covered'],
        ['열압착', '2', 'Covered'],
        ['연마', '1', 'Covered'],
        ['검사', '1', 'Covered'],
      ],
    },
    learningPoint: '검사 커버리지 분석으로 품질 관리 사각지대(포장, 건조)를 발견할 수 있습니다.',
  },
];

// ── Entity count data ──
const entityCounts = [
  { type: 'Process', label: '공정', count: 8, colorClass: 'bg-sky-500', textColorClass: 'text-sky-500' },
  { type: 'Equipment', label: '설비', count: 5, colorClass: 'bg-blue-500', textColorClass: 'text-blue-500' },
  { type: 'Defect', label: '결함', count: 4, colorClass: 'bg-red-500', textColorClass: 'text-red-500' },
  { type: 'Inspection', label: '검사', count: 3, colorClass: 'bg-violet-500', textColorClass: 'text-violet-500' },
  { type: 'Component', label: '부품', count: 6, colorClass: 'bg-amber-600', textColorClass: 'text-amber-600' },
  { type: 'Material', label: '자재', count: 5, colorClass: 'bg-emerald-400', textColorClass: 'text-emerald-400' },
  { type: 'Operator', label: '작업자', count: 4, colorClass: 'bg-amber-700', textColorClass: 'text-amber-700' },
];

// ── Comparison data ──
const comparisonRows = [
  { metric: '노드 수', manual: '35개', llm: '38개' },
  { metric: '관계 수', manual: '52개', llm: '61개' },
  { metric: '정밀도 (Precision)', manual: '95%', llm: '78%' },
  { metric: '소요 시간', manual: '4시간', llm: '15분' },
];

const qualityMetrics = [
  { metric: '정밀도 (Precision)', manual: 95, llm: 78, manualLabel: '95%', llmLabel: '78%' },
  { metric: '재현율 (Recall)', manual: 82, llm: 91, manualLabel: '82%', llmLabel: '91%' },
  { metric: 'F1-Score', manual: 88, llm: 84, manualLabel: '88%', llmLabel: '84%' },
];

export function ManufacturingStage1Interactive() {
  const [openSection, setOpenSection] = useState<SectionId | null>('ontology');

  const toggleSection = (id: SectionId) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="space-y-8">
      {/* ── 1. 확장된 온톨로지 ── */}
      <CollapsibleSection
        id="ontology"
        title="확장된 온톨로지 (35 Nodes)"
        subtitle="7개 엔티티 타입으로 제조 도메인 전체를 모델링"
        isOpen={openSection === 'ontology'}
        onToggle={() => toggleSection('ontology')}
        accentColor="var(--accent-cyan)"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* Entity count table */}
          <div className="p-5 rounded-xl bg-slate-50 ring-card">
            <h4 className="text-sm font-semibold mb-4 text-slate-500">
              엔티티 타입별 노드 수
            </h4>
            <div className="space-y-3">
              {entityCounts.map((entity) => (
                <div key={entity.type} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${entity.colorClass}`} />
                  <span className="text-sm flex-1 text-slate-900">
                    {entity.type} ({entity.label})
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 rounded-full opacity-60 ${entity.colorClass}`}
                      style={{ width: `${(entity.count / 8) * 80}px` }}
                    />
                    <span className={`text-sm font-mono font-semibold w-6 text-right ${entity.textColorClass}`}>
                      {entity.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 flex justify-between text-sm font-semibold border-t border-slate-200 text-slate-900">
              <span>Total</span>
              <span className="text-sky-600">35 nodes</span>
            </div>
          </div>

          {/* Expanded relationship types */}
          <div className="p-5 rounded-xl bg-slate-50 ring-card">
            <h4 className="text-sm font-semibold mb-4 text-slate-500">
              확장된 관계 타입 (12개)
            </h4>
            <div className="space-y-1.5 text-sm text-slate-700">
              <p>
                <span className="text-sky-600">NEXT</span> - 순차 공정
              </p>
              <p>
                <span className="text-sky-600">USES_EQUIPMENT</span> - 장비 사용
              </p>
              <p>
                <span className="text-sky-600">USES_MATERIAL</span> - 자재 사용
              </p>
              <p>
                <span className="text-sky-600">USED_IN</span> - 자재 투입 공정
              </p>
              <p>
                <span className="text-sky-600">CAUSED_BY_PROCESS</span> - 공정 유발
              </p>
              <p>
                <span className="text-sky-600">CAUSED_BY_EQUIPMENT</span> - 장비 유발
              </p>
              <p>
                <span className="text-sky-600">DETECTED_AT</span> - 검출 위치
              </p>
              <p>
                <span className="text-sky-600">INSPECTS</span> - 검사 대상
              </p>
              <p>
                <span className="text-sky-600">OPERATES</span> - 작업자 담당
              </p>
              <p>
                <span className="text-sky-600">PART_OF</span> - 부품 소속
              </p>
              <p>
                <span className="text-sky-600">SUPPLIED_BY</span> - 자재 공급
              </p>
              <p>
                <span className="text-sky-600">MAINTAINS</span> - 설비 유지보수
              </p>
            </div>
          </div>
        </div>

        {/* Stage 0 vs Stage 1 comparison */}
        <div className="mt-6 p-4 rounded-lg text-sm bg-sky-50/60 border border-sky-200 text-slate-700">
          <strong className="text-sky-600">Stage 0 vs Stage 1:</strong>{' '}
          노드 7개 / 관계 7개 / 엔티티 5종 → 노드 35개 / 관계 52개 / 엔티티 7종. 작업자(Operator)와 자재(Material)를 추가하여 인과 분석의 깊이가 크게 향상됩니다.
        </div>
      </CollapsibleSection>

      {/* ── 2. 수작업 vs LLM 추출 비교 ── */}
      <CollapsibleSection
        id="comparison"
        title="수작업 vs LLM 추출 비교"
        subtitle="지식 그래프 구축 방법론 비교 분석"
        isOpen={openSection === 'comparison'}
        onToggle={() => toggleSection('comparison')}
        accentColor="var(--accent-blue)"
      >
        <div className="rounded-xl overflow-hidden ring-card">
          <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                <th className="text-left px-5 py-3 font-semibold bg-slate-50 border-b-2 border-slate-200 text-slate-500">
                  항목
                </th>
                <th className="text-center px-5 py-3 font-semibold bg-sky-50 border-b-2 border-sky-500 text-sky-600">
                  수작업 KG
                </th>
                <th className="text-center px-5 py-3 font-semibold bg-violet-50 border-b-2 border-violet-500 text-violet-500">
                  LLM 자동 추출
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                >
                  <td className="px-5 py-3 font-medium text-slate-900">
                    {row.metric}
                  </td>
                  <td className="px-5 py-3 text-center text-sky-600">
                    {row.manual}
                  </td>
                  <td className="px-5 py-3 text-center text-violet-500">
                    {row.llm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Hallucination warning */}
        <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-start gap-3">
            <span className="text-lg flex-shrink-0" role="img" aria-label="warning">
              &#x26A0;&#xFE0F;
            </span>
            <div>
              <p className="text-sm font-semibold mb-1 text-red-500">
                LLM 환각(Hallucination) 관계 발생
              </p>
              <p className="text-sm text-slate-700">
                LLM이 추출한 61개 관계 중 9개(약 15%)가 원본 문서에 없는 허위 관계입니다.
                예: &quot;연마 공정이 접착제를 사용한다&quot; (실제로는 열압착 공정에서만 사용).
                이는 LLM 추출 후 <strong className="text-amber-600">전문가 검증</strong>이
                필수적임을 보여줍니다.
              </p>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* ── 3. 품질 비교 리포트 ── */}
      <CollapsibleSection
        id="quality"
        title="품질 비교 리포트"
        subtitle="Precision / Recall / F1-Score 정량 비교"
        isOpen={openSection === 'quality'}
        onToggle={() => toggleSection('quality')}
        accentColor="var(--accent-purple)"
      >
        <div className="space-y-5">
          {qualityMetrics.map((m) => (
            <div key={m.metric}>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-slate-900">{m.metric}</span>
              </div>
              {/* Manual bar */}
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-xs font-mono w-14 text-right flex-shrink-0 text-sky-600">
                  수작업
                </span>
                <div className="flex-1 h-6 rounded-full overflow-hidden bg-slate-50">
                  <div
                    className="h-full rounded-full flex items-center justify-end pr-2 text-xs font-semibold bg-sky-500/30 text-sky-600 transition-[width] duration-[800ms] ease-out"
                    style={{ width: `${m.manual}%` }}
                  >
                    {m.manualLabel}
                  </div>
                </div>
              </div>
              {/* LLM bar */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono w-14 text-right flex-shrink-0 text-violet-500">
                  LLM
                </span>
                <div className="flex-1 h-6 rounded-full overflow-hidden bg-slate-50">
                  <div
                    className="h-full rounded-full flex items-center justify-end pr-2 text-xs font-semibold bg-violet-500/30 text-violet-500 transition-[width] duration-[800ms] ease-out"
                    style={{ width: `${m.llm}%` }}
                  >
                    {m.llmLabel}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Conclusion */}
        <div className="mt-6 p-5 rounded-xl bg-sky-50/60 border border-slate-200">
          <p className="text-sm font-semibold mb-2 text-sky-600">
            결론: 최적 전략
          </p>
          <p className="text-sm text-slate-700">
            <strong className="text-amber-600">LLM 추출 후 수작업 정제</strong>가 최적 전략입니다.
            LLM의 높은 재현율(91%)로 빠르게 초안을 생성하고, 전문가가 정밀도를 보완하면
            F1-Score <strong className="text-sky-600">93%</strong> 이상을 달성할 수 있습니다.
            소요 시간은 완전 수작업(4시간) 대비 <strong className="text-sky-600">1.5시간</strong>으로 단축됩니다.
          </p>
        </div>
      </CollapsibleSection>

      {/* ── 4. 확장된 쿼리 ── */}
      <CollapsibleSection
        id="queries"
        title="확장된 쿼리 (5개)"
        subtitle="35-노드 그래프에서 실행하는 분석 쿼리"
        isOpen={openSection === 'queries'}
        onToggle={() => toggleSection('queries')}
        accentColor="var(--accent-orange)"
      >
        <CypherRunner queries={queries} activeQueryId="q2" />
      </CollapsibleSection>

      {/* ── 5. 학습 포인트 ── */}
      <CollapsibleSection
        id="learning"
        title="학습 포인트"
        subtitle="Part 2-3 커리큘럼에서 배우는 핵심 내용"
        isOpen={openSection === 'learning'}
        onToggle={() => toggleSection('learning')}
        accentColor="var(--accent-yellow)"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <LearningCard
            title="Part 2: 온톨로지 설계"
            color="var(--accent-cyan)"
            items={[
              '도메인 전문가 인터뷰 → 엔티티/관계 도출',
              '7종 엔티티 타입의 속성(Property) 정의',
              '관계 방향성과 카디널리티 설계',
              'Schema-first vs Data-first 접근법 비교',
            ]}
          />
          <LearningCard
            title="Part 3: KG 구축 방법론"
            color="var(--accent-blue)"
            items={[
              '수작업 추출: 높은 정밀도, 낮은 확장성',
              'LLM 추출: 높은 재현율, 환각 위험',
              '하이브리드 전략의 실무 적용법',
              '품질 메트릭(Precision/Recall/F1) 측정',
            ]}
          />
          <LearningCard
            title="실무 인사이트"
            color="var(--accent-purple)"
            items={[
              'Operator 노드 추가로 책임 추적 가능',
              'Material lot 연계로 공급망 분석',
              '검사 커버리지 갭 자동 탐지',
              '유지보수-결함률 상관관계 시각화',
            ]}
          />
          <LearningCard
            title="다음 단계 준비"
            color="var(--accent-orange)"
            items={[
              'Stage 2에서 500-1K 노드로 스케일업',
              'Entity Resolution으로 중복 제거',
              'Text2Cypher 자연어 인터페이스 구축',
              'Streamlit 기반 데모 앱 개발',
            ]}
          />
        </div>

        <div className="mt-6 p-4 rounded-lg text-sm bg-amber-50 border border-amber-200 text-slate-700">
          <strong className="text-amber-700">핵심 교훈:</strong>{' '}
          35개 노드 규모에서 수작업과 LLM 추출을 모두 경험하면, 이후 대규모 KG 구축 시 최적의 하이브리드 전략을 수립할 수 있습니다.
          &quot;정밀도는 전문가가, 커버리지는 LLM이&quot; 담당하는 역할 분담이 핵심입니다.
        </div>
      </CollapsibleSection>
    </div>
  );
}

// ── Reusable sub-components ──

function CollapsibleSection({
  id,
  title,
  subtitle,
  isOpen,
  onToggle,
  accentColor,
  children,
}: {
  id: string;
  title: string;
  subtitle: string;
  isOpen: boolean;
  onToggle: () => void;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <button
        onClick={onToggle}
        className={`w-full text-left p-5 rounded-xl transition-all ${
          isOpen ? 'bg-white' : 'bg-slate-50'
        }`}
        style={{
          border: isOpen ? `1px solid ${accentColor}40` : '1px solid rgb(226, 232, 240)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {title}
            </h2>
            <p className="text-sm mt-1 text-slate-500">
              {subtitle}
            </p>
          </div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
            style={{
              background: `${accentColor}15`,
              color: accentColor,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </button>
      {isOpen && (
        <div className="mt-2 p-6 rounded-xl bg-white ring-card">
          {children}
        </div>
      )}
    </section>
  );
}

function LearningCard({
  title,
  color,
  items,
}: {
  title: string;
  color: string;
  items: string[];
}) {
  return (
    <div className="p-5 rounded-xl bg-slate-50 ring-card">
      <h3 className="font-semibold mb-3" style={{ color }}>
        {title}
      </h3>
      <ul className="space-y-2 text-sm text-slate-700">
        {items.map((item, idx) => (
          <li key={idx}>
            <span style={{ color, marginRight: '8px' }}>&#x2022;</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
