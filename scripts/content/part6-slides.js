/**
 * Part 6: "통합 + 검색" — 자연어로 그래프를 검색한다
 * Total: 16 slides + title + milestone + next preview = 19 slides
 * Duration: 1.5시간
 * Difficulty: 4/5
 */

module.exports = async function buildPart6(pres, base) {
  const meta = {
    part: 6,
    title: '통합 + 검색',
    subtitle: '자연어로 그래프를 검색한다',
    duration: '1.5시간',
    difficulty: 4,
    totalSlides: 16,
    milestone: '완성된 GraphRAG 시스템 — 자연어 → 그래프 검색 → 답변 생성',
    nextPreview: {
      title: 'Part 7: "프로덕션으로 가는 길" — 실무 적용 가이드',
      description: '품질 평가, 성능 최적화, 운영 방법을 학습한다.'
    }
  };

  // Title slide
  base.addTitleSlide(pres, meta);

  // ============================================================
  // Section 1: 파이프라인 통합 (15min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 1,
    sectionTitle: '파이프라인 통합',
    sectionDuration: '15min',
    sectionColor: base.colors.sectionColors[1] // cyan
  });

  // Slide 1-1: 벡터 임베딩 추가
  base.addCodeSlide(pres, {
    title: '벡터 임베딩 추가 — 하이브리드 준비',
    slideType: 'practice',
    language: 'python',
    code: `from neo4j_graphrag.embeddings import OpenAIEmbeddings
embedder = OpenAIEmbeddings(model="text-embedding-3-small")

# 기존 노드에 임베딩 추가
for node in nodes:
    emb = embedder.embed_query(node["name"])
    driver.execute_query(
      "MATCH (n {id:$id}) SET n.embedding=$emb",
      {"id": node["id"], "emb": emb})`,
    notes: '기존 KG 노드에 벡터 임베딩을 추가하여 하이브리드 검색 준비'
  });

  // Slide 1-2: 전체 파이프라인 아키텍처
  base.addFlowDiagram(pres, {
    title: '전체 파이프라인 아키텍처',
    slideType: 'theory',
    steps: [
      { text: '질문', color: base.colors.accent },
      { text: 'Router', color: base.colors.primary },
      { text: '[벡터 검색 |\n그래프 검색]', color: base.colors.secondary },
      { text: 'Reranker', color: base.colors.warning },
      { text: 'LLM', color: base.colors.success },
      { text: '답변', color: base.colors.accent }
    ]
  });

  // ============================================================
  // Section 2: 기본 Text2Cypher (25min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 2,
    sectionTitle: '기본 Text2Cypher',
    sectionDuration: '25min',
    sectionColor: base.colors.sectionColors[2] // blue
  });

  // Slide 2-1: 가장 단순한 형태
  base.addFlowDiagram(pres, {
    title: '가장 단순한 형태',
    slideType: 'theory',
    steps: [
      { text: '스키마 + 질문', color: base.colors.accent },
      { text: 'LLM', color: base.colors.primary },
      { text: 'Cypher 생성', color: base.colors.secondary },
      { text: '실행', color: base.colors.success }
    ],
    callout: '잘 되는 것도 있고, 안 되는 것도 있다'
  });

  // Slide 2-2: 기본 Text2Cypher 구현
  base.addCodeSlide(pres, {
    title: '기본 Text2Cypher 구현',
    slideType: 'practice',
    language: 'python',
    code: `system = f"""Cypher 전문가입니다.
스키마: {graph_schema}
규칙: Cypher만 반환, CONTAINS 사용"""

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role":"system","content":system},
              {"role":"user","content":question}],
    temperature=0)`,
    notes: 'Part 0 미니 데모의 text2cypher.py와 동일 패턴'
  });

  // Slide 2-3: 잘 되는 질문 vs 안 되는 질문
  base.addComparisonTable(pres, {
    title: '잘 되는 질문 vs 안 되는 질문',
    slideType: 'practice',
    headers: ['질문', '결과', '이유'],
    rows: [
      ['접착 박리의 원인 공정은?', '✅ 성공', '직접적, 명확한 스키마 매핑'],
      ['전체 공정 순서를 보여줘', '✅ 성공', 'NEXT 관계 따라가기'],
      ['HP-01 고장 시 영향은?', '⚠️ 애매', 'LLM 해석 필요'],
      ['마찰재 문제 → 결함 예측', '❌ 실패', 'Multi-hop + 추론 필요']
    ]
  });

  // Slide 2-4: Schema Tuning
  base.addContentSlide(pres, {
    title: 'Schema Tuning — include/exclude',
    slideType: 'theory',
    content: [
      {
        type: 'text',
        text: '스키마를 LLM에 전부 주면 혼란 → 관련 부분만 선별 → 정확도 향상',
        fontSize: 16,
        y: 1.8
      },
      {
        type: 'callout',
        text: '이 한계를 극복하려면? → Agent가 필요합니다',
        color: base.colors.warning,
        y: 3.5
      }
    ]
  });

  // ============================================================
  // Section 3: Text2Cypher Agent (30min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 3,
    sectionTitle: 'Text2Cypher Agent',
    sectionDuration: '30min',
    sectionColor: base.colors.sectionColors[3] // purple
  });

  // Slide 3-1: Agent 파이프라인 4단계
  base.addFlowDiagram(pres, {
    title: 'Agent 파이프라인 — 4단계',
    slideType: 'theory',
    steps: [
      { text: 'generate', color: base.colors.accent },
      { text: 'validate', color: base.colors.primary },
      { text: 'correct', color: base.colors.secondary },
      { text: 'execute', color: base.colors.success }
    ],
    callout: 'LangGraph로 구현하는 자가 교정 Agent'
  });

  // Slide 3-2: generate — Cypher 생성
  base.addCodeSlide(pres, {
    title: 'generate — Cypher 생성',
    slideType: 'practice',
    language: 'python',
    code: `# SemanticSimilarityExampleSelector
selector = SemanticSimilarityExampleSelector(
    examples=few_shot_examples,
    embeddings=OpenAIEmbeddings(),
    k=3)
# 유사한 예시를 자동 선택 → 프롬프트에 포함`,
    notes: '유사한 질문-쿼리 쌍을 자동으로 few-shot에 추가'
  });

  // Slide 3-3: validate — 6가지 체크
  base.addComparisonTable(pres, {
    title: 'validate — 6가지 체크',
    slideType: 'practice',
    headers: ['Check', '설명', '에러 예시'],
    rows: [
      ['문법 검사', 'Cypher 파싱', 'MTACH → MATCH'],
      ['노드 라벨', '존재 여부', ':Company → :Corp (없음)'],
      ['관계 타입', '존재 여부', ':WORKS → :WORKS_AT'],
      ['프로퍼티', '존재 여부', 'n.names → n.name'],
      ['방향', '관계 방향', '(a)<-[:REL]-(b) 확인'],
      ['집계', 'GROUP BY', 'COUNT/SUM 유효성']
    ]
  });

  // Slide 3-4: correct + execute
  base.addCodeSlide(pres, {
    title: 'correct + execute',
    slideType: 'practice',
    language: 'python',
    code: `# correct: LLM이 에러 메시지 보고 수정
corrected = llm.invoke(f"""
에러: {error_msg}
원본 쿼리: {cypher}
수정된 Cypher만 반환하세요.""")

# execute: Neo4j에서 실행
result = driver.execute_query(corrected)`,
    notes: 'LLM 기반 에러 수정 + 실행'
  });

  // Slide 3-5: 기본 vs Agent 비교
  base.addTwoColumnCards(pres, {
    title: '기본 vs Agent — 결과 비교',
    slideType: 'practice',
    leftTitle: '기본 Text2Cypher',
    leftItems: [
      '간단한 질문 OK',
      '복잡한 질문 실패',
      '에러 처리 없음',
      '정확도 60~70%'
    ],
    rightTitle: 'Agent',
    rightItems: [
      '자가 교정',
      '복잡한 질문 처리',
      '6단계 검증',
      '정확도 85~95%'
    ]
  });

  // ============================================================
  // Section 4: 하이브리드 검색 + 데모 (20min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 4,
    sectionTitle: '하이브리드 검색 + 데모',
    sectionDuration: '20min',
    sectionColor: base.colors.sectionColors[4] // orange
  });

  // Slide 4-1: 벡터 + Graph + RRF 통합
  base.addFlowDiagram(pres, {
    title: '벡터 + Graph + RRF 통합',
    slideType: 'theory',
    steps: [
      { text: 'Query', color: base.colors.accent },
      { text: '[Vector Search,\nGraph Search]', color: base.colors.primary },
      { text: 'RRF Fusion', color: base.colors.secondary },
      { text: 'Reranker', color: base.colors.warning },
      { text: 'LLM', color: base.colors.success }
    ]
  });

  // Slide 4-2: Prompt Routing
  base.addComparisonTable(pres, {
    title: 'Prompt Routing',
    slideType: 'theory',
    headers: ['Query Type', 'Route', '예시'],
    rows: [
      ['사실 확인', 'Vector', '삼성전자 매출은?'],
      ['관계 추적', 'Graph', '삼성 투자기관의 투자처?'],
      ['복합', 'Hybrid', '고매출 기업의 공통 투자자?']
    ]
  });

  // Slide 4-3: Streamlit 데모 UI
  base.addCodeSlide(pres, {
    title: 'Streamlit 데모 UI',
    slideType: 'practice',
    language: 'python',
    code: `import streamlit as st
query = st.text_input("질문을 입력하세요")
if query:
    result = graphrag_pipeline(query)
    st.write(result["answer"])
    st.json(result["cypher"])
    st.graph(result["subgraph"])`,
    notes: '완성된 GraphRAG 시스템을 Streamlit으로 데모'
  });

  // ============================================================
  // Milestone & Next Preview
  // ============================================================
  base.addMilestoneSlide(pres, meta);
  base.addNextPreviewSlide(pres, meta);
};
