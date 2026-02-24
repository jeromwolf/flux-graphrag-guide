export interface PartMeta {
  part: number;
  title: string;
  subtitle: string;
  duration: string;
  difficulty: number; // 1-5 (star count)
  totalSlides: number;
  milestone: string;
  description: string;
  notebook?: string; // filename in notebooks/ directory
  track?: 'foundation' | 'advanced'; // default: foundation
  sections: {
    id: string;
    title: string;
    time: string;
    colorIndex: number; // index into sectionColors
  }[];
  nextPreview?: {
    title: string;
    description: string;
  };
}

export const curriculumMeta: PartMeta[] = [
  {
    part: 1,
    title: '왜 GraphRAG인가?',
    subtitle: '기초',
    duration: '2시간',
    difficulty: 1,
    totalSlides: 18,
    milestone: 'Neo4j에 첫 그래프 생성 완료 (노드 7개 + 관계 5개)',
    description: 'GraphRAG가 왜 필요한지 이해하고, Neo4j에 첫 데이터를 넣어본다.',
    notebook: 'part1_neo4j_basics.ipynb',
    sections: [
      { id: 'sec1', title: '벡터 RAG의 한계', time: '20min', colorIndex: 0 },
      { id: 'sec2', title: '전략적 관점', time: '15min', colorIndex: 1 },
      { id: 'sec3', title: '온톨로지 핵심', time: '25min', colorIndex: 2 },
      { id: 'sec4', title: '5-Layer 프레임워크', time: '15min', colorIndex: 3 },
      { id: 'sec5', title: '인프라: Why Neo4j', time: '5min', colorIndex: 4 },
      { id: 'sec6', title: 'Neo4j + Cypher 실습', time: '40min', colorIndex: 5 },
    ],
    nextPreview: {
      title: 'Part 2: "직접 해봐야 안다" — 수작업 KG',
      description: '품질 보고서 3개에서 노드 15개, 관계 20개를 손으로 직접 추출하는 "고통의 시간"',
    },
  },
  {
    part: 2,
    title: '수작업 KG',
    subtitle: '직접 해봐야 안다',
    duration: '2시간',
    difficulty: 2,
    totalSlides: 19,
    milestone: '수작업 KG 완성 — 노드 15개, 관계 20개 + Meta-Dictionary',
    description: '도메인 문서에서 엔티티/관계를 손으로 추출하고, KG를 구축한다.',
    notebook: 'part2_manual_kg.ipynb',
    sections: [
      { id: 'sec1', title: '온톨로지 설계 워크숍', time: '30min', colorIndex: 0 },
      { id: 'sec2', title: 'Meta-Dictionary 만들기', time: '20min', colorIndex: 1 },
      { id: 'sec3', title: '데이터 정제', time: '20min', colorIndex: 2 },
      { id: 'sec4', title: 'Neo4j 직접 입력', time: '30min', colorIndex: 3 },
      { id: 'sec5', title: '쿼리 실습 + 시각화', time: '20min', colorIndex: 4 },
    ],
    nextPreview: {
      title: 'Part 3: "자동화해도 완벽하지 않다" — LLM 자동화',
      description: 'LLM으로 엔티티/관계를 자동 추출하고, 수작업 대비 품질을 비교한다.',
    },
  },
  {
    part: 3,
    title: 'LLM 자동화',
    subtitle: '자동화해도 완벽하지 않다',
    duration: '2시간',
    difficulty: 3,
    totalSlides: 17,
    milestone: '자동 추출 KG + 품질 리포트 — 수작업 vs LLM 비교표',
    description: 'LLM으로 엔티티/관계를 자동 추출하고, 수작업 대비 품질을 비교한다.',
    notebook: 'part3_llm_extraction.ipynb',
    sections: [
      { id: 'sec1', title: 'LLM 추출 프롬프트 설계', time: '30min', colorIndex: 0 },
      { id: 'sec2', title: '자동 추출 실행', time: '40min', colorIndex: 1 },
      { id: 'sec3', title: '수작업 vs LLM 비교', time: '30min', colorIndex: 2 },
      { id: 'sec4', title: 'Neo4j 자동 적재', time: '20min', colorIndex: 3 },
    ],
    nextPreview: {
      title: 'Part 4: "같은 건데 다르게 들어갔다" — Entity Resolution',
      description: '중복/유사 엔티티를 통합하여 KG 품질을 높인다.',
    },
  },
  {
    part: 4,
    title: 'Entity Resolution',
    subtitle: '같은 건데 다르게 들어갔다',
    duration: '1시간',
    difficulty: 3,
    totalSlides: 17,
    milestone: '정제된 KG — 중복 제거 완료 (Part 3의 45노드 → 30노드로 통합)',
    description: '중복/유사 엔티티를 통합하여 KG 품질을 높인다.',
    notebook: 'part4_entity_resolution.ipynb',
    sections: [
      { id: 'sec1', title: 'ER 개념 + 중요성', time: '20min', colorIndex: 0 },
      { id: 'sec2', title: '방법론 비교', time: '15min', colorIndex: 1 },
      { id: 'sec3', title: '실습: 중복 엔티티 통합', time: '35min', colorIndex: 2 },
    ],
    nextPreview: {
      title: 'Part 5: "표와 이미지도 그래프로" — 멀티모달 VLM',
      description: '검사 성적표, 공정 흐름도 등 표/이미지를 VLM으로 그래프에 통합한다.',
    },
  },
  {
    part: 5,
    title: '멀티모달 VLM',
    subtitle: '표와 이미지도 그래프로',
    duration: '2시간',
    difficulty: 3,
    totalSlides: 23,
    milestone: '멀티모달 통합 KG — 텍스트 + 표/이미지 통합 그래프 (검사 성적표 + 공정 파라미터)',
    description: '검사 성적표, 공정 파라미터 기록표 등 표/이미지를 VLM으로 그래프에 통합한다.',
    notebook: 'part5_multimodal_table.ipynb',
    sections: [
      { id: 'sec1', title: 'VLM 개념', time: '20min', colorIndex: 0 },
      { id: 'sec2', title: '표→그래프 두 가지 접근', time: '25min', colorIndex: 1 },
      { id: 'sec3', title: '문서→그래프 계층 구조', time: '15min', colorIndex: 2 },
      { id: 'sec4', title: '표 이미지 → 구조화 데이터', time: '30min', colorIndex: 3 },
      { id: 'sec5', title: '구조화 데이터 → KG 적재', time: '30min', colorIndex: 4 },
      { id: 'sec6', title: '중간 점검', time: '10min', colorIndex: 5 },
    ],
    nextPreview: {
      title: 'Part 6: "자연어로 그래프를 검색한다" — 통합 + 검색',
      description: '자연어 질문 → 그래프 검색 → 답변 생성 파이프라인을 구축한다.',
    },
  },
  {
    part: 6,
    title: '통합 + 검색',
    subtitle: '자연어로 그래프를 검색한다',
    duration: '1.5시간',
    difficulty: 4,
    totalSlides: 27,
    milestone: '완성된 GraphRAG 시스템 — 자연어 → 그래프 검색 → 답변 생성',
    description: '자연어 질문 → 그래프 검색 → 답변 생성 파이프라인을 구축한다.',
    notebook: 'part6_text2cypher_rag.ipynb',
    sections: [
      { id: 'sec1', title: '파이프라인 통합', time: '15min', colorIndex: 0 },
      { id: 'sec2', title: '기본 Text2Cypher', time: '25min', colorIndex: 1 },
      { id: 'sec3', title: 'Text2Cypher Agent', time: '30min', colorIndex: 2 },
      { id: 'sec4', title: '하이브리드 검색 + 데모', time: '20min', colorIndex: 3 },
    ],
    nextPreview: {
      title: 'Part 7: "프로덕션으로 가는 길" — 실무 적용 가이드',
      description: 'Part 6에서 만든 GraphRAG 파이프라인의 Text2Cypher 정확도는 몇 %일까요? RAGAS로 측정하고, GDBMS 선정 기준과 성능 최적화를 다룹니다.',
    },
  },
  {
    part: 7,
    title: '실무 적용 가이드',
    subtitle: '프로덕션으로 가는 길',
    duration: '1시간',
    difficulty: 4,
    totalSlides: 31,
    milestone: '실무 적용 체크리스트 — GDBMS 선정 + Neo4j 최적화 + 평가 기준',
    description: '품질 평가, 성능 최적화, 운영 방법을 학습한다.',
    notebook: 'part7_evaluation_production.ipynb',
    sections: [
      { id: 'sec1', title: '품질 평가', time: '15min', colorIndex: 0 },
      { id: 'sec2', title: '실패 케이스 + 트러블슈팅', time: '10min', colorIndex: 1 },
      { id: 'sec3', title: 'GDBMS + 성능 최적화', time: '15min', colorIndex: 2 },
      { id: 'sec4', title: '모니터링 + CI/CD', time: '10min', colorIndex: 3 },
      { id: 'sec5', title: '전체 아키텍처 복습 + 확장', time: '10min', colorIndex: 4 },
      { id: 'sec6', title: '클로징', time: '5min', colorIndex: 5 },
    ],
    nextPreview: {
      title: 'Part 8: "어떤 GraphRAG를 쓸 것인가" — 프레임워크 비교',
      description: 'MS GraphRAG, LightRAG, fast-graphrag를 직접 비교하고 최적의 도구를 선택한다.',
    },
  },
  // ─── Advanced Track ───────────────────────────────────────────
  {
    part: 8,
    title: '프레임워크 비교',
    subtitle: '어떤 GraphRAG를 쓸 것인가',
    duration: '2시간',
    difficulty: 3,
    totalSlides: 26,
    milestone: '프레임워크 선택 가이드 — 3개 프레임워크 벤치마크 + 직접 구현 vs 프레임워크 비교 + 제조 도메인 결론',
    description: 'MS GraphRAG, LightRAG, fast-graphrag를 직접 비교하고, Part 1-7 직접 구현과의 차이를 체감한다.',
    track: 'advanced',
    notebook: 'part8_framework_comparison.ipynb',
    sections: [
      { id: 'sec1', title: 'MS GraphRAG 아키텍처', time: '30min', colorIndex: 0 },
      { id: 'sec2', title: 'LightRAG & fast-graphrag', time: '25min', colorIndex: 1 },
      { id: 'sec3', title: 'LlamaIndex PropertyGraph', time: '20min', colorIndex: 2 },
      { id: 'sec4', title: '벤치마크 + 출력 비교 + 비용', time: '40min', colorIndex: 3 },
      { id: 'sec5', title: '직접 구현 비교 + 의사결정 트리', time: '25min', colorIndex: 4 },
    ],
    nextPreview: {
      title: 'Part 9: "숨겨진 패턴을 찾아라" — 그래프 알고리즘',
      description: '그래프 알고리즘으로 KG의 숨겨진 구조를 발견하고 RAG 품질을 높인다.',
    },
  },
  {
    part: 9,
    title: '그래프 알고리즘',
    subtitle: '숨겨진 패턴을 찾아라',
    duration: '2시간',
    difficulty: 3,
    totalSlides: 25,
    milestone: '알고리즘 강화 GraphRAG — Leiden 커뮤니티 + Personalized PageRank + graphrag_pipeline_v2 통합',
    description: '그래프 알고리즘으로 KG의 숨겨진 구조를 발견하고, Part 6 파이프라인을 강화한다.',
    track: 'advanced',
    notebook: 'part9_graph_algorithms.ipynb',
    sections: [
      { id: 'sec1', title: 'Part 8 연결 + GDS 설치', time: '20min', colorIndex: 0 },
      { id: 'sec2', title: '커뮤니티 탐지 (Leiden)', time: '25min', colorIndex: 1 },
      { id: 'sec3', title: '중심성 + 경로 알고리즘', time: '25min', colorIndex: 2 },
      { id: 'sec4', title: '알고리즘 → RAG 통합', time: '30min', colorIndex: 3 },
      { id: 'sec5', title: '종합 정리 + Part 10 예고', time: '15min', colorIndex: 4 },
    ],
    nextPreview: {
      title: 'Part 10: "AI가 스스로 탐색한다" — Agentic GraphRAG',
      description: 'LangGraph로 멀티에이전트 GraphRAG 시스템을 구축한다.',
    },
  },
  {
    part: 10,
    title: 'Agentic GraphRAG',
    subtitle: 'AI가 스스로 그래프를 탐색한다',
    duration: '2시간',
    difficulty: 4,
    totalSlides: 26,
    milestone: '멀티에이전트 GraphRAG — 5개 Tool + Part 9 알고리즘 통합 + Supervisor 자율 선택 시스템',
    description: 'Part 9의 알고리즘(Leiden, PageRank, 경로)을 Agent Tool로 변환하고, LangGraph Supervisor가 질문 유형별로 자율 선택하는 멀티에이전트 시스템을 구축한다.',
    track: 'advanced',
    notebook: 'part10_agentic_graphrag.ipynb',
    sections: [
      { id: 'sec1', title: 'Part 9 연결 + Agentic RAG 개념', time: '20min', colorIndex: 0 },
      { id: 'sec2', title: 'Graph Tools 5종 설계', time: '25min', colorIndex: 1 },
      { id: 'sec3', title: 'LangGraph 멀티에이전트 구축', time: '40min', colorIndex: 2 },
      { id: 'sec4', title: '자기 수정 + Hallucination 검증', time: '20min', colorIndex: 3 },
      { id: 'sec5', title: '벤치마크 + 비교 + 정리', time: '15min', colorIndex: 4 },
    ],
    nextPreview: {
      title: 'Part 11: "왜 이상한 답이 나오지?" — 디버깅 & 비용 최적화',
      description: 'Part 10의 멀티에이전트는 LLM 호출이 3-5배. 비용을 1/3로 줄이고, Agent 로그 추적으로 디버깅한다.',
    },
  },
  {
    part: 11,
    title: '디버깅 & 비용 최적화',
    subtitle: '왜 이상한 답이 나오지?',
    duration: '2시간',
    difficulty: 4,
    totalSlides: 15,
    milestone: '디버깅 + 최적화 체크리스트 — 장애 플로우차트 + API 비용 50% 절감',
    description: 'GraphRAG 장애를 추적하고, API 비용을 1/3로 줄인다.',
    track: 'advanced',
    notebook: 'part11_debugging_optimization.ipynb',
    sections: [
      { id: 'sec1', title: 'GraphRAG 실패 유형 분류', time: '20min', colorIndex: 0 },
      { id: 'sec2', title: '추적 파이프라인 실습', time: '30min', colorIndex: 1 },
      { id: 'sec3', title: '비용 폭발 구간 식별', time: '20min', colorIndex: 2 },
      { id: 'sec4', title: '비용 최적화 7가지 기법', time: '30min', colorIndex: 3 },
      { id: 'sec5', title: '최적화 전/후 비교', time: '20min', colorIndex: 4 },
    ],
    nextPreview: {
      title: 'Part 12: "회사에 도입한다" — 엔터프라이즈 실전',
      description: 'GraphRAG를 팀/조직에 도입할 때 필요한 실전 지식을 익힌다.',
    },
  },
  {
    part: 12,
    title: '엔터프라이즈 실전',
    subtitle: '회사에 도입한다',
    duration: '1.5시간',
    difficulty: 4,
    totalSlides: 17,
    milestone: '도입 계획서 — 2주 PoC 계획서 + 보안 체크리스트 + CI/CD 설계도',
    description: 'GraphRAG를 팀/조직에 도입할 때 필요한 실전 지식을 익힌다.',
    track: 'advanced',
    notebook: 'part12_enterprise.ipynb',
    sections: [
      { id: 'sec1', title: 'Part 10~11 연결 + 케이스 스터디', time: '20min', colorIndex: 0 },
      { id: 'sec2', title: 'PoC 설계 템플릿', time: '20min', colorIndex: 1 },
      { id: 'sec3', title: '보안 & 컴플라이언스', time: '15min', colorIndex: 2 },
      { id: 'sec4', title: 'CI/CD for KG', time: '20min', colorIndex: 3 },
      { id: 'sec5', title: '운영 + 정리', time: '15min', colorIndex: 4 },
    ],
    nextPreview: {
      title: 'Part 13: "처음부터 끝까지" — 캡스톤 프로젝트',
      description: 'Part 1-12 전체를 통합하여 프로덕션급 GraphRAG를 구축한다.',
    },
  },
  {
    part: 13,
    title: '캡스톤 프로젝트',
    subtitle: '처음부터 끝까지',
    duration: '2.5시간',
    difficulty: 5,
    totalSlides: 20,
    milestone: '프로덕션급 GraphRAG — Part 1~12 통합 E2E 시스템 + 벤치마크 리포트 + 포트폴리오',
    description: 'Part 1-12 전체를 통합하여 프로덕션급 GraphRAG를 구축한다.',
    track: 'advanced',
    sections: [
      { id: 'sec1', title: '프로젝트 킥오프 — Part 1~12 통합 설계', time: '25min', colorIndex: 0 },
      { id: 'sec2', title: 'E2E 구축 — 제조 도메인', time: '30min', colorIndex: 1 },
      { id: 'sec3', title: 'E2E 완성 코드', time: '20min', colorIndex: 2 },
      { id: 'sec4', title: '평가 + 벤치마크', time: '20min', colorIndex: 3 },
      { id: 'sec5', title: '발표 + 회고 + 수료', time: '25min', colorIndex: 4 },
    ],
  },
];
