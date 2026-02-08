// ============================================================
// 0단계 미니 데모 — Neo4j 적재 스크립트
// Stage 0 Mini Demo — Neo4j Load Script
// ──────────────────────────────────────
// 사용법: Neo4j Browser에 아래 전체를 복사 → 붙여넣기 → 실행
// Usage : Copy all below → Paste in Neo4j Browser → Run
// ============================================================

// ── 기존 데이터 초기화 (Clean Slate) ──
MATCH (n) DETACH DELETE n;

// ============================================================
// 1. 노드 생성 (Create Nodes) — 7개
// ============================================================

// 🔩 원자재 (Component)
CREATE (cmp001:Component {
  component_id: 'CMP-001', 
  name: '마찰재 (Friction Material)'
})

// ⚙️ 공정 (Process) — 3개
CREATE (prc001:Process {
  process_id: 'PRC-001', 
  name: '혼합 (Mixing)'
})
CREATE (prc003:Process {
  process_id: 'PRC-003', 
  name: '열압착 (Hot Press)'
})
CREATE (prc005:Process {
  process_id: 'PRC-005', 
  name: '연마 (Grinding)'
})

// 🏭 설비 (Equipment)
CREATE (eqp003:Equipment {
  equipment_id: 'EQP-003', 
  name: '열압착 프레스 HP-01 (Hot Press HP-01)'
})

// ❌ 결함 (Defect)
CREATE (def001:Defect {
  defect_id: 'DEF-001', 
  name: '접착 박리 (Delamination)', 
  severity: 'Critical'
})

// 🔍 검사 (Inspection)
CREATE (ins001:Inspection {
  inspection_id: 'INS-001', 
  name: '전단강도 시험 (Shear Strength Test)'
})

// ============================================================
// 2. 관계 생성 (Create Relationships) — 8개
// ============================================================

// 공정 흐름: 혼합 → 열압착 → 연마
CREATE (prc001)-[:NEXT]->(prc003)
CREATE (prc003)-[:NEXT]->(prc005)

// 열압착 공정 → HP-01 설비 사용
CREATE (prc003)-[:USES_EQUIPMENT]->(eqp003)

// 혼합 공정 → 마찰재 투입
CREATE (prc001)-[:USES_MATERIAL]->(cmp001)

// ⭐ 결함 추적 (핵심!)
// 접착 박리 → 전단강도 시험에서 발견
CREATE (def001)-[:DETECTED_AT]->(ins001)

// 전단강도 시험 → 열압착 공정 검증
CREATE (ins001)-[:INSPECTS]->(prc003)

// 접착 박리 ← 열압착 공정이 원인
CREATE (def001)-[:CAUSED_BY_PROCESS]->(prc003)

// 접착 박리 ← HP-01 설비가 원인
CREATE (def001)-[:CAUSED_BY_EQUIPMENT]->(eqp003)

// ============================================================
// ✅ 적재 완료! 아래 쿼리로 확인해보세요:
// MATCH (n) RETURN n
// ============================================================

RETURN '✅ 미니 데모 적재 완료! 노드 7개, 관계 8개' AS status;
