/**
 * Part 4: "Entity Resolution" — "같은 건데 다르게 들어갔다"
 * Total: 11 slides + title + milestone + next preview = 14 slides
 * Duration: 1시간
 * Difficulty: 3/5
 */

module.exports = async function buildPart4(pres, base) {
  const meta = {
    part: 4,
    title: '같은 건데 다르게 들어갔다',
    subtitle: 'Entity Resolution',
    duration: '1시간',
    difficulty: 3,
    totalSlides: 11,
    milestone: '정제된 KG — 중복 제거 완료 (예: 45개 → 30개 노드)',
    nextPreview: {
      title: 'Part 5: "표와 이미지도 그래프로" — 멀티모달 VLM',
      description: '표/이미지를 포함한 실무 문서를 그래프로 변환한다.'
    }
  };

  // Title slide
  base.addTitleSlide(pres, meta);

  // ============================================================
  // Section 1: ER 개념 + 중요성 (15min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 1,
    sectionTitle: 'ER 개념 + 중요성',
    sectionDuration: '15min',
    sectionColor: base.colors.sectionColors[1] // cyan
  });

  // Slide 1-1: 같은 건데 다르게 들어갔다
  base.addContentSlide(pres, {
    title: '"같은 건데 다르게 들어갔다"',
    slideType: 'theory',
    content: [
      {
        type: 'large_text',
        text: '"삼성전자" = "Samsung Electronics"\n= "삼성" = "Samsung"',
        fontSize: 32,
        bold: true,
        y: 1.5
      },
      {
        type: 'text',
        text: '이게 다 같은 엔티티인데,\nKG에는 4개로 들어가 있다',
        fontSize: 20,
        color: base.colors.danger,
        y: 3.0
      }
    ]
  });

  // Slide 1-2: Entity Resolution이 중요한 이유
  base.addFlowDiagram(pres, {
    title: 'Entity Resolution이 중요한 이유',
    slideType: 'theory',
    steps: [
      { text: '중복 엔티티', color: base.colors.danger },
      { text: '관계 분산', color: base.colors.warning },
      { text: 'Multi-hop\n실패', color: base.colors.danger },
      { text: '잘못된\n답변', color: base.colors.danger }
    ],
    callout: 'ER 없이는 KG 품질을 보장할 수 없다'
  });

  // Slide 1-3: Entity 출처 추적
  base.addContentSlide(pres, {
    title: 'Entity 출처 추적',
    slideType: 'theory',
    content: [
      {
        type: 'text',
        text: '어떤 문서에서 왔는지 추적해야 함',
        fontSize: 18,
        bold: true,
        y: 1.5
      },
      {
        type: 'text',
        text: 'LightRAG의 접근:\n엔티티 관리용 KV Store (key-value database)\n각 엔티티마다 출처 문서 ID를 기록',
        fontSize: 16,
        y: 2.2
      },
      {
        type: 'callout',
        text: '💡 출처 추적 → ER 판단 정확도 향상 → 답변 신뢰도 향상',
        color: base.colors.accent,
        y: 3.8
      }
    ]
  });

  // ============================================================
  // Section 2: 방법론 비교 (15min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 2,
    sectionTitle: '방법론 비교',
    sectionDuration: '15min',
    sectionColor: base.colors.sectionColors[2] // blue
  });

  // Slide 2-1: ER 방법론 4가지
  base.addComparisonTable(pres, {
    title: 'ER 방법론 4가지',
    slideType: 'theory',
    headers: ['방법', '원리', '장점', '단점'],
    rows: [
      ['Fuzzy Matching', '문자열 유사도\n(Levenshtein)', '빠름', '동음이의어 취약'],
      ['임베딩 유사도', '의미 벡터 비교', '의미 파악', '임계값 튜닝 필요'],
      ['LLM 판단', 'GPT/Claude에게 질문', '맥락 이해', '비용 높음, 느림'],
      ['Senzing', '전문 ER 엔진', '정확도 높음', '셋업 복잡']
    ]
  });

  // Slide 2-2: 실무 권장 — 하이브리드
  base.addFlowDiagram(pres, {
    title: '실무 권장 — 하이브리드 접근',
    slideType: 'theory',
    steps: [
      { text: '1차\nFuzzy\nMatching', color: base.colors.success },
      { text: '2차\n임베딩\n유사도', color: base.colors.primary },
      { text: '3차\nLLM 판단\n(애매한 것만)', color: base.colors.accent }
    ],
    callout: '비용 효율: 쉬운 건 Fuzzy로, 어려운 건 LLM으로'
  });

  // ============================================================
  // Section 3: 실습 — 중복 엔티티 통합 (30min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 3,
    sectionTitle: '실습 — 중복 엔티티 통합',
    sectionDuration: '30min',
    sectionColor: base.colors.sectionColors[3] // purple
  });

  // Slide 3-1: Part 3 KG에서 중복 찾기
  base.addCodeSlide(pres, {
    title: 'Part 3 KG에서 중복 찾기',
    slideType: 'practice',
    language: 'cypher',
    code: `MATCH (a), (b)
WHERE a.name CONTAINS '삼성'
  AND b.name CONTAINS '삼성'
  AND id(a) < id(b)
RETURN a.name, b.name,
  apoc.text.levenshteinSimilarity(
    a.name, b.name
  ) AS similarity
ORDER BY similarity DESC`,
    notes: 'APOC 라이브러리의 문자열 유사도 활용'
  });

  // Slide 3-2: 임베딩 기반 유사도 비교
  base.addCodeSlide(pres, {
    title: '임베딩 기반 유사도 비교',
    slideType: 'practice',
    language: 'python',
    code: `from sentence_transformers import SentenceTransformer
model = SentenceTransformer('all-MiniLM-L6-v2')

entities = ["삼성전자", "Samsung Electronics",
            "삼성", "SK하이닉스"]
embeddings = model.encode(entities)
# cosine similarity > 0.85
# → 동일 엔티티 후보`,
    notes: '의미 기반 유사도로 동음이의어 구분 가능'
  });

  // Slide 3-3: MERGE로 엔티티 통합
  base.addCodeSlide(pres, {
    title: 'MERGE로 엔티티 통합',
    slideType: 'practice',
    language: 'cypher',
    code: `// 삼성전자로 통합
MATCH (old {name: 'Samsung Electronics'})
MATCH (new {name: '삼성전자'})
// 관계 이전
MATCH (old)-[r]->(target)
CREATE (new)-[r2:SAME_TYPE]->(target)
DELETE r
DETACH DELETE old`,
    notes: '관계까지 함께 이전해야 정보 손실 없음'
  });

  // Slide 3-4: ER 전후 비교
  base.addTwoColumnCards(pres, {
    title: 'ER 전후 비교',
    slideType: 'practice',
    leftTitle: 'Before ER',
    leftItems: [
      '노드 45개',
      '중복 엔티티 다수',
      '관계 분산',
      'Multi-hop 실패'
    ],
    rightTitle: 'After ER',
    rightItems: [
      '노드 30개 (33% 감소)',
      '깨끗한 KG',
      '관계 통합',
      'Multi-hop 정확도 향상'
    ]
  });

  // ============================================================
  // Milestone & Next Preview
  // ============================================================
  base.addMilestoneSlide(pres, meta);
  base.addNextPreviewSlide(pres, meta);
};
