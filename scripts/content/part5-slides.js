/**
 * Part 5: "멀티모달 VLM" — "표와 이미지도 그래프로"
 * Total: 18 slides + title + milestone + next preview = 21 slides
 * Duration: 2시간
 * Difficulty: 3/5
 */

module.exports = async function buildPart5(pres, base) {
  const meta = {
    part: 5,
    title: '표와 이미지도 그래프로',
    subtitle: '멀티모달 VLM',
    duration: '2시간',
    difficulty: 3,
    totalSlides: 18,
    milestone: '멀티모달 통합 KG — 텍스트 + 표 통합 그래프',
    nextPreview: {
      title: 'Part 6: "자연어로 그래프를 검색한다" — 통합 + 검색',
      description: '자연어 질문 → 그래프 검색 → 답변 생성 파이프라인을 구축한다.'
    }
  };

  // Title slide
  base.addTitleSlide(pres, meta);

  // ============================================================
  // Section 1: VLM 개념 (20min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 1,
    sectionTitle: 'VLM 개념',
    sectionDuration: '20min',
    sectionColor: base.colors.sectionColors[1] // cyan
  });

  // Slide 1-1: OCR vs VLM — 패러다임 전환
  base.addTwoColumnCards(pres, {
    title: 'OCR vs VLM — 패러다임 전환',
    slideType: 'theory',
    leftTitle: 'OCR (구세대)',
    leftItems: [
      '문자 인식만',
      '구조 손실',
      '표 셀 병합 처리 ❌',
      '맥락 이해 ❌'
    ],
    rightTitle: 'VLM (신세대)',
    rightItems: [
      '시각적 이해',
      '구조 보존',
      '표 셀 병합 처리 ✅',
      '맥락 이해 ✅'
    ]
  });

  // Slide 1-2: 주요 VLM 모델
  base.addComparisonTable(pres, {
    title: '주요 VLM 모델',
    slideType: 'theory',
    headers: ['모델', '개발사', '특징', '표 인식'],
    rows: [
      ['GPT-4o', 'OpenAI', '범용, 비쌈', '✅ 우수'],
      ['Claude 3.5', 'Anthropic', '긴 문서, 정확', '✅ 우수'],
      ['Gemini Pro', 'Google', '멀티턴, 무료', '⚠️ 보통'],
      ['Qwen-VL', 'Alibaba', '오픈소스', '⚠️ 보통']
    ]
  });

  // ============================================================
  // Section 2: 표→그래프 두 가지 접근 (20min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 2,
    sectionTitle: '표→그래프 두 가지 접근',
    sectionDuration: '20min',
    sectionColor: base.colors.sectionColors[2] // blue
  });

  // Slide 2-1: 접근법 A — 연관성 특화
  base.addFlowDiagram(pres, {
    title: '접근법 A — 연관성 특화',
    slideType: 'theory',
    steps: [
      { text: '표 이미지', color: base.colors.primary },
      { text: 'VLM', color: base.colors.accent },
      { text: '엔티티/관계\n추출', color: base.colors.secondary },
      { text: '그래프\n적재', color: base.colors.success }
    ],
    callout: '관계가 명확한 표에 적합 (조직도, 거래 내역)'
  });

  // Slide 2-2: 접근법 B — 구조&텍스트 특화
  base.addFlowDiagram(pres, {
    title: '접근법 B — 구조&텍스트 특화',
    slideType: 'theory',
    steps: [
      { text: '표 이미지', color: base.colors.primary },
      { text: 'VLM', color: base.colors.accent },
      { text: '구조화\n데이터', color: base.colors.secondary },
      { text: 'LLM 요약', color: base.colors.warning },
      { text: '벡터화\n+그래프', color: base.colors.success }
    ],
    callout: '수치 데이터가 많은 표에 적합 (재무제표, 통계표)'
  });

  // Slide 2-3: 보험 도메인 실무 사례
  base.addContentSlide(pres, {
    title: '보험 도메인 실무 사례',
    slideType: 'theory',
    content: [
      {
        type: 'text',
        text: '보험 운영현황 표:',
        fontSize: 18,
        bold: true,
        y: 1.5
      },
      {
        type: 'text',
        text: '• 보험사 엔티티 추출\n• 상품 엔티티 추출\n• 보장 엔티티 추출\n• 보험사-상품-보장 관계 구성',
        fontSize: 16,
        y: 2.0
      },
      {
        type: 'callout',
        text: '💡 접근법 A 활용: 엔티티/관계 중심 그래프',
        color: base.colors.primary,
        y: 3.8
      }
    ]
  });

  // ============================================================
  // Section 3: 문서→그래프 계층 구조 (10min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 3,
    sectionTitle: '문서→그래프 계층 구조',
    sectionDuration: '10min',
    sectionColor: base.colors.sectionColors[3] // purple
  });

  // Slide 3-1: Document→Chapter→Section→Chunk→Entity
  base.addFlowDiagram(pres, {
    title: 'Document→Chapter→Section→Chunk→Entity',
    slideType: 'theory',
    steps: [
      { text: 'Document', color: base.colors.sectionColors[1] },
      { text: 'Chapter', color: base.colors.sectionColors[2] },
      { text: 'Section', color: base.colors.sectionColors[3] },
      { text: 'Chunk', color: base.colors.sectionColors[4] },
      { text: 'Entity', color: base.colors.sectionColors[5] }
    ],
    callout: '계층 구조를 그래프에 반영하면 검색 정확도 향상'
  });

  // Slide 3-2: 표는 SQL — Pinterest 아이디어
  base.addContentSlide(pres, {
    title: '표는 SQL — Pinterest 아이디어',
    slideType: 'theory',
    content: [
      {
        type: 'text',
        text: 'Pinterest의 접근:',
        fontSize: 18,
        bold: true,
        y: 1.5
      },
      {
        type: 'text',
        text: '• 표 데이터는 SQL로 조회\n• 조회 결과를 요약\n• 요약문을 벡터화\n• 벡터와 그래프를 연결',
        fontSize: 16,
        y: 2.0
      },
      {
        type: 'callout',
        text: '💡 구조화 데이터 + 자연어 검색의 하이브리드',
        color: base.colors.accent,
        y: 3.8
      }
    ]
  });

  // ============================================================
  // Section 4: 표 이미지 → 구조화 데이터 (30min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 4,
    sectionTitle: '표 이미지 → 구조화 데이터',
    sectionDuration: '30min',
    sectionColor: base.colors.sectionColors[4] // orange
  });

  // Slide 4-1: VLM API 호출 — 보험 운영현황 표
  base.addCodeSlide(pres, {
    title: 'VLM API 호출 — 보험 운영현황 표',
    slideType: 'practice',
    language: 'python',
    code: `import anthropic
client = anthropic.Anthropic()
response = client.messages.create(
  model="claude-3-5-sonnet-20241022",
  messages=[{"role":"user","content":[
    {"type":"image","source":{
      "type":"base64","data":img_b64}},
    {"type":"text","text":"이 표를 JSON으로"}
  ]}])`,
    notes: 'base64 인코딩된 이미지를 VLM에 전달'
  });

  // Slide 4-2: Table Summary Prompt
  base.addCodeSlide(pres, {
    title: 'Table Summary Prompt (Pinterest 스타일)',
    slideType: 'practice',
    language: 'text',
    code: `Extract key information from this table:
1. Identify column headers and row labels
2. Summarize main trends/patterns
3. Extract critical data points
4. Preserve hierarchical structure
5. Handle merged cells appropriately

Output format: JSON with nested structure`,
    notes: 'VLM에게 구조 보존을 명시적으로 요구'
  });

  // Slide 4-3: 구조화 결과 검증
  base.addContentSlide(pres, {
    title: '구조화 결과 검증',
    slideType: 'practice',
    content: [
      {
        type: 'text',
        text: 'VLM 출력 JSON 검증 포인트:',
        fontSize: 18,
        bold: true,
        y: 1.5
      },
      {
        type: 'text',
        text: '✅ 셀 병합 처리 정확도\n✅ 수치 정확도 (OCR 오류 확인)\n✅ 빈 셀 처리 (null vs 0)\n✅ 헤더/데이터 구분',
        fontSize: 16,
        y: 2.0
      },
      {
        type: 'callout',
        text: '💡 VLM도 완벽하지 않음 → 검증 필수',
        color: base.colors.warning,
        y: 3.8
      }
    ]
  });

  // ============================================================
  // Section 5: 구조화 데이터 → KG 적재 (30min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 5,
    sectionTitle: '구조화 데이터 → KG 적재',
    sectionDuration: '30min',
    sectionColor: base.colors.sectionColors[5] // cyan
  });

  // Slide 5-1: 접근법 A — 엔티티/관계 매핑
  base.addCodeSlide(pres, {
    title: '접근법 A — 엔티티/관계 매핑',
    slideType: 'practice',
    language: 'python',
    code: `# JSON → 엔티티/관계 추출
for row in table_data:
  company = row['보험사']
  product = row['상품명']
  coverage = row['보장내역']

  # Neo4j 적재
  create_entity('Company', company)
  create_entity('Product', product)
  create_relation(company, 'OFFERS', product)`,
    notes: '표 구조를 그래프 구조로 변환'
  });

  // Slide 5-2: 접근법 B — 요약 노드 생성
  base.addCodeSlide(pres, {
    title: '접근법 B — 요약 노드 생성',
    slideType: 'practice',
    language: 'python',
    code: `# 표 요약 생성
summary = llm.invoke(f"""
이 표를 요약하시오:
{json.dumps(table_data, ensure_ascii=False)}
""")

# 요약을 벡터화
embedding = embed_model.encode(summary)

# Neo4j에 적재
create_node('TableSummary',
  text=summary, embedding=embedding)`,
    notes: '요약 노드 → 벡터 검색 + 그래프 탐색'
  });

  // Slide 5-3: Part 3 KG와 통합
  base.addCodeSlide(pres, {
    title: 'Part 3 KG와 통합',
    slideType: 'practice',
    language: 'cypher',
    code: `// 표에서 추출한 엔티티를 기존 KG와 MERGE
MERGE (c:Company {name: '삼성화재'})
SET c.source = 'table_insurance_2024.png'

// 기존 텍스트 노드와 연결
MATCH (t:TextChunk)
WHERE t.text CONTAINS '삼성화재'
MERGE (c)-[:MENTIONED_IN]->(t)`,
    notes: 'MERGE로 텍스트+표 통합 그래프 구축'
  });

  // ============================================================
  // Section 6: 중간 점검 (10min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 6,
    sectionTitle: '중간 점검',
    sectionDuration: '10min',
    sectionColor: base.colors.sectionColors[6] // blue
  });

  // Slide 6-1: 지금까지 만든 KG 전체 시각화
  base.addContentSlide(pres, {
    title: '지금까지 만든 KG 전체 시각화',
    slideType: 'discussion',
    content: [
      {
        type: 'text',
        text: 'Neo4j Browser에서 확인:',
        fontSize: 18,
        bold: true,
        y: 1.5
      },
      {
        type: 'text',
        text: 'MATCH (n) RETURN n LIMIT 100',
        fontSize: 16,
        color: base.colors.accent,
        y: 2.0
      },
      {
        type: 'callout',
        text: '💡 텍스트(Part 3) + 표(Part 5)가 하나의 그래프로 통합!',
        color: base.colors.success,
        y: 3.2
      },
      {
        type: 'text',
        text: '확인 사항:\n✅ 텍스트 노드\n✅ 표 요약 노드\n✅ 엔티티 노드\n✅ 연결 관계',
        fontSize: 14,
        y: 4.0
      }
    ]
  });

  // Slide 6-2: 두 가지 접근법 비교 결과
  base.addTwoColumnCards(pres, {
    title: '두 가지 접근법 비교 결과',
    slideType: 'discussion',
    leftTitle: '접근법 A (관계 중심)',
    leftItems: [
      '엔티티/관계 명확',
      '그래프 추론 정확',
      'Cypher 쿼리 가능',
      '관계 모델링 필요'
    ],
    rightTitle: '접근법 B (정보 중심)',
    rightItems: [
      '정보 손실 최소화',
      '벡터 검색 가능',
      '요약문 활용',
      '추론 정확도 낮음'
    ]
  });

  // ============================================================
  // Milestone & Next Preview
  // ============================================================
  base.addMilestoneSlide(pres, meta);
  base.addNextPreviewSlide(pres, meta);
};
