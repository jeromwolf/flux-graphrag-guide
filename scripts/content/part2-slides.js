/**
 * Part 2: "수작업 KG" — "직접 해봐야 안다"
 * Total: 16 slides + title + milestone + next preview = 19 slides
 * Duration: 2시간
 * Difficulty: 2/5
 */

module.exports = async function buildPart2(pres, base) {
  const meta = {
    part: 2,
    title: '직접 해봐야 안다',
    subtitle: '수작업 KG',
    duration: '2시간',
    difficulty: 2,
    totalSlides: 16,
    milestone: '수작업 KG 완성 — 노드 15개, 관계 20개 + Meta-Dictionary',
    nextPreview: {
      title: 'Part 3: "자동화해도 완벽하지 않다" — LLM 자동화',
      description: 'LLM으로 엔티티/관계를 자동 추출하고, 수작업 대비 품질을 비교한다.'
    }
  };

  // Title slide
  base.addTitleSlide(pres, meta);

  // ============================================================
  // Section 1: 온톨로지 설계 워크숍 (30min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 1,
    sectionTitle: '온톨로지 설계 워크숍',
    sectionDuration: '30min',
    sectionColor: base.colors.sectionColors[1] // cyan
  });

  // Slide 1-1: 도메인 선택
  base.addContentSlide(pres, {
    title: '도메인 선택 — 한국 IT 기업',
    slideType: 'discussion',
    content: [
      {
        type: 'large_text',
        text: '왜 한국 IT?',
        fontSize: 32,
        bold: true,
        y: 1.5
      },
      {
        type: 'text',
        text: '삼성전자, SK하이닉스, 네이버, 카카오...\n모두가 아는 도메인으로 온톨로지 학습 효과 극대화',
        fontSize: 18,
        y: 2.5
      },
      {
        type: 'callout',
        text: '💡 친숙한 도메인 = 관계 추출 정확도 향상',
        color: base.colors.accent,
        y: 3.8
      }
    ]
  });

  // Slide 1-2: Node Labels 정의
  base.addComparisonTable(pres, {
    title: 'Node Labels 정의',
    slideType: 'discussion',
    headers: ['Entity Type', '예시', '설명'],
    rows: [
      ['Company', '삼성전자', '기업'],
      ['Person', '이재용', '인물'],
      ['Product', '갤럭시 S24', '제품'],
      ['Fund', '국민연금', '투자기관'],
      ['Technology', 'HBM', '기술']
    ]
  });

  // Slide 1-3: Relationship Prefix 9가지
  base.addComparisonTable(pres, {
    title: 'Relationship Prefix 9가지',
    slideType: 'theory',
    headers: ['Prefix', '의미', '예시'],
    rows: [
      ['INVESTED_IN', '투자', '국민연금→삼성전자'],
      ['WORKS_AT', '소속', '이재용→삼성전자'],
      ['PRODUCES', '생산', '삼성전자→갤럭시'],
      ['COMPETES_WITH', '경쟁', '삼성전자↔SK하이닉스'],
      ['PARTNERS_WITH', '협력', '삼성전자↔TSMC'],
      ['SUBSIDIARY_OF', '자회사', '삼성SDI→삼성전자'],
      ['USES_TECH', '기술 사용', '갤럭시→Exynos'],
      ['REGULATES', '규제', '공정위→삼성전자'],
      ['SUPPLIES_TO', '공급', 'SK하이닉스→NVIDIA']
    ]
  });

  // ============================================================
  // Section 2: Meta-Dictionary 만들기 (20min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 2,
    sectionTitle: 'Meta-Dictionary 만들기',
    sectionDuration: '20min',
    sectionColor: base.colors.sectionColors[2] // blue
  });

  // Slide 2-1: Meta-Dictionary란?
  base.addFlowDiagram(pres, {
    title: 'Meta-Dictionary란?',
    slideType: 'practice',
    steps: [
      { text: '도메인 문서', color: base.colors.accent },
      { text: '키워드 추출', color: base.colors.primary },
      { text: '패턴 정의', color: base.colors.secondary },
      { text: 'JSON 구조화', color: base.colors.success }
    ],
    callout: '도메인 전문가의 암묵지를 체계화한 관계 키워드 사전'
  });

  // Slide 2-2: Meta-Dictionary JSON 구조
  base.addCodeSlide(pres, {
    title: 'Meta-Dictionary JSON 구조',
    slideType: 'practice',
    language: 'json',
    code: `{
  "INVESTED_IN": {
    "keywords": ["투자", "지분", "보유"],
    "source_type": "Fund",
    "target_type": "Company"
  },
  "PRODUCES": {
    "keywords": ["제조", "출시", "생산"],
    "source_type": "Company",
    "target_type": "Product"
  }
}`,
    notes: 'Part 3에서 이 Dictionary를 LLM 프롬프트에 반영하여 자동 추출 정확도를 높인다.'
  });

  // ============================================================
  // Section 3: 데이터 정제 (20min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 3,
    sectionTitle: '데이터 정제',
    sectionDuration: '20min',
    sectionColor: base.colors.sectionColors[3] // purple
  });

  // Slide 3-1: 뉴스 기사에서 엔티티/관계 추출
  base.addContentSlide(pres, {
    title: '뉴스 기사에서 엔티티/관계 추출',
    slideType: 'practice',
    content: [
      {
        type: 'text',
        text: '예시 기사:\n"국민연금은 삼성전자 지분 9.8%를 보유하고 있다.\n삼성전자는 최신 갤럭시 S24를 출시했다."',
        fontSize: 16,
        y: 1.5
      },
      {
        type: 'text',
        text: '수작업 추출:\n• 엔티티: 국민연금(Fund), 삼성전자(Company), 갤럭시 S24(Product)\n• 관계: 국민연금-[INVESTED_IN]→삼성전자\n         삼성전자-[PRODUCES]→갤럭시 S24',
        fontSize: 14,
        y: 2.8
      },
      {
        type: 'callout',
        text: '💡 밑줄 긋고, 화살표 그리며 패턴 학습',
        color: base.colors.warning,
        y: 4.2
      }
    ]
  });

  // Slide 3-2: 엑셀 정리
  base.addTwoColumnCards(pres, {
    title: '엑셀 정리 — 노드 & 관계 목록',
    slideType: 'practice',
    leftTitle: '노드 목록',
    leftItems: [
      'Entity: 삼성전자',
      'Label: Company',
      'Properties: {name, industry}',
      '',
      'Entity: 국민연금',
      'Label: Fund',
      'Properties: {name, type}'
    ],
    rightTitle: '관계 목록',
    rightItems: [
      'Source: 국민연금',
      'Relation: INVESTED_IN',
      'Target: 삼성전자',
      '',
      'Source: 삼성전자',
      'Relation: PRODUCES',
      'Target: 갤럭시 S24'
    ]
  });

  // ============================================================
  // Section 4: Neo4j 직접 입력 (30min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 4,
    sectionTitle: 'Neo4j 직접 입력',
    sectionDuration: '30min',
    sectionColor: base.colors.sectionColors[4] // orange
  });

  // Slide 4-1: CREATE 문으로 노드 생성
  base.addCodeSlide(pres, {
    title: 'CREATE 문으로 노드 생성',
    slideType: 'practice',
    language: 'cypher',
    code: `CREATE (samsung:Company {
  name: '삼성전자',
  industry: '반도체'
})
CREATE (npf:Fund {
  name: '국민연금',
  type: '공적연금'
})
CREATE (galaxy:Product {
  name: '갤럭시 S24'
})`,
    notes: 'Neo4j Browser에서 실행 → 노드 3개 생성 확인'
  });

  // Slide 4-2: CREATE 문으로 관계 생성
  base.addCodeSlide(pres, {
    title: 'CREATE 문으로 관계 생성',
    slideType: 'practice',
    language: 'cypher',
    code: `MATCH (npf:Fund {name: '국민연금'})
MATCH (samsung:Company {name: '삼성전자'})
CREATE (npf)-[:INVESTED_IN {
  stake: '9.8%'
}]->(samsung)

MATCH (samsung:Company {name: '삼성전자'})
MATCH (galaxy:Product {name: '갤럭시 S24'})
CREATE (samsung)-[:PRODUCES]->(galaxy)`,
    notes: '관계에도 프로퍼티 추가 가능 (stake: 9.8%)'
  });

  // Slide 4-3: 수작업의 한계 체감
  base.addContentSlide(pres, {
    title: '15개 노드, 20개 관계... 손가락이 아프다',
    slideType: 'practice',
    content: [
      {
        type: 'large_text',
        text: '이거 100개 문서면\n어떻게 하지?',
        fontSize: 36,
        bold: true,
        color: base.colors.danger,
        y: 1.8
      },
      {
        type: 'callout',
        text: '⚠️ 수작업의 한계 체감 → Part 3 자동화 동기부여',
        color: base.colors.warning,
        y: 3.8
      }
    ]
  });

  // ============================================================
  // Section 5: 쿼리 실습 + 시각화 (20min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 5,
    sectionTitle: '쿼리 실습 + 시각화',
    sectionDuration: '20min',
    sectionColor: base.colors.sectionColors[5] // cyan
  });

  // Slide 5-1: Multi-hop 질문 직접 해보기
  base.addCodeSlide(pres, {
    title: 'Multi-hop 질문 직접 해보기',
    slideType: 'practice',
    language: 'cypher',
    code: `// 질문: 삼성전자 투자 기관의 다른 투자처는?
MATCH (samsung:Company {name:'삼성전자'})
      <-[:INVESTED_IN]-(fund)
      -[:INVESTED_IN]->(other)
WHERE other <> samsung
RETURN fund.name AS 투자기관,
       other.name AS 다른투자처

// 결과: 국민연금 | SK하이닉스`,
    notes: 'Part 1에서 벡터 RAG가 실패했던 질문을 그래프로 해결'
  });

  // Slide 5-2: 벡터 RAG vs Graph 비교
  base.addTwoColumnCards(pres, {
    title: '벡터 RAG vs Graph — 같은 질문, 다른 결과',
    slideType: 'practice',
    leftTitle: '벡터 RAG',
    leftItems: [
      '질문: 삼성 투자 기관의 다른 투자처는?',
      '',
      '결과: "정확한 정보를 찾을 수 없습니다."',
      '',
      '원인: 청크 분리 → 관계 소실'
    ],
    rightTitle: 'GraphRAG',
    rightItems: [
      '질문: 삼성 투자 기관의 다른 투자처는?',
      '',
      '결과: 국민연금 | SK하이닉스',
      '',
      '장점: 관계 추적으로 정확한 답변'
    ]
  });

  // Slide 5-3: 벡터로 안 되는 질문이 그래프로 되는 순간
  base.addContentSlide(pres, {
    title: '🎯 체감 포인트',
    slideType: 'discussion',
    content: [
      {
        type: 'large_text',
        text: '벡터로 안 되는 질문이\n그래프로 되는 순간!',
        fontSize: 32,
        bold: true,
        color: base.colors.success,
        y: 2.0
      },
      {
        type: 'callout',
        text: '💡 이 경험이 GraphRAG의 핵심 가치를 이해하는 순간',
        color: base.colors.accent,
        y: 3.8
      }
    ]
  });

  // ============================================================
  // Milestone & Next Preview
  // ============================================================
  base.addMilestoneSlide(pres, meta);
  base.addNextPreviewSlide(pres, meta);
};
