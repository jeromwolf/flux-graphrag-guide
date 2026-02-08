"""
============================================================
0단계 미니 데모 — 기본 Text2Cypher
Stage 0 Mini Demo — Basic Text2Cypher
────────────────────────────────────────
가장 단순한 형태: 스키마 + 질문 → LLM → Cypher 생성
"잘 되는 것도 있고, 안 되는 것도 있다" 를 체험하는 것이 목표

사용법:
  1. OPENAI_API_KEY 환경변수 설정
  2. python 04_basic_text2cypher.py
  
커리큘럼 연동: Part 6a (기본 Text2Cypher)
============================================================
"""

import os
from openai import OpenAI

# ──────────────────────────────────────
# 1. 그래프 스키마 (LLM에게 알려줄 구조)
# ──────────────────────────────────────

GRAPH_SCHEMA = """
## 노드 (Nodes)
- Process: 제조 공정 (properties: process_id, name)
- Equipment: 제조 설비 (properties: equipment_id, name)  
- Defect: 품질 결함 (properties: defect_id, name, severity)
- Inspection: 품질 검사 (properties: inspection_id, name)
- Component: 원자재 (properties: component_id, name)

## 관계 (Relationships)
- (Process)-[:NEXT]->(Process) : 공정 순서
- (Process)-[:USES_EQUIPMENT]->(Equipment) : 공정이 사용하는 설비
- (Process)-[:USES_MATERIAL]->(Component) : 공정에 투입되는 원자재
- (Defect)-[:DETECTED_AT]->(Inspection) : 결함이 발견된 검사
- (Defect)-[:CAUSED_BY_PROCESS]->(Process) : 결함의 원인 공정
- (Defect)-[:CAUSED_BY_EQUIPMENT]->(Equipment) : 결함의 원인 설비
- (Inspection)-[:INSPECTS]->(Process) : 검사가 확인하는 공정

## 현재 데이터 예시
- 공정: 혼합 (Mixing), 열압착 (Hot Press), 연마 (Grinding)
- 설비: 열압착 프레스 HP-01
- 결함: 접착 박리 (Delamination), severity: Critical
- 검사: 전단강도 시험 (Shear Strength Test)
- 원자재: 마찰재 (Friction Material)
"""

SYSTEM_PROMPT = f"""당신은 Neo4j Cypher 쿼리 전문가입니다.
사용자의 자연어 질문을 Cypher 쿼리로 변환하세요.

아래는 그래프 데이터베이스의 스키마입니다:
{GRAPH_SCHEMA}

규칙:
1. Cypher 쿼리만 반환하세요 (설명 없이)
2. RETURN절에 한글 별칭을 사용하세요 (예: AS 결함명)
3. 노드의 name 프로퍼티에는 한글과 영어가 함께 들어있습니다
   예: '접착 박리 (Delamination)'
4. CONTAINS를 사용하여 부분 매칭하세요
   예: WHERE d.name CONTAINS '접착 박리'
"""

# ──────────────────────────────────────
# 2. Text2Cypher 함수
# ──────────────────────────────────────

def text_to_cypher(question: str, client: OpenAI) -> str:
    """자연어 질문을 Cypher 쿼리로 변환"""
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": question}
        ],
        temperature=0
    )
    cypher = response.choices[0].message.content.strip()
    # 마크다운 코드블록 제거
    if cypher.startswith("```"):
        cypher = cypher.split("\n", 1)[1]
        cypher = cypher.rsplit("```", 1)[0]
    return cypher.strip()

# ──────────────────────────────────────
# 3. 테스트 질문들
# ──────────────────────────────────────

TEST_QUESTIONS = [
    # ✅ 잘 되는 질문 (직접적, 명확)
    "접착 박리 결함의 원인 공정과 설비는?",
    
    # ✅ 잘 되는 질문 (공정 흐름)
    "전체 공정 순서를 보여줘",
    
    # ⚠️ 애매한 질문 (LLM이 해석해야 함)
    "HP-01이 고장나면 어떤 영향이 있어?",
    
    # ❌ 어려운 질문 (Multi-hop + 추론)
    "마찰재에 문제가 생기면 어떤 결함이 발생할 수 있어?",
]

# ──────────────────────────────────────
# 4. 실행
# ──────────────────────────────────────

def main():
    # API 키 확인
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("=" * 60)
        print("⚠️  OPENAI_API_KEY 환경변수를 설정해주세요")
        print()
        print("  export OPENAI_API_KEY='sk-...'")
        print()
        print("API 키 없이도 아래 예시로 개념을 이해할 수 있습니다:")
        print("=" * 60)
        print()
        
        # API 없이도 개념 이해를 위한 예시 출력
        print("─" * 60)
        print(f"❓ 질문: 접착 박리 결함의 원인 공정과 설비는?")
        print()
        print(f"🔄 생성될 Cypher (예시):")
        print("""
MATCH (d:Defect)-[:DETECTED_AT]->(i:Inspection)
      -[:INSPECTS]->(p:Process)-[:USES_EQUIPMENT]->(e:Equipment)
WHERE d.name CONTAINS '접착 박리'
RETURN d.name AS 결함명,
       i.name AS 발견검사,
       p.name AS 원인공정,
       e.name AS 원인설비
        """)
        print(f"💡 이 Cypher를 Neo4j Browser에 직접 실행해보세요!")
        print("─" * 60)
        return
    
    client = OpenAI(api_key=api_key)
    
    print("=" * 60)
    print("🔄 기본 Text2Cypher — 자연어 → Cypher 변환")
    print("=" * 60)
    
    for i, question in enumerate(TEST_QUESTIONS, 1):
        print()
        print(f"─── 질문 {i} ───────────────────────────")
        print(f"❓ {question}")
        print()
        
        try:
            cypher = text_to_cypher(question, client)
            print(f"🔄 생성된 Cypher:")
            print(cypher)
        except Exception as e:
            print(f"❌ 오류: {e}")
        
        print()
    
    print("=" * 60)
    print()
    print("🎓 학습 포인트:")
    print("  1. 질문 1~2는 잘 됩니다 → 스키마와 질문이 명확하면 OK")
    print("  2. 질문 3~4는 애매할 수 있습니다 → 이게 Text2Cypher의 한계")
    print("  3. 이 한계를 극복하려면? → Agent가 필요합니다 (2단계)")
    print()
    print("📌 다음 단계:")
    print("  → 1단계: 수작업 KG 구축 + LLM 자동화 비교")
    print("  → 2단계: Text2Cypher Agent (generate→validate→correct→execute)")
    print("=" * 60)


if __name__ == "__main__":
    main()
