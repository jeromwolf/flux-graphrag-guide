'use client';

import { useState } from 'react';

// ────────────────────────────────────────────────────────────────
// ManufacturingStage3  -  Stage 3: 서비스급 (5K+ nodes, Part 7)
// Milestone: 배포 가능한 GraphRAG + 품질 대시보드
// ────────────────────────────────────────────────────────────────

export function ManufacturingStage3Interactive() {
  const [activeTab, setActiveTab] = useState<'arch' | 'perf' | 'quality' | 'gdbms' | 'ops' | 'next'>('arch');

  const tabs = [
    { id: 'arch' as const, label: '프로덕션 아키텍처' },
    { id: 'perf' as const, label: 'Neo4j 최적화' },
    { id: 'quality' as const, label: '품질 대시보드' },
    { id: 'gdbms' as const, label: 'GDBMS 가이드' },
    { id: 'ops' as const, label: '운영 체크리스트' },
    { id: 'next' as const, label: '다음 단계' },
  ];

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div
        className="flex flex-wrap gap-2 p-2 rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: activeTab === tab.id ? 'rgba(14,165,233,0.15)' : 'transparent',
              border: activeTab === tab.id ? '1px solid var(--accent-cyan)' : '1px solid transparent',
              color: activeTab === tab.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'arch' && <ProductionArchitecture />}
      {activeTab === 'perf' && <Neo4jOptimization />}
      {activeTab === 'quality' && <QualityDashboard />}
      {activeTab === 'gdbms' && <GDBMSGuide />}
      {activeTab === 'ops' && <OperationsChecklist />}
      {activeTab === 'next' && <NextSteps />}
    </div>
  );
}

/* ================================================================
   1. 프로덕션 아키텍처
   ================================================================ */
function ProductionArchitecture() {
  return (
    <section className="space-y-8">
      <SectionTitle title="프로덕션 아키텍처" subtitle="서비스급 GraphRAG 시스템 구성" />

      {/* 시스템 규모 */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard label="노드 수" value="5,000+" accent="var(--accent-cyan)" />
        <MetricCard label="관계 수" value="12,000+" accent="var(--accent-blue)" />
        <MetricCard label="일일 신규 데이터" value="100건+" accent="var(--accent-purple)" />
      </div>

      {/* 전체 시스템 구성도 */}
      <div
        className="p-6 rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)' }}
      >
        <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--accent-cyan)' }}>
          전체 시스템 구성도
        </h3>

        <div className="space-y-4">
          <ArchLayer
            label="프레젠테이션 레이어"
            color="var(--accent-purple)"
            items={['Streamlit 대시보드', 'REST API (FastAPI)', '관리자 콘솔']}
          />
          <LayerArrow />
          <ArchLayer
            label="서비스 레이어"
            color="var(--accent-cyan)"
            items={['Text2Cypher Agent', '하이브리드 검색 엔진', '품질 모니터링']}
          />
          <LayerArrow />
          <ArchLayer
            label="저장 레이어"
            color="var(--accent-blue)"
            items={['Neo4j (그래프 DB)', 'Qdrant (벡터 DB)', 'PostgreSQL (메타데이터)']}
          />
          <LayerArrow />
          <ArchLayer
            label="처리 레이어"
            color="var(--accent-orange)"
            items={['LLM 추출 파이프라인', 'Entity Resolution (ER)', '멀티모달 처리']}
          />
          <LayerArrow />
          <ArchLayer
            label="데이터 수집 레이어"
            color="var(--accent-red)"
            items={['MES (제조실행시스템)', 'ERP (전사자원관리)', 'IoT 센서 데이터']}
          />
        </div>
      </div>

      {/* 레이어 상세 */}
      <div className="grid md:grid-cols-2 gap-6">
        <DetailCard
          title="데이터 수집"
          color="var(--accent-red)"
          items={[
            'MES: 공정 이력, 설비 가동 로그, 품질 검사 결과',
            'ERP: 자재 BOM, 작업 지시, 생산 계획',
            'IoT: 온도/압력/진동 실시간 센서 데이터',
            'Kafka 기반 스트리밍 파이프라인',
          ]}
        />
        <DetailCard
          title="처리 파이프라인"
          color="var(--accent-orange)"
          items={[
            'LLM 기반 엔티티/관계 자동 추출',
            'Entity Resolution: 동일 엔티티 병합',
            '멀티모달: 이미지(불량 사진) + 텍스트',
            '배치(야간) + 실시간(알림) 이중 처리',
          ]}
        />
        <DetailCard
          title="저장소 구성"
          color="var(--accent-blue)"
          items={[
            'Neo4j: 엔티티 그래프 (구조적 질의)',
            'Qdrant: 청크 임베딩 (시맨틱 검색)',
            'PostgreSQL: 사용자/로그/메타데이터',
            '일일 백업 + 7일 보존 정책',
          ]}
        />
        <DetailCard
          title="서비스 엔드포인트"
          color="var(--accent-cyan)"
          items={[
            'Text2Cypher: 자연어 → Cypher 변환',
            '하이브리드 검색: 그래프 + 벡터 결합',
            '품질 대시보드: RAGAS 메트릭 실시간 표시',
            'API Rate Limiting: 분당 60회',
          ]}
        />
      </div>
    </section>
  );
}

/* ================================================================
   2. Neo4j 성능 최적화
   ================================================================ */
function Neo4jOptimization() {
  return (
    <section className="space-y-8">
      <SectionTitle title="Neo4j 성능 최적화" subtitle="5K+ 노드 환경에서의 쿼리 최적화 전략" />

      {/* 인덱스 전략 */}
      <div
        className="p-6 rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--accent-cyan)' }}>
          인덱스 전략
        </h3>
        <div className="space-y-4">
          <CodeBlock
            title="Composite Index"
            code={`// 복합 인덱스: 다중 속성 검색 최적화
CREATE INDEX idx_process_line_date
FOR (p:Process) ON (p.line_id, p.date);

CREATE INDEX idx_defect_type_severity
FOR (d:Defect) ON (d.type, d.severity);`}
          />
          <CodeBlock
            title="Fulltext Index"
            code={`// 전문 검색 인덱스: 한국어 텍스트 검색
CREATE FULLTEXT INDEX ft_description
FOR (n:Process|Defect|Equipment)
ON EACH [n.description, n.name];

// 사용 예시
CALL db.index.fulltext.queryNodes(
  'ft_description', '열압착 온도 이상'
) YIELD node, score
RETURN node.name, score
ORDER BY score DESC LIMIT 10;`}
          />
        </div>
      </div>

      {/* 쿼리 최적화 */}
      <div
        className="p-6 rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--accent-blue)' }}>
          쿼리 최적화: APOC 활용
        </h3>
        <div className="space-y-4">
          <CodeBlock
            title="프로파일링"
            code={`// 쿼리 실행 계획 분석
PROFILE
MATCH (d:Defect)-[:CAUSED_BY_PROCESS]->(p:Process)
      -[:USES_EQUIPMENT]->(e:Equipment)
WHERE d.severity = 'critical'
RETURN d.name, p.name, e.name;`}
          />
          <CodeBlock
            title="배치 처리 (UNWIND + apoc.periodic.iterate)"
            code={`// 대량 데이터 로드 (1000건씩 배치)
CALL apoc.periodic.iterate(
  "UNWIND $batch AS row RETURN row",
  "MERGE (p:Process {id: row.process_id})
   SET p.name = row.name,
       p.line_id = row.line_id,
       p.updated_at = datetime()",
  {batchSize: 1000, parallel: true, params: {batch: $data}}
);`}
          />
        </div>
      </div>

      {/* 메모리 설정 */}
      <div
        className="p-6 rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--accent-purple)' }}>
          메모리 설정 (neo4j.conf)
        </h3>
        <CodeBlock
          title="권장 설정 (5K+ 노드)"
          code={`# 힙 메모리: 초기/최대 4GB
server.memory.heap.initial_size=4g
server.memory.heap.max_size=4g

# 페이지 캐시: 2GB (전체 그래프 메모리 적재)
server.memory.pagecache.size=2g

# 트랜잭션 메모리 제한
db.memory.transaction.total.max=2g

# 쿼리 타임아웃: 30초
db.transaction.timeout=30s`}
        />
      </div>

      {/* 최적화 전후 비교 */}
      <div
        className="p-6 rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)' }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--accent-cyan)' }}>
          최적화 전후 비교
        </h3>
        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>쿼리 유형</th>
                <th style={thStyle}>최적화 전</th>
                <th style={thStyle}>최적화 후</th>
                <th style={thStyle}>개선율</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>전체 노드 스캔</td>
                <td style={{ ...tdStyle, color: 'var(--accent-red)' }}>3,200ms</td>
                <td style={{ ...tdStyle, color: 'var(--accent-cyan)' }}>45ms</td>
                <td style={{ ...tdStyle, color: 'var(--accent-cyan)', fontWeight: 700 }}>98.6%</td>
              </tr>
              <tr>
                <td style={tdStyle}>3-hop 경로 탐색</td>
                <td style={{ ...tdStyle, color: 'var(--accent-red)' }}>890ms</td>
                <td style={{ ...tdStyle, color: 'var(--accent-cyan)' }}>120ms</td>
                <td style={{ ...tdStyle, color: 'var(--accent-cyan)', fontWeight: 700 }}>86.5%</td>
              </tr>
              <tr>
                <td style={tdStyle}>텍스트 검색</td>
                <td style={{ ...tdStyle, color: 'var(--accent-red)' }}>1,500ms</td>
                <td style={{ ...tdStyle, color: 'var(--accent-cyan)' }}>35ms</td>
                <td style={{ ...tdStyle, color: 'var(--accent-cyan)', fontWeight: 700 }}>97.7%</td>
              </tr>
              <tr>
                <td style={tdStyle}>집계 쿼리</td>
                <td style={{ ...tdStyle, color: 'var(--accent-red)' }}>2,100ms</td>
                <td style={{ ...tdStyle, color: 'var(--accent-cyan)' }}>180ms</td>
                <td style={{ ...tdStyle, color: 'var(--accent-cyan)', fontWeight: 700 }}>91.4%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   3. 품질 평가 대시보드
   ================================================================ */
function QualityDashboard() {
  return (
    <section className="space-y-8">
      <SectionTitle title="품질 평가 대시보드" subtitle="RAGAS 메트릭 기반 품질 모니터링" />

      {/* RAGAS Metrics */}
      <div
        className="p-6 rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)' }}
      >
        <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--accent-cyan)' }}>
          RAGAS 메트릭
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <RagasMetric label="Faithfulness" value={0.92} description="답변의 사실 충실도" />
          <RagasMetric label="Answer Relevancy" value={0.88} description="질문 대비 답변 관련성" />
          <RagasMetric label="Context Precision" value={0.85} description="검색 컨텍스트 정밀도" />
          <RagasMetric label="Context Recall" value={0.90} description="컨텍스트 재현율" />
        </div>
      </div>

      {/* Multi-hop 정확도 */}
      <div
        className="p-6 rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--accent-blue)' }}>
          Multi-hop 정확도
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <HopAccuracy hops={1} accuracy={98} />
          <HopAccuracy hops={2} accuracy={94} />
          <HopAccuracy hops={3} accuracy={87} />
          <HopAccuracy hops={4} accuracy={71} />
        </div>
        <div
          className="mt-4 p-3 rounded-lg text-sm"
          style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
        >
          4-hop 이상에서 정확도 하락 관찰. 중간 노드 검증 로직 추가로 개선 가능.
        </div>
      </div>

      {/* 일일 모니터링 체크리스트 */}
      <div
        className="p-6 rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--accent-purple)' }}>
          일일 품질 모니터링 체크리스트
        </h3>
        <div className="space-y-3">
          <ChecklistItem label="RAGAS Faithfulness >= 0.85 확인" />
          <ChecklistItem label="평균 쿼리 응답시간 < 500ms 확인" />
          <ChecklistItem label="신규 엔티티 추출 정확도 샘플링 (20건)" />
          <ChecklistItem label="Entity Resolution 충돌 건수 확인" />
          <ChecklistItem label="3-hop 정확도 회귀 테스트 (5개 시나리오)" />
          <ChecklistItem label="Neo4j 메모리/CPU 사용률 확인" />
          <ChecklistItem label="벡터 DB 인덱스 상태 점검" />
          <ChecklistItem label="에러 로그 리뷰 (LLM 추출 실패 건)" />
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   4. GDBMS 선정 가이드
   ================================================================ */
function GDBMSGuide() {
  return (
    <section className="space-y-8">
      <SectionTitle title="GDBMS 선정 가이드" subtitle="그래프 데이터베이스 비교 및 추천" />

      {/* 비교 테이블 */}
      <div
        className="p-6 rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--accent-cyan)' }}>
          GDBMS 비교
        </h3>
        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>기준</th>
                <th style={thStyle}>Neo4j</th>
                <th style={thStyle}>Amazon Neptune</th>
                <th style={thStyle}>NebulaGraph</th>
                <th style={thStyle}>Memgraph</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdLabelStyle}>쿼리 언어</td>
                <td style={tdStyle}>Cypher</td>
                <td style={tdStyle}>Gremlin / SPARQL</td>
                <td style={tdStyle}>nGQL (Cypher-like)</td>
                <td style={tdStyle}>Cypher</td>
              </tr>
              <tr>
                <td style={tdLabelStyle}>최대 노드 수</td>
                <td style={tdStyle}>수십억</td>
                <td style={tdStyle}>수십억</td>
                <td style={tdStyle}>수천억</td>
                <td style={tdStyle}>수억 (메모리 한도)</td>
              </tr>
              <tr>
                <td style={tdLabelStyle}>가격</td>
                <td style={tdStyle}>Community 무료 / Enterprise 유료</td>
                <td style={tdStyle}>시간당 과금 (AWS)</td>
                <td style={tdStyle}>오픈소스 무료</td>
                <td style={tdStyle}>Community 무료 / Enterprise 유료</td>
              </tr>
              <tr>
                <td style={tdLabelStyle}>한국어 지원</td>
                <td style={{ ...tdStyle, color: 'var(--accent-cyan)' }}>우수 (UTF-8 완전 지원)</td>
                <td style={tdStyle}>양호</td>
                <td style={tdStyle}>양호</td>
                <td style={tdStyle}>양호</td>
              </tr>
              <tr>
                <td style={tdLabelStyle}>커뮤니티</td>
                <td style={{ ...tdStyle, color: 'var(--accent-cyan)' }}>매우 활발</td>
                <td style={tdStyle}>AWS 커뮤니티</td>
                <td style={tdStyle}>성장 중</td>
                <td style={tdStyle}>소규모</td>
              </tr>
              <tr>
                <td style={tdLabelStyle}>GDS (분석)</td>
                <td style={{ ...tdStyle, color: 'var(--accent-cyan)' }}>GDS 라이브러리</td>
                <td style={tdStyle}>Neptune Analytics</td>
                <td style={tdStyle}>내장 알고리즘</td>
                <td style={tdStyle}>MAGE</td>
              </tr>
              <tr>
                <td style={tdLabelStyle}>학습 곡선</td>
                <td style={{ ...tdStyle, color: 'var(--accent-cyan)' }}>낮음</td>
                <td style={tdStyle}>중간</td>
                <td style={tdStyle}>중간</td>
                <td style={tdStyle}>낮음</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 결론 */}
      <div className="grid md:grid-cols-2 gap-6">
        <div
          className="p-6 rounded-xl"
          style={{
            background: 'rgba(14,165,233,0.05)',
            border: '1px solid rgba(14,165,233,0.3)',
          }}
        >
          <h4 className="font-bold mb-3" style={{ color: 'var(--accent-cyan)' }}>
            교육 / PoC 환경
          </h4>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Neo4j Community Edition</strong> 추천
          </p>
          <ul className="space-y-1 text-sm" style={{ color: 'var(--text-dim)' }}>
            <li>- Cypher 학습 자료 풍부</li>
            <li>- 무료 사용 가능</li>
            <li>- Desktop / Docker 간편 설치</li>
            <li>- 커뮤니티 지원 활발</li>
          </ul>
        </div>

        <div
          className="p-6 rounded-xl"
          style={{
            background: 'rgba(164,90,212,0.05)',
            border: '1px solid rgba(164,90,212,0.3)',
          }}
        >
          <h4 className="font-bold mb-3" style={{ color: 'var(--accent-purple)' }}>
            프로덕션 환경
          </h4>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Neo4j Enterprise</strong> 또는{' '}
            <strong style={{ color: 'var(--text-primary)' }}>NebulaGraph</strong>
          </p>
          <ul className="space-y-1 text-sm" style={{ color: 'var(--text-dim)' }}>
            <li>- 클러스터링 / HA 지원</li>
            <li>- 대규모 스케일링 가능</li>
            <li>- 엔터프라이즈 보안 (RBAC)</li>
            <li>- 기술 지원 SLA</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   5. 운영 체크리스트
   ================================================================ */
function OperationsChecklist() {
  return (
    <section className="space-y-8">
      <SectionTitle title="운영 체크리스트" subtitle="배포 전 점검, 모니터링, CI/CD" />

      {/* 배포 전 체크리스트 */}
      <div
        className="p-6 rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)' }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--accent-cyan)' }}>
          배포 전 체크리스트 (10개 항목)
        </h3>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
          <NumberedItem n={1} text="스키마 마이그레이션 스크립트 검증" />
          <NumberedItem n={2} text="인덱스 생성 완료 확인" />
          <NumberedItem n={3} text="RAGAS 전체 메트릭 >= 0.80 통과" />
          <NumberedItem n={4} text="3-hop 쿼리 응답시간 < 200ms" />
          <NumberedItem n={5} text="백업/복원 절차 테스트" />
          <NumberedItem n={6} text="API 인증/인가 설정" />
          <NumberedItem n={7} text="Rate Limiting 적용" />
          <NumberedItem n={8} text="로그 수집 파이프라인 연결" />
          <NumberedItem n={9} text="알림 채널 설정 (Slack / Email)" />
          <NumberedItem n={10} text="롤백 절차 문서화" />
        </div>
      </div>

      {/* 모니터링 */}
      <div
        className="p-6 rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--accent-blue)' }}>
          모니터링 지표
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <MonitorCard
            title="쿼리 응답시간"
            target="P95 < 500ms"
            alert="P95 > 1,000ms"
            color="var(--accent-cyan)"
          />
          <MonitorCard
            title="노드 증가율"
            target="일 100건 이내"
            alert="일 500건 초과"
            color="var(--accent-blue)"
          />
          <MonitorCard
            title="메모리 사용량"
            target="힙 < 80%"
            alert="힙 > 90%"
            color="var(--accent-purple)"
          />
        </div>
      </div>

      {/* CI/CD */}
      <div
        className="p-6 rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--accent-orange)' }}>
          CI/CD 파이프라인
        </h3>
        <div className="space-y-4">
          <CodeBlock
            title="GitHub Actions 예시"
            code={`name: GraphRAG CI
on: [push, pull_request]

jobs:
  schema-migration:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Start Neo4j
        run: docker compose up -d neo4j
      - name: Run migration
        run: python scripts/migrate_schema.py
      - name: Validate schema
        run: python scripts/validate_schema.py

  quality-gate:
    needs: schema-migration
    runs-on: ubuntu-latest
    steps:
      - name: Run RAGAS evaluation
        run: python scripts/run_ragas.py
      - name: Check thresholds
        run: |
          python -c "
          import json
          r = json.load(open('ragas_results.json'))
          assert r['faithfulness'] >= 0.80
          assert r['answer_relevancy'] >= 0.80
          print('Quality gate PASSED')
          "`}
          />
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <PipelineStage stage="스키마 마이그레이션" desc="Cypher DDL 자동 적용" color="var(--accent-cyan)" />
            <PipelineStage stage="자동 테스트" desc="3-hop 쿼리 + 응답 검증" color="var(--accent-blue)" />
            <PipelineStage stage="품질 게이트" desc="RAGAS >= 0.80 통과 시 배포" color="var(--accent-purple)" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   6. 다음 단계
   ================================================================ */
function NextSteps() {
  return (
    <section className="space-y-8">
      <SectionTitle title="다음 단계" subtitle="Stage 3 이후의 여정" />

      {/* 금융 도메인 확장 */}
      <div
        className="p-6 rounded-xl"
        style={{
          background: 'rgba(14,165,233,0.05)',
          border: '1px solid var(--border-glow)',
        }}
      >
        <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--accent-cyan)' }}>
          금융 도메인 확장 예고
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          제조 도메인에서 검증된 GraphRAG 패턴을 금융 도메인으로 확장합니다.
          규제 준수, 거래 네트워크 분석, 리스크 관계 추적 등 금융 특화 시나리오를 다룹니다.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <PreviewCard title="규제 준수 그래프" desc="금융 규제 → 준수 요건 → 부서 매핑" />
          <PreviewCard title="거래 네트워크" desc="계좌 → 거래 → 이상 탐지 패턴" />
          <PreviewCard title="리스크 전파" desc="기업 → 신용 → 연쇄 리스크 추적" />
        </div>
      </div>

      {/* 커뮤니티 참여 */}
      <div
        className="p-6 rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--accent-purple)' }}>
          커뮤니티 참여 방법
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <CommunityItem
            title="GitHub 저장소"
            desc="이슈 등록, PR 기여, 스타 부탁드립니다"
            color="var(--accent-cyan)"
          />
          <CommunityItem
            title="디스코드 채널"
            desc="실시간 질문, 학습 자료 공유, 네트워킹"
            color="var(--accent-blue)"
          />
          <CommunityItem
            title="블로그 기고"
            desc="학습 경험, 적용 사례 공유 환영"
            color="var(--accent-purple)"
          />
          <CommunityItem
            title="밋업 / 세미나"
            desc="오프라인 모임, 발표 기회 제공"
            color="var(--accent-orange)"
          />
        </div>
      </div>

      {/* 피드백 */}
      <div
        className="p-6 rounded-xl text-center"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-glow)',
        }}
      >
        <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--accent-cyan)' }}>
          피드백을 보내주세요
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          커리큘럼 개선, 추가 도메인 요청, 버그 리포트 등 모든 피드백을 환영합니다.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <FeedbackBadge label="GitHub Issues" />
          <FeedbackBadge label="Discord #feedback" />
          <FeedbackBadge label="Email" />
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   Shared Sub-Components
   ================================================================ */

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-2">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
    </div>
  );
}

function MetricCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div
      className="p-4 rounded-xl text-center"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <p className="text-2xl font-black" style={{ color: accent }}>{value}</p>
      <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{label}</p>
    </div>
  );
}

function ArchLayer({ label, color, items }: { label: string; color: string; items: string[] }) {
  return (
    <div
      className="p-4 rounded-lg"
      style={{
        background: 'var(--bg-secondary)',
        borderLeft: `3px solid ${color}`,
      }}
    >
      <p className="text-xs font-mono font-bold mb-2" style={{ color }}>{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="text-xs px-2 py-1 rounded"
            style={{ background: 'var(--bg-code)', color: 'var(--text-secondary)' }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function LayerArrow() {
  return (
    <div className="flex justify-center" style={{ color: 'var(--text-dim)' }}>
      <span className="text-lg">|</span>
    </div>
  );
}

function DetailCard({ title, color, items }: { title: string; color: string; items: string[] }) {
  return (
    <div
      className="p-5 rounded-xl"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <h4 className="font-bold mb-3" style={{ color }}>{title}</h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            - {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div>
      <p className="text-xs font-mono mb-2" style={{ color: 'var(--text-dim)' }}>{title}</p>
      <pre
        className="p-4 rounded-lg overflow-x-auto text-xs leading-relaxed"
        style={{
          background: 'var(--bg-code)',
          border: '1px solid var(--border)',
          fontFamily: 'var(--font-code)',
          color: 'var(--text-secondary)',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

function RagasMetric({ label, value, description }: { label: string; value: number; description: string }) {
  const pct = Math.round(value * 100);
  const color = value >= 0.9 ? 'var(--accent-cyan)' : value >= 0.85 ? 'var(--accent-blue)' : 'var(--accent-orange)';

  return (
    <div
      className="p-4 rounded-xl text-center"
      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
    >
      <p className="text-2xl font-black" style={{ color }}>{value.toFixed(2)}</p>
      <p className="text-xs font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>{label}</p>
      <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{description}</p>
      {/* Progress bar */}
      <div className="mt-2 h-1.5 rounded-full" style={{ background: 'var(--bg-code)' }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function HopAccuracy({ hops, accuracy }: { hops: number; accuracy: number }) {
  const color = accuracy >= 90 ? 'var(--accent-cyan)' : accuracy >= 80 ? 'var(--accent-blue)' : 'var(--accent-orange)';
  return (
    <div
      className="p-4 rounded-xl text-center"
      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
    >
      <p className="text-2xl font-black" style={{ color }}>{accuracy}%</p>
      <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{hops}-hop 정확도</p>
    </div>
  );
}

function ChecklistItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-5 h-5 rounded border-2 flex-shrink-0"
        style={{ borderColor: 'var(--accent-cyan)', background: 'transparent' }}
      />
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
    </div>
  );
}

function NumberedItem({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
        style={{
          background: 'rgba(14,165,233,0.15)',
          color: 'var(--accent-cyan)',
          border: '1px solid rgba(14,165,233,0.3)',
        }}
      >
        {n}
      </span>
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{text}</span>
    </div>
  );
}

function MonitorCard({
  title,
  target,
  alert,
  color,
}: {
  title: string;
  target: string;
  alert: string;
  color: string;
}) {
  return (
    <div
      className="p-4 rounded-xl"
      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
    >
      <p className="font-semibold text-sm mb-2" style={{ color }}>{title}</p>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: 'var(--accent-cyan)' }}
          />
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            목표: {target}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: 'var(--accent-red)' }}
          />
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            경고: {alert}
          </span>
        </div>
      </div>
    </div>
  );
}

function PipelineStage({ stage, desc, color }: { stage: string; desc: string; color: string }) {
  return (
    <div
      className="p-3 rounded-lg text-center"
      style={{ background: 'var(--bg-secondary)', borderTop: `2px solid ${color}` }}
    >
      <p className="text-sm font-semibold" style={{ color }}>{stage}</p>
      <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{desc}</p>
    </div>
  );
}

function PreviewCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div
      className="p-4 rounded-lg"
      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
    >
      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</p>
      <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{desc}</p>
    </div>
  );
}

function CommunityItem({ title, desc, color }: { title: string; desc: string; color: string }) {
  return (
    <div
      className="p-4 rounded-lg"
      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
    >
      <p className="text-sm font-semibold" style={{ color }}>{title}</p>
      <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{desc}</p>
    </div>
  );
}

function FeedbackBadge({ label }: { label: string }) {
  return (
    <span
      className="px-4 py-2 rounded-lg text-sm font-semibold"
      style={{
        background: 'rgba(14,165,233,0.1)',
        border: '1px solid rgba(14,165,233,0.3)',
        color: 'var(--accent-cyan)',
      }}
    >
      {label}
    </span>
  );
}

/* ================================================================
   Shared Table Styles
   ================================================================ */

const thStyle: React.CSSProperties = {
  padding: '10px 12px',
  textAlign: 'left',
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'var(--accent-cyan)',
  borderBottom: '1px solid var(--border)',
  whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: '10px 12px',
  fontSize: '0.8rem',
  color: 'var(--text-secondary)',
  borderBottom: '1px solid var(--border)',
};

const tdLabelStyle: React.CSSProperties = {
  ...tdStyle,
  fontWeight: 600,
  color: 'var(--text-primary)',
  whiteSpace: 'nowrap',
};
