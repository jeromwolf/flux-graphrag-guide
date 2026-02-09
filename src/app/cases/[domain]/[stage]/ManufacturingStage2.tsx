'use client';

import { useState } from 'react';

// ── Section toggle state type ──
type SectionId = 'architecture' | 'text2cypher' | 'hybrid' | 'streamlit' | 'performance';

// ── Pipeline stages data ──
const pipelineStages = [
  { label: '문서 수집', detail: 'PDF, 이미지, CSV', icon: '1', color: 'var(--accent-cyan)' },
  { label: 'LLM 추출', detail: 'GPT-4 / Claude', icon: '2', color: 'var(--accent-blue)' },
  { label: 'Entity Resolution', detail: '1200 → 850 노드', icon: '3', color: 'var(--accent-purple)' },
  { label: 'KG 적재', detail: 'Neo4j + 벡터DB', icon: '4', color: 'var(--accent-orange)' },
];

// ── Text2Cypher evolution data ──
const text2cypherEvolution = [
  {
    stage: '기본 (Zero-shot)',
    successRate: 45,
    description: 'LLM에 스키마만 전달하고 Cypher 생성 요청',
    pros: '설정 간단, 빠른 프로토타입',
    cons: '복잡한 쿼리 실패 빈번',
  },
  {
    stage: 'Few-shot',
    successRate: 72,
    description: '10-20개 예제 쿼리를 프롬프트에 포함',
    pros: '도메인 특화 패턴 학습',
    cons: '프롬프트 길이 제한',
  },
  {
    stage: 'Agent 기반',
    successRate: 88,
    description: 'ReAct Agent가 스키마 탐색 + 쿼리 생성 + 검증',
    pros: '자가 수정, 높은 정확도',
    cons: '응답 시간 증가 (3-5초)',
  },
];

// ── Hybrid search routing data ──
const routingStrategies = [
  {
    questionType: '구조적 질문',
    example: '"HP-01 설비의 결함 이력은?"',
    method: '그래프 검색',
    accuracy: '92%',
    color: 'var(--accent-cyan)',
    icon: '\u{1F4CA}',
  },
  {
    questionType: '비정형 질문',
    example: '"열압착 공정 개선 방안은?"',
    method: '벡터 검색',
    accuracy: '85%',
    color: 'var(--accent-purple)',
    icon: '\u{1F50D}',
  },
  {
    questionType: '복합 질문',
    example: '"HP-01 결함 원인과 유사 사례의 해결책은?"',
    method: '하이브리드',
    accuracy: '78%',
    color: 'var(--accent-orange)',
    icon: '\u{1F504}',
  },
];

// ── Performance metrics ──
const performanceData = [
  { metric: '평균 응답 시간', value: '2.3초', detail: '그래프: 1.2s / 벡터: 0.8s / LLM 합성: 0.3s' },
  { metric: '구조적 질문 정확도', value: '92%', detail: '엔티티/관계 기반 Cypher 질의' },
  { metric: '비정형 질문 정확도', value: '85%', detail: '벡터 유사도 기반 문서 검색' },
  { metric: '복합 질문 정확도', value: '78%', detail: '그래프 + 벡터 결합 질의' },
];

const ragasResults = [
  { metric: 'Faithfulness', score: 0.87, description: '답변이 검색 결과에 충실한 정도' },
  { metric: 'Answer Relevancy', score: 0.91, description: '답변이 질문에 관련된 정도' },
  { metric: 'Context Precision', score: 0.84, description: '검색된 컨텍스트의 정밀도' },
  { metric: 'Context Recall', score: 0.79, description: '필요한 컨텍스트를 모두 검색했는지' },
];

export function ManufacturingStage2Interactive() {
  const [openSection, setOpenSection] = useState<SectionId | null>('architecture');
  const [activeTab, setActiveTab] = useState(0);
  const [demoQuery, setDemoQuery] = useState('지난달 HP-01 설비에서 발생한 결함은?');

  const toggleSection = (id: SectionId) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="space-y-8">
      {/* ── 1. 스케일업 아키텍처 ── */}
      <CollapsibleSection
        id="architecture"
        title="스케일업 아키텍처"
        subtitle="35 노드 → 1,000 노드로의 확장 전략"
        isOpen={openSection === 'architecture'}
        onToggle={() => toggleSection('architecture')}
        accentColor="var(--accent-cyan)"
      >
        {/* Pipeline diagram */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-4 text-slate-500">
            자동 파이프라인
          </h4>
          <div className="flex flex-col md:flex-row items-stretch gap-3">
            {pipelineStages.map((stage, idx) => (
              <div key={idx} className="flex-1 flex items-center gap-3">
                <div
                  className="flex-1 p-4 rounded-xl text-center"
                  style={{
                    background: `${stage.color}10`,
                    border: `1px solid ${stage.color}30`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold"
                    style={{
                      background: `${stage.color}20`,
                      color: stage.color,
                      border: `2px solid ${stage.color}`,
                    }}
                  >
                    {stage.icon}
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {stage.label}
                  </div>
                  <div className="text-xs mt-1 text-slate-500">
                    {stage.detail}
                  </div>
                </div>
                {idx < pipelineStages.length - 1 && (
                  <span className="hidden md:block text-lg flex-shrink-0 text-slate-500">
                    &rarr;
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Key scaling strategies */}
        <div className="grid md:grid-cols-3 gap-4">
          <ScaleCard
            title="Entity Resolution"
            stat="1,200 → 850"
            statLabel="노드 (29% 중복 제거)"
            description="동일 설비의 다양한 표기(HP-01, 열압착기#1, Hot Press 1호)를 하나로 통합. 자카드 유사도 + 속성 매칭 알고리즘 적용."
            color="var(--accent-cyan)"
          />
          <ScaleCard
            title="멀티모달 통합"
            stat="3종"
            statLabel="데이터 소스"
            description="작업 표준서(PDF), 검사 성적서(이미지 OCR), 설비 로그(CSV)를 통합 파이프라인으로 처리하여 KG에 적재."
            color="var(--accent-blue)"
          />
          <ScaleCard
            title="증분 업데이트"
            stat="일 1회"
            statLabel="자동 동기화"
            description="신규 문서 감지 → LLM 추출 → ER → KG 적재를 자동화. 기존 그래프와 충돌 없이 증분 업데이트."
            color="var(--accent-purple)"
          />
        </div>

        <div className="mt-6 p-4 rounded-lg text-sm bg-sky-50 border border-sky-200 text-slate-700">
          <strong className="text-sky-600">스케일 포인트:</strong>{' '}
          노드 수가 5배 이상 증가하면 수작업 관리가 불가능합니다. Entity Resolution과 자동 파이프라인은 프로토타입 단계에서 반드시 구축해야 하는 인프라입니다.
        </div>
      </CollapsibleSection>

      {/* ── 2. Text2Cypher 파이프라인 ── */}
      <CollapsibleSection
        id="text2cypher"
        title="Text2Cypher 파이프라인"
        subtitle="자연어 질문 → Cypher 쿼리 자동 생성"
        isOpen={openSection === 'text2cypher'}
        onToggle={() => toggleSection('text2cypher')}
        accentColor="var(--accent-blue)"
      >
        {/* Evolution tabs */}
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            {text2cypherEvolution.map((evo, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === idx
                    ? 'bg-blue-50 border border-blue-500 text-blue-500'
                    : 'bg-transparent border border-slate-200 text-slate-500'
                }`}
              >
                {evo.stage}
              </button>
            ))}
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900">
                {text2cypherEvolution[activeTab].stage}
              </h4>
              <span
                className="px-3 py-1 rounded-full text-sm font-bold text-blue-500"
                style={{
                  background: `rgba(59,130,246,${text2cypherEvolution[activeTab].successRate / 200})`,
                }}
              >
                성공률 {text2cypherEvolution[activeTab].successRate}%
              </span>
            </div>
            <p className="text-sm mb-3 text-slate-700">
              {text2cypherEvolution[activeTab].description}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg text-sm bg-sky-50 border border-sky-200">
                <span className="font-semibold text-sky-600">
                  장점:
                </span>{' '}
                <span className="text-slate-700">{text2cypherEvolution[activeTab].pros}</span>
              </div>
              <div className="p-3 rounded-lg text-sm bg-red-50 border border-red-200">
                <span className="font-semibold text-red-500">
                  한계:
                </span>{' '}
                <span className="text-slate-700">{text2cypherEvolution[activeTab].cons}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Success rate bar chart */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3 text-slate-500">
            성공률 비교
          </h4>
          <div className="space-y-3">
            {text2cypherEvolution.map((evo, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-xs font-mono w-20 text-right flex-shrink-0 text-slate-700">
                  {evo.stage}
                </span>
                <div className="flex-1 h-7 rounded-full overflow-hidden bg-slate-50">
                  <div
                    className="h-full rounded-full flex items-center justify-end pr-3 text-xs font-bold text-blue-500 transition-all duration-700 ease-out"
                    style={{
                      width: `${evo.successRate}%`,
                      background: `rgba(59,130,246,${0.2 + idx * 0.15})`,
                    }}
                  >
                    {evo.successRate}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Example conversion */}
        <div>
          <h4 className="text-sm font-semibold mb-3 text-slate-500">
            변환 예시
          </h4>
          <div className="rounded-xl overflow-hidden border border-slate-200">
            {/* Natural language input */}
            <div className="p-4 border-b bg-slate-50 border-slate-200">
              <span className="text-xs font-mono text-sky-600">
                자연어 입력
              </span>
              <p className="text-sm mt-1 font-medium text-slate-900">
                &quot;{demoQuery}&quot;
              </p>
            </div>
            {/* Arrow */}
            <div className="flex items-center justify-center py-2 bg-white">
              <span className="text-blue-500">&darr; Text2Cypher &darr;</span>
            </div>
            {/* Cypher output */}
            <div className="p-4 bg-slate-100">
              <span className="text-xs font-mono text-violet-500">
                생성된 Cypher
              </span>
              <pre className="text-sm mt-2 leading-relaxed font-mono text-slate-900">
                <code>
                  <span className="text-violet-500 font-semibold">MATCH</span>{' '}
                  (<span className="text-sky-600">e</span>:<span className="text-amber-600">Equipment</span>{' '}
                  {'{'}<span className="text-amber-700">name: &apos;HP-01&apos;</span>{'}'})
                  {'\n'}  {'<'}-[:<span className="text-amber-600">USES_EQUIPMENT</span>]-
                  (<span className="text-sky-600">p</span>:<span className="text-amber-600">Process</span>)
                  {'\n'}  {'<'}-[:<span className="text-amber-600">CAUSED_BY_PROCESS</span>]-
                  (<span className="text-sky-600">d</span>:<span className="text-amber-600">Defect</span>)
                  {'\n'}<span className="text-violet-500 font-semibold">WHERE</span>{' '}
                  d.detected_date {'>'} date() - duration({'{'}<span className="text-amber-700">months: 1</span>{'}'})
                  {'\n'}<span className="text-violet-500 font-semibold">RETURN</span>{' '}
                  d.name, d.severity, d.detected_date
                  {'\n'}<span className="text-violet-500 font-semibold">ORDER BY</span>{' '}
                  d.detected_date <span className="text-violet-500 font-semibold">DESC</span>;
                </code>
              </pre>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* ── 3. 하이브리드 검색 ── */}
      <CollapsibleSection
        id="hybrid"
        title="하이브리드 검색"
        subtitle="그래프 검색 + 벡터 검색 결합 전략"
        isOpen={openSection === 'hybrid'}
        onToggle={() => toggleSection('hybrid')}
        accentColor="var(--accent-purple)"
      >
        {/* Routing strategy diagram */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-4 text-slate-500">
            질문 라우팅 전략
          </h4>

          {/* Router box */}
          <div className="p-4 rounded-xl mb-4 text-center bg-violet-50 border border-violet-300">
            <div className="text-sm font-semibold text-violet-500">
              질문 분류기 (Query Router)
            </div>
            <div className="text-xs mt-1 text-slate-500">
              LLM이 질문 유형을 분석하여 최적 검색 경로 결정
            </div>
          </div>

          {/* Three routing paths */}
          <div className="grid md:grid-cols-3 gap-4">
            {routingStrategies.map((strategy, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl"
                style={{
                  background: `${strategy.color}08`,
                  border: `1px solid ${strategy.color}25`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">{strategy.icon}</span>
                  <span className="text-sm font-semibold" style={{ color: strategy.color }}>
                    {strategy.questionType}
                  </span>
                </div>
                <p className="text-xs mb-3 text-slate-500">
                  {strategy.example}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      background: `${strategy.color}15`,
                      color: strategy.color,
                    }}
                  >
                    {strategy.method}
                  </span>
                  <span className="text-sm font-bold" style={{ color: strategy.color }}>
                    {strategy.accuracy}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How hybrid works */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
          <h4 className="text-sm font-semibold mb-3 text-slate-500">
            하이브리드 검색 작동 원리
          </h4>
          <div className="space-y-3">
            <HybridStep
              number={1}
              title="질문 분석"
              description="LLM이 질문에서 엔티티(HP-01), 관계(결함 원인), 의도(검색/분석/추천)를 추출"
              color="var(--accent-cyan)"
            />
            <HybridStep
              number={2}
              title="병렬 검색"
              description="그래프 DB(Cypher 쿼리)와 벡터 DB(임베딩 유사도)를 동시에 실행"
              color="var(--accent-blue)"
            />
            <HybridStep
              number={3}
              title="결과 융합"
              description="Reciprocal Rank Fusion(RRF)으로 두 검색 결과를 통합 랭킹"
              color="var(--accent-purple)"
            />
            <HybridStep
              number={4}
              title="답변 생성"
              description="LLM이 통합 컨텍스트로 최종 답변 생성 + 근거 경로 표시"
              color="var(--accent-orange)"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* ── 4. Streamlit 데모 미리보기 ── */}
      <CollapsibleSection
        id="streamlit"
        title="Streamlit 데모 미리보기"
        subtitle="자연어 질의 + 그래프 시각화 인터페이스"
        isOpen={openSection === 'streamlit'}
        onToggle={() => toggleSection('streamlit')}
        accentColor="var(--accent-orange)"
      >
        {/* Mock UI layout */}
        <div className="rounded-xl overflow-hidden border border-slate-200 min-h-[400px]">
          <div className="flex min-h-[400px]">
            {/* Sidebar */}
            <div className="w-64 p-4 border-r flex-shrink-0 bg-slate-50 border-slate-200">
              <div className="text-xs font-semibold mb-3 text-slate-500">
                MANUFACTURING GRAPHRAG
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs mb-1 block text-slate-500">
                    질문 입력
                  </label>
                  <div className="p-2 rounded-lg text-sm bg-white border border-slate-200 text-slate-900">
                    {demoQuery}
                  </div>
                </div>
                <div>
                  <label className="text-xs mb-1 block text-slate-500">
                    검색 모드
                  </label>
                  <div className="space-y-1">
                    {['하이브리드', '그래프만', '벡터만'].map((mode, idx) => (
                      <div
                        key={mode}
                        className={`flex items-center gap-2 text-xs p-1.5 rounded ${
                          idx === 0 ? 'bg-sky-50 text-sky-600' : 'bg-transparent text-slate-500'
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full border ${
                            idx === 0 ? 'border-sky-600 bg-sky-600' : 'border-slate-200 bg-transparent'
                          }`}
                        />
                        {mode}
                      </div>
                    ))}
                  </div>
                </div>
                <button className="w-full py-2 rounded-lg text-sm font-semibold bg-sky-600 text-white">
                  질문하기
                </button>
              </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
              {/* Graph visualization area */}
              <div className="flex-1 p-4 border-b border-slate-200">
                <div className="text-xs font-semibold mb-2 text-slate-500">
                  GRAPH VISUALIZATION
                </div>
                <div className="h-full rounded-lg flex items-center justify-center bg-slate-100 border border-dashed border-slate-200 min-h-[180px]">
                  {/* Simplified graph mockup */}
                  <svg width="300" height="150" viewBox="0 0 300 150">
                    {/* Edges */}
                    <line x1="150" y1="30" x2="70" y2="75" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.6" />
                    <line x1="150" y1="30" x2="230" y2="75" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.6" />
                    <line x1="70" y1="75" x2="110" y2="125" stroke="#ef4444" strokeWidth="2" opacity="0.8" />
                    <line x1="70" y1="75" x2="30" y2="125" stroke="#ef4444" strokeWidth="2" opacity="0.8" />
                    <line x1="230" y1="75" x2="230" y2="125" stroke="#3b82f6" strokeWidth="1.5" opacity="0.6" />

                    {/* Nodes */}
                    <circle cx="150" cy="30" r="16" fill="#0ea5e9" fillOpacity="0.2" stroke="#0ea5e9" strokeWidth="1.5" />
                    <text x="150" y="34" textAnchor="middle" fill="#0f172a" fontSize="10">HP-01</text>

                    <circle cx="70" cy="75" r="16" fill="#0ea5e9" fillOpacity="0.2" stroke="#0ea5e9" strokeWidth="1.5" />
                    <text x="70" y="79" textAnchor="middle" fill="#0f172a" fontSize="9">열압착</text>

                    <circle cx="230" cy="75" r="16" fill="#8b5cf6" fillOpacity="0.2" stroke="#8b5cf6" strokeWidth="1.5" />
                    <text x="230" y="79" textAnchor="middle" fill="#0f172a" fontSize="9">검사</text>

                    <circle cx="30" cy="125" r="14" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="1.5" />
                    <text x="30" y="129" textAnchor="middle" fill="#0f172a" fontSize="8">박리</text>

                    <circle cx="110" cy="125" r="14" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="1.5" />
                    <text x="110" y="129" textAnchor="middle" fill="#0f172a" fontSize="8">기포</text>

                    <circle cx="230" cy="125" r="14" fill="#7dc4a5" fillOpacity="0.2" stroke="#7dc4a5" strokeWidth="1.5" />
                    <text x="230" y="129" textAnchor="middle" fill="#0f172a" fontSize="8">접착제</text>
                  </svg>
                </div>
              </div>

              {/* Answer area */}
              <div className="p-4">
                <div className="text-xs font-semibold mb-2 text-slate-500">
                  ANSWER
                </div>
                <div className="p-3 rounded-lg text-sm bg-slate-50 border border-slate-200 text-slate-700">
                  <p>
                    HP-01 설비에서 지난달 발생한 결함은{' '}
                    <strong className="text-red-500">접착 박리</strong>(Critical)와{' '}
                    <strong className="text-red-500">기포 발생</strong>(Major) 2건입니다.
                    두 결함 모두 <strong className="text-sky-600">열압착 공정</strong>에서
                    발생했으며, 접착제(LOT-2024-C2)의 경화 온도 편차가 주요 원인으로 파악됩니다.
                  </p>
                </div>
                {/* Evidence path */}
                <div className="mt-2 p-2 rounded-lg text-xs bg-sky-50 border border-sky-200 text-slate-500">
                  <span className="text-sky-600">근거 경로:</span>{' '}
                  HP-01 &rarr; 열압착 &rarr; 접착 박리 / 기포 발생 (CAUSED_BY_PROCESS)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo features */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <FeatureCard
            title="자연어 질의"
            description="한국어/영어로 질문하면 Text2Cypher가 자동으로 그래프 쿼리를 생성합니다."
            color="var(--accent-cyan)"
          />
          <FeatureCard
            title="그래프 시각화"
            description="검색 결과를 인터랙티브 그래프로 시각화. 노드 클릭으로 상세 정보 확인."
            color="var(--accent-blue)"
          />
          <FeatureCard
            title="근거 경로 표시"
            description="답변의 근거가 되는 그래프 경로를 하이라이트하여 신뢰성을 보장합니다."
            color="var(--accent-purple)"
          />
        </div>
      </CollapsibleSection>

      {/* ── 5. 성능 메트릭 ── */}
      <CollapsibleSection
        id="performance"
        title="성능 메트릭"
        subtitle="응답 시간, 정확도, RAGAS 평가 결과"
        isOpen={openSection === 'performance'}
        onToggle={() => toggleSection('performance')}
        accentColor="var(--accent-yellow)"
      >
        {/* Key metrics */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {performanceData.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-sm text-slate-700">
                  {item.metric}
                </span>
                <span className="text-xl font-bold text-sky-600">
                  {item.value}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {item.detail}
              </p>
            </div>
          ))}
        </div>

        {/* RAGAS results */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
          <h4 className="text-sm font-semibold mb-4 text-slate-500">
            RAGAS 평가 결과
          </h4>
          <div className="space-y-4">
            {ragasResults.map((item) => (
              <div key={item.metric}>
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="text-sm font-medium text-slate-900">
                      {item.metric}
                    </span>
                    <span className="text-xs ml-2 text-slate-400">
                      {item.description}
                    </span>
                  </div>
                  <span className="text-sm font-bold font-mono text-sky-600">
                    {item.score.toFixed(2)}
                  </span>
                </div>
                <div className="h-3 rounded-full overflow-hidden bg-white">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${item.score * 100}%`,
                      background: item.score >= 0.85
                        ? 'rgba(14,165,233,0.5)'
                        : item.score >= 0.8
                        ? 'rgba(139,92,246,0.5)'
                        : 'rgba(245,158,11,0.5)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 p-5 rounded-xl bg-sky-50 border border-slate-200">
          <p className="text-sm font-semibold mb-2 text-sky-600">
            종합 평가
          </p>
          <p className="text-sm text-slate-700">
            프로토타입 단계에서 <strong className="text-sky-600">구조적 질문 92%</strong> 정확도를 달성했습니다.
            RAGAS Answer Relevancy <strong className="text-sky-600">0.91</strong>은 상용 수준에 근접한 성과입니다.
            Context Recall(<strong className="text-amber-600">0.79</strong>)은 Stage 3에서 커뮤니티 요약 기법을 적용하여 개선할 예정입니다.
          </p>
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
          border: isOpen ? `1px solid ${accentColor}40` : '1px solid var(--border)',
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
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform"
            style={{
              background: `${accentColor}15`,
              color: accentColor,
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </button>
      {isOpen && (
        <div className="mt-2 p-6 rounded-xl bg-white border border-slate-200">
          {children}
        </div>
      )}
    </section>
  );
}

function ScaleCard({
  title,
  stat,
  statLabel,
  description,
  color,
}: {
  title: string;
  stat: string;
  statLabel: string;
  description: string;
  color: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
      <h4 className="text-sm font-semibold mb-2" style={{ color }}>
        {title}
      </h4>
      <div className="mb-2">
        <span className="text-2xl font-bold" style={{ color }}>
          {stat}
        </span>
        <span className="text-xs ml-1 text-slate-500">
          {statLabel}
        </span>
      </div>
      <p className="text-xs text-slate-700">
        {description}
      </p>
    </div>
  );
}

function HybridStep({
  number,
  title,
  description,
  color,
}: {
  number: number;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs"
        style={{
          background: `${color}20`,
          color: color,
          border: `2px solid ${color}`,
        }}
      >
        {number}
      </div>
      <div>
        <span className="text-sm font-semibold" style={{ color }}>
          {title}
        </span>
        <p className="text-sm mt-0.5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  color,
}: {
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div
      className="p-4 rounded-xl"
      style={{
        background: `${color}08`,
        border: `1px solid ${color}20`,
      }}
    >
      <h4 className="text-sm font-semibold mb-2" style={{ color }}>
        {title}
      </h4>
      <p className="text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}
