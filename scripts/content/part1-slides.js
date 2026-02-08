/**
 * Part 1: "왜 GraphRAG인가?" — 기초
 * Total: 14 slides + title + milestone + next preview = 17 slides
 * Duration: 2시간
 * Difficulty: 1/5
 */

module.exports = async function buildPart1(pres, base) {
  const meta = {
    part: 1,
    title: '왜 GraphRAG인가?',
    subtitle: '기초',
    duration: '2시간',
    difficulty: 1,
    totalSlides: 14,
    milestone: 'Neo4j에 첫 그래프 생성 완료 (노드 7개 + 관계 5개)',
    nextPreview: {
      title: 'Part 2: "직접 해봐야 안다" — 수작업 KG',
      description: '뉴스 기사 10개에서 노드 15개, 관계 20개를 손으로 직접 추출하는 "고통의 시간"'
    }
  };

  // Title slide
  base.addTitleSlide(pres, meta);

  // ============================================================
  // Section 1: 벡터 RAG의 한계 (20min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 1,
    sectionTitle: '벡터 RAG의 한계',
    sectionDuration: '20min',
    sectionColor: base.colors.sectionColors[1] // cyan
  });

  // Slide 1-1: 오프닝 질문
  base.addContentSlide(pres, {
    title: '오프닝 — "이 질문에 답할 수 있나요?"',
    slideType: 'theory',
    content: [
      {
        type: 'large_text',
        text: '삼성전자에 투자한 기관 중에서,\n해당 기관이 투자한 다른 반도체 기업은?',
        fontSize: 32,
        bold: true,
        y: 1.5
      },
      {
        type: 'text',
        text: '벡터 RAG: ???',
        fontSize: 28,
        color: base.colors.gray,
        y: 3.5
      }
    ]
  });

  // Slide 1-2: 벡터 RAG 구조적 한계
  base.addFlowDiagram(pres, {
    title: '벡터 RAG의 구조적 한계 — 청크 기반 맥락 단절',
    slideType: 'theory',
    steps: [
      { text: 'Chunk A\n삼성전자←국민연금 투자', color: base.colors.accent },
      { text: '✂️ 분리', color: base.colors.gray },
      { text: 'Chunk B\n국민연금→SK하이닉스 투자', color: base.colors.accent }
    ],
    bottomText: '❌ 관계 단절'
  });

  // Slide 1-3: 1-hop 판단 기준
  base.addComparisonTable(pres, {
    title: '핵심 판단 기준 — "1-hop이면 벡터로 충분하다"',
    slideType: 'theory',
    headers: ['질문 유형', '예시', '벡터 RAG', 'GraphRAG'],
    rows: [
      ['1-hop (단일 사실)', '삼성전자 2024년 매출은?', '✅ 충분', '✅ 가능'],
      ['2-hop (관계 1단계)', '삼성전자의 파트너사는?', '⚠️ 운 좋으면', '✅ 정확'],
      ['Multi-hop (관계 2단계+)', '삼성 투자 기관의 다른 투자처는?', '❌ 불가능', '✅ 핵심 강점'],
      ['비교/집계', '반도체 기업의 공통 투자자 Top 3?', '❌ 불가능', '✅ Cypher 쿼리']
    ],
    callout: '⭐ 1-hop = 벡터로 충분 | Multi-hop = GraphRAG 고려'
  });

  // Slide 1-4: 벡터 RAG 실패 데모
  base.addCodeSlide(pres, {
    title: '벡터 RAG 실패 데모',
    slideType: 'demo',
    language: 'python',
    code: `# Multi-hop 질문 → 벡터 RAG 실패
docs = ["삼성전자는 글로벌 IT 기업이다.",
        "국민연금은 삼성전자 지분 9.8% 보유",
        "국민연금은 SK하이닉스 지분 7.2% 보유"]

result = qa.invoke("삼성 투자 기관의 다른 투자처는?")
# → "정확한 정보를 찾을 수 없습니다."
# 청크 분리 → 관계 추론 불가`,
    notes: '벡터 RAG는 청크를 독립적으로 임베딩 → 청크 간 관계 소실'
  });

  // ============================================================
  // Section 2: 전략적 관점 (15min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 2,
    sectionTitle: '전략적 관점',
    sectionDuration: '15min',
    sectionColor: base.colors.sectionColors[2] // blue
  });

  // Slide 2-1: 도입 판단 5단계
  base.addFlowDiagram(pres, {
    title: 'GraphRAG 도입 판단 5단계',
    slideType: 'theory',
    steps: [
      { text: 'Step 1\n도메인 특성 파악', color: base.colors.primary },
      { text: 'Step 2\n문서 분류', color: base.colors.secondary },
      { text: 'Step 3\n문제 정의', color: base.colors.accent },
      { text: 'Step 4\n실패 케이스 추적', color: base.colors.warning },
      { text: 'Step 5\n스키마 셋업', color: base.colors.success }
    ],
    callout: '⭐ "초기 인터뷰가 가장 중요"'
  });

  // Slide 2-2: 3가지 GraphRAG 경험 유형
  base.addComparisonTable(pres, {
    title: '3가지 GraphRAG 경험 유형',
    slideType: 'theory',
    headers: ['유형', '검색 방식', '핵심 과제', '우리 과정'],
    rows: [
      ['Public Domain', 'Vector & Graph', '인프라 구축, 도메인→그래프 변환', 'Part 1~3'],
      ['Enterprise Domain', 'Graph only', '"Why Graph?" 설득, 프롬프트 엔지니어링', 'Part 4~5'],
      ['Enterprise Document', 'Vector & Graph', '평가, Reranking', 'Part 6~7']
    ]
  });

  // Slide 2-3: 전체 아키텍처 맛보기
  const slide2_3 = pres.addSlide();
  base.addSlideHeader(slide2_3, '전체 아키텍처 맛보기', 'theory');

  // Three columns
  const cols = [
    {
      x: 0.5, title: 'Server',
      items: ['Neo4j←Part1✅', '벡터 인덱스←Part6', 'LLM API←Part3']
    },
    {
      x: 3.7, title: 'RAG Pipeline',
      items: ['Text2Cypher←Part6', '하이브리드 검색←Part6']
    },
    {
      x: 6.9, title: 'Client',
      items: ['Streamlit←Part6', '모니터링←Part7']
    }
  ];

  cols.forEach(col => {
    slide2_3.addShape(pres.ShapeType.rect, {
      x: col.x,
      y: 1.2,
      w: 3.0,
      h: 3.5,
      fill: { color: base.colors.background },
      line: { color: base.colors.border, width: 2 }
    });
    slide2_3.addText(col.title, {
      x: col.x,
      y: 1.3,
      w: 3.0,
      h: 0.5,
      fontSize: 20,
      bold: true,
      color: base.colors.primary,
      align: 'center'
    });
    col.items.forEach((item, i) => {
      slide2_3.addText(item, {
        x: col.x + 0.2,
        y: 2.0 + i * 0.6,
        w: 2.6,
        h: 0.4,
        fontSize: 14,
        color: item.includes('✅') ? base.colors.text : base.colors.gray
      });
    });
  });

  base.addSlideFooter(slide2_3, 1);

  // ============================================================
  // Section 3: 온톨로지 핵심만 (25min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 3,
    sectionTitle: '온톨로지 핵심만',
    sectionDuration: '25min',
    sectionColor: base.colors.sectionColors[3] // purple
  });

  // Slide 3-1: 온톨로지 = 합의의 도구
  base.addComparisonTable(pres, {
    title: '"온톨로지 = 합의의 도구"',
    slideType: 'theory',
    headers: ['도메인', '합의 필요성', '난이도', '예시'],
    rows: [
      ['소셜네트워크', '거의 없음', '⭐', '"팔로우", "좋아요"'],
      ['제조/통신', '높음', '⭐⭐⭐⭐', '"장비" = 서버? 네트워크?'],
      ['금융/보험/법률', '매우 높음', '⭐⭐⭐⭐⭐', '"보장" = 한도? 기간?']
    ]
  });

  // Slide 3-2: DB 스키마 vs LPG
  base.addTwoColumnCards(pres, {
    title: 'DB 스키마 vs LPG',
    slideType: 'theory',
    leftTitle: 'RDB',
    leftItems: [
      '행(Row)',
      'Foreign Key (간접)',
      '중간 테이블',
      'JOIN 연쇄 → 느림'
    ],
    rightTitle: 'LPG',
    rightItems: [
      '노드(Node)',
      'Edge (직접 1급 시민)',
      'Edge에 프로퍼티',
      '포인터 → O(d)'
    ]
  });

  // Slide 3-3: 문서 내 vs 문서 간 관계
  base.addFlowDiagram(pres, {
    title: '문서 내 관계 vs 문서 간 관계',
    slideType: 'theory',
    steps: [
      { text: '📄 문서 1\n삼성화재—자동차보험', color: base.colors.accent },
      { text: '🔗\n삼성화재\n(동일 엔티티)', color: base.colors.primary },
      { text: '📄 문서 2\n삼성화재—금감원 보고서', color: base.colors.accent }
    ],
    bottomText: '문서 간 관계: 벡터 RAG ❌ — GraphRAG ✅'
  });

  // Slide 3-4: Heterogeneous Graph
  const slide3_4 = pres.addSlide();
  base.addSlideHeader(slide3_4, 'Heterogeneous Graph — 보험 예시', 'theory');

  // Graph visualization
  const nodes = [
    { x: 1.0, y: 2.0, icon: '🏢', label: '보험사' },
    { x: 3.5, y: 2.0, icon: '📦', label: '보험상품' },
    { x: 6.0, y: 2.0, icon: '🛡️', label: '보장내역' },
    { x: 1.0, y: 3.5, icon: '👤', label: '고객' },
    { x: 6.0, y: 3.5, icon: '⚖️', label: '법률조항' }
  ];

  nodes.forEach(node => {
    slide3_4.addShape(pres.ShapeType.ellipse, {
      x: node.x,
      y: node.y,
      w: 1.2,
      h: 0.8,
      fill: { color: base.colors.primary, transparency: 20 },
      line: { color: base.colors.primary, width: 2 }
    });
    slide3_4.addText(`${node.icon}\n${node.label}`, {
      x: node.x,
      y: node.y,
      w: 1.2,
      h: 0.8,
      fontSize: 14,
      align: 'center',
      valign: 'middle'
    });
  });

  // Arrows
  const arrows = [
    { x1: 2.2, y1: 2.4, x2: 3.5, y2: 2.4 },
    { x1: 4.7, y1: 2.4, x2: 6.0, y2: 2.4 },
    { x1: 2.2, y1: 3.9, x2: 3.5, y2: 3.0 },
    { x1: 4.7, y1: 2.8, x2: 6.0, y2: 3.5 }
  ];

  arrows.forEach(arrow => {
    slide3_4.addShape(pres.ShapeType.line, {
      x: arrow.x1,
      y: arrow.y1,
      w: arrow.x2 - arrow.x1,
      h: arrow.y2 - arrow.y1,
      line: { color: base.colors.secondary, width: 2, endArrowType: 'arrow' }
    });
  });

  slide3_4.addText('5가지 노드 타입 × 4가지 관계 타입', {
    x: 0.5,
    y: 4.8,
    w: 9.0,
    h: 0.4,
    fontSize: 16,
    color: base.colors.primary,
    align: 'center',
    bold: true
  });

  base.addSlideFooter(slide3_4, 1);

  // ============================================================
  // Section 4: 6레이어 프레임워크 (15min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 4,
    sectionTitle: '6레이어 프레임워크',
    sectionDuration: '15min',
    sectionColor: base.colors.sectionColors[4] // orange
  });

  // Slide 4-1: 프레임워크 전체 흐름
  const slide4_1 = pres.addSlide();
  base.addSlideHeader(slide4_1, '프레임워크 전체 흐름', 'theory');

  // Flow diagram
  const layers = [
    { text: 'L1\nStrategy', color: base.colors.sectionColors[1] },
    { text: 'L2\nData', color: base.colors.sectionColors[2] },
    { text: 'L3\nInfra', color: base.colors.sectionColors[3] },
    { text: 'L4\nProcessing', color: base.colors.sectionColors[4] },
    { text: 'L5\nDeployment', color: base.colors.sectionColors[5] }
  ];

  layers.forEach((layer, i) => {
    slide4_1.addShape(pres.ShapeType.rect, {
      x: 0.8 + i * 1.7,
      y: 1.5,
      w: 1.5,
      h: 0.8,
      fill: { color: layer.color },
      line: { color: base.colors.border, width: 1 }
    });
    slide4_1.addText(layer.text, {
      x: 0.8 + i * 1.7,
      y: 1.5,
      w: 1.5,
      h: 0.8,
      fontSize: 14,
      color: base.colors.white,
      align: 'center',
      valign: 'middle',
      bold: true
    });
    if (i < layers.length - 1) {
      slide4_1.addShape(pres.ShapeType.rightArrow, {
        x: 2.4 + i * 1.7,
        y: 1.7,
        w: 0.5,
        h: 0.4,
        fill: { color: base.colors.gray }
      });
    }
  });

  slide4_1.addText('↩️ 유의미하지 않으면 L1으로 재검토', {
    x: 0.5,
    y: 2.8,
    w: 9.0,
    h: 0.4,
    fontSize: 14,
    color: base.colors.warning,
    align: 'center'
  });

  // Table
  const layerTable = [
    ['Layer', '핵심 내용', '담당 Part'],
    ['L1 Strategy', '왜 GraphRAG? 1-hop 판단', 'Part 1'],
    ['L2 Data', '수작업 KG → 스키마 설계', 'Part 2'],
    ['L3 Infra', 'Neo4j 최적화', 'Part 3'],
    ['L4 Processing', '자동 추출 파이프라인', 'Part 4~5'],
    ['L5 Deployment', '하이브리드 RAG, 모니터링', 'Part 6~7']
  ];

  slide4_1.addTable(layerTable, {
    x: 0.5,
    y: 3.4,
    w: 9.0,
    h: 1.8,
    fontSize: 12,
    border: { pt: 1, color: base.colors.border },
    fill: { color: base.colors.background },
    color: base.colors.text,
    align: 'center',
    valign: 'middle'
  });

  base.addSlideFooter(slide4_1, 1);

  // ============================================================
  // Section 5: 인프라 — Why Neo4j (5min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 5,
    sectionTitle: '인프라 — Why Neo4j',
    sectionDuration: '5min',
    sectionColor: base.colors.sectionColors[5] // cyan
  });

  // Slide 5-1: 왜 Neo4j인가
  base.addContentSlide(pres, {
    title: '"왜 Neo4j인가"',
    slideType: 'theory',
    content: [
      {
        type: 'callout',
        text: '🏆 DB-engines 1위\n🔗 LangChain 연동 우수\n⚡ get_neighbors O(d)\n📊 LPG 기반',
        color: base.colors.primary
      },
      {
        type: 'text',
        text: 'Part 7 심화 예고:',
        fontSize: 18,
        bold: true,
        y: 3.0
      },
      {
        type: 'text',
        text: '• GDBMS 선정 3기준\n• Kùzu/FalkorDB 비교\n• Neo4j 최적화 실전',
        fontSize: 16,
        y: 3.5
      }
    ]
  });

  // ============================================================
  // Section 6: Neo4j + Cypher 실습 (40min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 6,
    sectionTitle: 'Neo4j + Cypher 실습',
    sectionDuration: '40min',
    sectionColor: base.colors.sectionColors[6] // blue
  });

  // Slide 6-1: Docker로 Neo4j 띄우기
  base.addCodeSlide(pres, {
    title: 'Docker로 Neo4j 띄우기',
    slideType: 'practice',
    language: 'yaml',
    code: `services:
  neo4j:
    image: neo4j:5.26-community
    ports:
      - "7474:7474"
      - "7687:7687"
    environment:
      NEO4J_AUTH: neo4j/graphrag2024`,
    notes: 'docker-compose up -d → http://localhost:7474'
  });

  // Slide 6-2: Cypher 기초 — CREATE
  base.addCodeSlide(pres, {
    title: 'Cypher 기초 — CREATE',
    slideType: 'practice',
    language: 'cypher',
    code: `CREATE (samsung:Company {name: '삼성전자'})
CREATE (npf:Fund {name: '국민연금'})
CREATE (sk:Company {name: 'SK하이닉스'})
CREATE (npf)-[:INVESTED_IN]->(samsung)
CREATE (npf)-[:INVESTED_IN]->(sk)
RETURN *
// → 노드 3개, 관계 2개 생성`,
    notes: 'Neo4j Browser에서 실행 후 그래프 시각화 확인'
  });

  // Slide 6-3: Cypher 기초 — MATCH
  base.addCodeSlide(pres, {
    title: 'Cypher 기초 — MATCH',
    slideType: 'practice',
    language: 'cypher',
    code: `// Multi-hop: 삼성 투자기관의 다른 투자처
MATCH (samsung:Company {name:'삼성전자'})
      <-[:INVESTED_IN]-(fund)
      -[:INVESTED_IN]->(other)
WHERE other <> samsung
RETURN fund.name, other.name
// → 국민연금 | SK하이닉스`,
    notes: '벡터 RAG로는 불가능했던 질문을 Cypher로 해결'
  });

  // Slide 6-4: Neo4j Browser 시각화
  base.addContentSlide(pres, {
    title: 'Neo4j Browser 시각화',
    slideType: 'practice',
    content: [
      {
        type: 'text',
        text: 'Browser에서 확인할 것:',
        fontSize: 18,
        bold: true,
        y: 1.5
      },
      {
        type: 'text',
        text: '✅ 노드 3개 (Company 2개, Fund 1개)\n✅ 관계 2개 (INVESTED_IN)\n✅ 그래프 시각화로 연결 확인',
        fontSize: 16,
        y: 2.0
      },
      {
        type: 'callout',
        text: '💡 노드 5개뿐인데도 의미 있는 추론이 가능',
        color: base.colors.success,
        y: 3.5
      }
    ]
  });

  // ============================================================
  // Milestone & Next Preview
  // ============================================================
  base.addMilestoneSlide(pres, meta);
  base.addNextPreviewSlide(pres, meta);
};
