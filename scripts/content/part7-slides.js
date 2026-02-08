/**
 * Part 7: "실무 적용 가이드" — 프로덕션으로 가는 길
 * Total: 20 slides + title + milestone = 22 slides (no next preview)
 * Duration: 1시간
 * Difficulty: 4/5
 */

module.exports = async function buildPart7(pres, base) {
  const meta = {
    part: 7,
    title: '실무 적용 가이드',
    subtitle: '프로덕션으로 가는 길',
    duration: '1시간',
    difficulty: 4,
    totalSlides: 20,
    milestone: '실무 적용 체크리스트 — GDBMS 선정 + Neo4j 최적화 + 평가 기준',
    nextPreview: null // final part
  };

  // Title slide
  base.addTitleSlide(pres, meta);

  // ============================================================
  // Section 1: 품질 평가 (15min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 1,
    sectionTitle: '품질 평가',
    sectionDuration: '15min',
    sectionColor: base.colors.sectionColors[1] // cyan
  });

  // Slide 1-1: RAGAS 평가 프레임워크
  base.addComparisonTable(pres, {
    title: 'RAGAS 평가 프레임워크',
    slideType: 'theory',
    headers: ['메트릭', '설명', '측정 대상'],
    rows: [
      ['Faithfulness', '답변이 검색 결과에 근거하는가', '환각 방지'],
      ['Answer Relevancy', '답변이 질문에 적절한가', '관련성'],
      ['Context Precision', '검색된 문맥이 정확한가', '검색 품질'],
      ['Context Recall', '필요한 정보가 모두 검색됐는가', '완전성']
    ]
  });

  // Slide 1-2: 질문 난이도 3단계
  base.addComparisonTable(pres, {
    title: '질문 난이도 3단계',
    slideType: 'theory',
    headers: ['난이도', '예시', '벡터 RAG', 'GraphRAG'],
    rows: [
      ['Easy (1-hop)', '삼성전자 CEO는?', '✅', '✅'],
      ['Medium (2-hop)', '삼성 투자기관은?', '⚠️', '✅'],
      ['Hard (Multi-hop)', '삼성 투자기관의 다른 투자처는?', '❌', '✅']
    ],
    callout: 'Hard 질문에서 GraphRAG 진가 발휘'
  });

  // Slide 1-3: Multi-hop 추론 4유형
  base.addComparisonTable(pres, {
    title: 'Multi-hop 추론 4유형',
    slideType: 'theory',
    headers: ['유형', '설명', '예시'],
    rows: [
      ['Chain', 'A→B→C 순차 추론', '투자자→기업→제품'],
      ['Bridge', '공통 노드 경유', '두 기업의 공통 투자자'],
      ['Comparison', '여러 경로 비교', '어느 기업이 더 많이 투자?'],
      ['Aggregation', '경로 + 집계', '투자자 Top 3']
    ]
  });

  // Slide 1-4: 평가 데이터셋 설계
  base.addCodeSlide(pres, {
    title: '평가 데이터셋 설계',
    slideType: 'practice',
    language: 'python',
    code: `eval_dataset = [
    {"question": "삼성전자 CEO는?",
     "answer": "이재용",
     "difficulty": "easy", "hops": 1},
    {"question": "삼성 투자기관의 투자처?",
     "answer": "SK하이닉스",
     "difficulty": "hard", "hops": 3},
]`,
    notes: '난이도별 균형 있게 구성, Golden answer 필수'
  });

  // ============================================================
  // Section 2: 실패 케이스 + 트러블슈팅 (10min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 2,
    sectionTitle: '실패 케이스 + 트러블슈팅',
    sectionDuration: '10min',
    sectionColor: base.colors.sectionColors[2] // blue
  });

  // Slide 2-1: 자주 만나는 실패 패턴
  base.addComparisonTable(pres, {
    title: '자주 만나는 실패 패턴',
    slideType: 'theory',
    headers: ['실패 패턴', '원인', '해결책'],
    rows: [
      ['LLM 환각 관계', '프롬프트 부족', 'Meta-Dictionary 강화'],
      ['VLM 표 오독', '복잡한 셀 병합', '전처리 + 검증 단계'],
      ['Text2Cypher 실패', '스키마 불일치', 'Schema Tuning'],
      ['검색 비용 폭발', '깊은 Multi-hop', 'depth 제한 + 가지치기']
    ]
  });

  // Slide 2-2: 좌절 금지 — 현실적 기대치
  base.addContentSlide(pres, {
    title: '좌절 금지 — 현실적 기대치',
    slideType: 'theory',
    content: [
      {
        type: 'text',
        text: 'GraphRAG는 만능이 아니다. 도메인에 맞는 "적절한 기대치"를 설정하라.',
        fontSize: 18,
        bold: true,
        y: 2.0
      },
      {
        type: 'callout',
        text: '완벽한 KG는 없다. 지속적으로 개선하는 것이 핵심',
        color: base.colors.warning,
        y: 3.5
      }
    ]
  });

  // ============================================================
  // Section 3: GDBMS + 성능 최적화 (15min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 3,
    sectionTitle: 'GDBMS + 성능 최적화',
    sectionDuration: '15min',
    sectionColor: base.colors.sectionColors[3] // purple
  });

  // Slide 3-1: GDBMS 선정 3기준
  base.addComparisonTable(pres, {
    title: 'GDBMS 선정 3기준',
    slideType: 'theory',
    headers: ['기준', '설명', '체크 포인트'],
    rows: [
      ['생태계', 'DB-engines 랭킹, 커뮤니티', 'LangChain/LlamaIndex 연동'],
      ['성능', 'LDBC 벤치마크, 연산 복잡도', 'get_neighbors O(d) vs O(V)'],
      ['적합성', '저장 방식, 쿼리 언어', 'LPG vs RDF, Cypher vs SPARQL']
    ]
  });

  // Slide 3-2: GDBMS 비교
  base.addComparisonTable(pres, {
    title: 'GDBMS 비교 — Neo4j vs Kùzu vs FalkorDB',
    slideType: 'theory',
    headers: ['항목', 'Neo4j', 'Kùzu', 'FalkorDB'],
    rows: [
      ['유형', 'Native Graph', 'Embedded', 'Redis-based'],
      ['라이선스', 'Community/Enterprise', 'MIT', 'Redis Source'],
      ['성능', '✅ 검증됨', '✅ 빠름 (인메모리)', '✅ 빠름'],
      ['생태계', '✅ 1위', '⚠️ 작음', '⚠️ 작음'],
      ['적합성', 'GraphRAG 최적', '분석 최적', '캐시 최적']
    ]
  });

  // Slide 3-3: Graph Query Languages
  base.addComparisonTable(pres, {
    title: 'Graph Query Languages',
    slideType: 'theory',
    headers: ['언어', 'GDBMS', '특징'],
    rows: [
      ['Cypher', 'Neo4j', '패턴 매칭, 직관적'],
      ['Gremlin', 'JanusGraph, Neptune', '순회 기반, 범용'],
      ['GSQL', 'TigerGraph', 'SQL 유사, 분석 강점'],
      ['GQL', 'ISO 표준 (2024)', 'Cypher 계승, 차세대 표준']
    ]
  });

  // Slide 3-4: Neo4j 성능 최적화 7가지
  base.addContentSlide(pres, {
    title: 'Neo4j 성능 최적화 7가지',
    slideType: 'theory',
    content: [
      {
        type: 'text',
        text: '1. 인덱스 생성 (노드 라벨, 프로퍼티)\n2. 쿼리 프로파일링 (PROFILE, EXPLAIN)\n3. APOC 활용 (병렬 처리, 배치)\n4. 배치 처리 (UNWIND, APOC Batch)\n5. 읽기 트랜잭션 (READ 명시)\n6. 파라미터화 (쿼리 캐싱)\n7. 캐싱 (애플리케이션 레벨)',
        fontSize: 14,
        y: 1.8
      }
    ]
  });

  // ============================================================
  // Section 4: 모니터링 + CI/CD (10min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 4,
    sectionTitle: '모니터링 + CI/CD',
    sectionDuration: '10min',
    sectionColor: base.colors.sectionColors[4] // orange
  });

  // Slide 4-1: 모니터링 도구
  base.addComparisonTable(pres, {
    title: '모니터링 도구',
    slideType: 'theory',
    headers: ['도구', '용도', '특징'],
    rows: [
      ['LangSmith', 'LLM 호출 추적', 'LangChain 공식'],
      ['LangFuse', '오픈소스 대안', 'Self-hosted 가능'],
      ['Opik', '경량 추적', 'Comet ML']
    ]
  });

  // Slide 4-2: 서브그래프 관리
  base.addContentSlide(pres, {
    title: '서브그래프 관리',
    slideType: 'theory',
    content: [
      {
        type: 'text',
        text: '• 캐싱 전략: Redis/Memcached로 자주 조회되는 서브그래프 캐싱\n• 정리(pruning) 주기: 사용되지 않는 노드/엣지 주기적 정리\n• 증분 업데이트: 전체 재생성 대신 변경분만 업데이트',
        fontSize: 14,
        y: 1.8
      }
    ]
  });

  // ============================================================
  // Section 5: 전체 아키텍처 복습 + 확장 (10min)
  // ============================================================
  base.addSectionHeader(pres, {
    sectionNum: 5,
    sectionTitle: '전체 아키텍처 복습 + 확장',
    sectionDuration: '10min',
    sectionColor: base.colors.sectionColors[5] // cyan
  });

  // Slide 5-1: 전체 그림 — Part 1 맛보기가 완성됐다
  const slide5_1 = pres.addSlide();
  base.addSlideHeader(slide5_1, '전체 그림 — Part 1 맛보기가 완성됐다', 'theory');

  // Three columns (all items now marked ✅)
  const cols = [
    {
      x: 0.5, title: 'Server',
      items: ['Neo4j←Part1✅', '벡터 인덱스←Part6✅', 'LLM API←Part3✅']
    },
    {
      x: 3.7, title: 'RAG Pipeline',
      items: ['Text2Cypher←Part6✅', '하이브리드 검색←Part6✅']
    },
    {
      x: 6.9, title: 'Client',
      items: ['Streamlit←Part6✅', '모니터링←Part7✅']
    }
  ];

  cols.forEach(col => {
    slide5_1.addShape(pres.ShapeType.rect, {
      x: col.x,
      y: 1.2,
      w: 3.0,
      h: 3.5,
      fill: { color: base.colors.background },
      line: { color: base.colors.border, width: 2 }
    });
    slide5_1.addText(col.title, {
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
      slide5_1.addText(item, {
        x: col.x + 0.2,
        y: 2.0 + i * 0.6,
        w: 2.6,
        h: 0.4,
        fontSize: 14,
        color: base.colors.text // All items now complete
      });
    });
  });

  base.addSlideFooter(slide5_1, 7);

  // Slide 5-2: 확장 방향 — Palantir OAG
  base.addContentSlide(pres, {
    title: '확장 방향 — Palantir OAG',
    slideType: 'theory',
    content: [
      {
        type: 'text',
        text: '• Ontology Application Graph: 대규모 엔터프라이즈 적용\n• 멀티 도메인 통합: 여러 도메인 그래프를 통합하여 전사 지식 그래프 구축\n• 실시간 업데이트: 변경 사항을 실시간으로 그래프에 반영',
        fontSize: 14,
        y: 1.8
      }
    ]
  });

  // Slide 5-3: 수강 후 할 수 있는 것
  base.addContentSlide(pres, {
    title: '수강 후 할 수 있는 것',
    slideType: 'theory',
    content: [
      {
        type: 'text',
        text: '✅ GraphRAG 도입 여부를 스스로 판단\n✅ 도메인 문서에서 KG 구축\n✅ LLM으로 엔티티/관계 자동 추출\n✅ 표/이미지 문서를 그래프로 변환\n✅ Text2Cypher로 자연어 검색 구현\n✅ GraphRAG 품질을 평가하고 개선',
        fontSize: 16,
        bold: true,
        y: 1.8
      }
    ]
  });

  // ============================================================
  // Milestone (no next preview since this is the last part)
  // ============================================================
  base.addMilestoneSlide(pres, meta);
};
