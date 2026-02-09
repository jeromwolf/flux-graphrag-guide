'use client';

import { useState } from 'react';
import { GraphViewer, GraphNode, GraphEdge } from '@/components/domain/GraphViewer';
import { CypherRunner, CypherQuery } from '@/components/domain/CypherRunner';

// Graph data from mini_data.json
const nodes: GraphNode[] = [
  { id: 'CMP-001', label: '마찰재', type: 'Component', x: 120, y: 80 },
  { id: 'PRC-001', label: '혼합', type: 'Process', x: 300, y: 80 },
  { id: 'PRC-003', label: '열압착', type: 'Process', x: 480, y: 80 },
  { id: 'PRC-005', label: '연마', type: 'Process', x: 660, y: 80 },
  { id: 'EQP-003', label: 'HP-01', type: 'Equipment', x: 480, y: 250 },
  { id: 'INS-001', label: '전단강도 시험', type: 'Inspection', x: 300, y: 250 },
  { id: 'DEF-001', label: '접착 박리', type: 'Defect', x: 300, y: 400 },
];

const edges: GraphEdge[] = [
  { source: 'PRC-001', target: 'PRC-003', label: 'NEXT' },
  { source: 'PRC-003', target: 'PRC-005', label: 'NEXT' },
  { source: 'PRC-003', target: 'EQP-003', label: 'USES_EQUIPMENT' },
  { source: 'PRC-001', target: 'CMP-001', label: 'USES_MATERIAL' },
  { source: 'DEF-001', target: 'INS-001', label: 'DETECTED_AT' },
  { source: 'DEF-001', target: 'PRC-003', label: 'CAUSED_BY_PROCESS' },
  { source: 'DEF-001', target: 'EQP-003', label: 'CAUSED_BY_EQUIPMENT' },
  { source: 'INS-001', target: 'PRC-003', label: 'INSPECTS' },
];

// Pre-computed query results
const queries: CypherQuery[] = [
  {
    id: 'q0',
    title: '전체 그래프 보기',
    description: '7개 노드와 모든 관계를 시각화합니다.',
    cypher: `MATCH (n)
RETURN n.name AS name, labels(n)[0] AS type
LIMIT 25;`,
    result: {
      columns: ['name', 'type'],
      rows: [
        ['마찰재', 'Component'],
        ['혼합', 'Process'],
        ['열압착', 'Process'],
        ['연마', 'Process'],
        ['HP-01', 'Equipment'],
        ['전단강도 시험', 'Inspection'],
        ['접착 박리', 'Defect'],
      ],
    },
    learningPoint: 'Neo4j Browser에서 그래프 구조를 직관적으로 확인할 수 있습니다.',
  },
  {
    id: 'q1',
    title: '공정 흐름 조회',
    description: '혼합 → 열압착 → 연마 순차 공정 경로를 반환합니다.',
    cypher: `MATCH path = (start:Process)-[:NEXT*]->(end:Process)
WHERE NOT (:Process)-[:NEXT]->(start)
  AND NOT (end)-[:NEXT]->(:Process)
RETURN start.name AS start, end.name AS end, length(path) AS path_length;`,
    result: {
      columns: ['start', 'end', 'path_length'],
      rows: [['혼합', '연마', '2']],
    },
    learningPoint: '순차 관계(NEXT)로 프로세스 체인을 추적할 수 있습니다.',
  },
  {
    id: 'q2',
    title: '근본 원인 분석 (3-hop 추적)',
    description: '접착 박리 결함 → 전단강도 시험 → 열압착 공정 → HP-01 설비',
    cypher: `MATCH (defect:Defect {name: '접착 박리'})
      -[:DETECTED_AT]->(inspection:Inspection)
      -[:INSPECTS]->(process:Process)
      -[:USES_EQUIPMENT]->(equipment:Equipment)
RETURN defect.name AS defect,
       inspection.name AS inspection,
       process.name AS process,
       equipment.name AS equipment;`,
    result: {
      columns: ['defect', 'inspection', 'process', 'equipment'],
      rows: [['접착 박리', '전단강도 시험', '열압착', 'HP-01']],
    },
    learningPoint: '3-hop 그래프 경로로 결함의 근본 원인을 추적합니다.',
  },
  {
    id: 'q3',
    title: '직접 원인 조회',
    description: '결함을 직접 유발한 공정 또는 설비를 찾습니다.',
    cypher: `MATCH (defect:Defect {name: '접착 박리'})
      <-[r:CAUSED_BY_PROCESS|CAUSED_BY_EQUIPMENT]-(cause)
RETURN defect.name AS defect,
       cause.name AS cause,
       type(r) AS cause_type;`,
    result: {
      columns: ['defect', 'cause', 'cause_type'],
      rows: [
        ['접착 박리', '열압착', 'CAUSED_BY_PROCESS'],
        ['접착 박리', 'HP-01', 'CAUSED_BY_EQUIPMENT'],
      ],
    },
    learningPoint: '역방향 관계로 직접 원인을 즉시 파악할 수 있습니다.',
  },
  {
    id: 'q4',
    title: '설비 영향 범위',
    description: 'HP-01 설비가 사용되는 공정과 연관된 결함을 조회합니다.',
    cypher: `MATCH (equipment:Equipment {id: 'EQP-003'})
      <-[:USES_EQUIPMENT]-(process:Process)
      <-[:CAUSED_BY_PROCESS]-(defect:Defect)
RETURN equipment.name AS equipment,
       process.name AS process,
       defect.name AS defect;`,
    result: {
      columns: ['equipment', 'process', 'defect'],
      rows: [['HP-01', '열압착', '접착 박리']],
    },
    learningPoint: '설비 중심으로 영향 범위를 분석할 수 있습니다.',
  },
];

export function ManufacturingStage0Interactive() {
  const [show3Hop, setShow3Hop] = useState(false);

  // 3-hop path: DEF-001 → INS-001 → PRC-003 → EQP-003
  const threeHopPath = ['DEF-001', 'INS-001', 'PRC-003', 'EQP-003'];

  return (
    <div className="space-y-12">
      {/* Interactive Graph */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">그래프 구조 (7개 노드)</h2>
          <button
            onClick={() => setShow3Hop(!show3Hop)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              show3Hop
                ? 'bg-sky-100 border border-sky-500 text-sky-600'
                : 'bg-slate-50 border border-slate-200 text-slate-500'
            }`}
          >
            {show3Hop ? '✓ 3-hop 추적 표시 중' : '3-hop 추적 보기'}
          </button>
        </div>
        <GraphViewer
          nodes={nodes}
          edges={edges}
          highlightPath={show3Hop ? threeHopPath : []}
          height={500}
        />
        {show3Hop && (
          <div className="mt-4 p-4 rounded-lg text-sm bg-sky-50 border border-sky-200 text-slate-600">
            <strong className="text-sky-600">3-hop 경로:</strong> 접착 박리 (DEF-001) → 전단강도 시험 (INS-001) → 열압착 (PRC-003) → HP-01 (EQP-003)
          </div>
        )}
      </section>

      {/* Interactive Cypher Runner */}
      <section>
        <h2 className="text-2xl font-bold mb-6">데모 쿼리 (5개)</h2>
        <CypherRunner queries={queries} activeQueryId="q2" />
      </section>
    </div>
  );
}
