export interface PartMeta {
  part: number;
  title: string;
  subtitle: string;
  duration: string;
  difficulty: number; // 1-4 (star count)
  totalSlides: number;
  milestone: string;
  description: string;
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
    totalSlides: 14,
    milestone: 'Neo4j에 첫 그래프 생성 완료 (노드 7개 + 관계 5개)',
    description: 'GraphRAG가 왜 필요한지 이해하고, Neo4j에 첫 데이터를 넣어본다.',
    sections: [
      { id: 'sec1', title: '벡터 RAG의 한계', time: '20min', colorIndex: 0 },
      { id: 'sec2', title: '전략적 관점', time: '15min', colorIndex: 1 },
      { id: 'sec3', title: '온톨로지 핵심', time: '25min', colorIndex: 2 },
      { id: 'sec4', title: '6레이어 프레임워크', time: '15min', colorIndex: 3 },
      { id: 'sec5', title: '인프라: Why Neo4j', time: '5min', colorIndex: 4 },
      { id: 'sec6', title: 'Neo4j + Cypher 실습', time: '40min', colorIndex: 5 },
    ],
    nextPreview: {
      title: 'Part 2: "직접 해봐야 안다" — 수작업 KG',
      description: '뉴스 기사 10개에서 노드 15개, 관계 20개를 손으로 직접 추출하는 "고통의 시간"',
    },
  },
  {
    part: 2,
    title: '수작업 KG',
    subtitle: '직접 해봐야 안다',
    duration: '2시간',
    difficulty: 2,
    totalSlides: 16,
    milestone: '수작업 KG 완성 — 노드 15개, 관계 20개 + Meta-Dictionary',
    description: '도메인 문서에서 엔티티/관계를 손으로 추출하고, KG를 구축한다.',
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
    totalSlides: 15,
    milestone: '자동 추출 KG + 품질 리포트 — 수작업 vs LLM 비교표',
    description: 'LLM으로 엔티티/관계를 자동 추출하고, 수작업 대비 품질을 비교한다.',
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
    totalSlides: 11,
    milestone: '정제된 KG — 중복 제거 완료 (예: 45개 → 30개 노드)',
    description: '중복/유사 엔티티를 통합하여 KG 품질을 높인다.',
    sections: [
      { id: 'sec1', title: 'ER 개념 + 중요성', time: '15min', colorIndex: 0 },
      { id: 'sec2', title: '방법론 비교', time: '15min', colorIndex: 1 },
      { id: 'sec3', title: '실습: 중복 엔티티 통합', time: '30min', colorIndex: 2 },
    ],
    nextPreview: {
      title: 'Part 5: "표와 이미지도 그래프로" — 멀티모달 VLM',
      description: '표/이미지를 포함한 실무 문서를 그래프로 변환한다.',
    },
  },
  {
    part: 5,
    title: '멀티모달 VLM',
    subtitle: '표와 이미지도 그래프로',
    duration: '2시간',
    difficulty: 3,
    totalSlides: 18,
    milestone: '멀티모달 통합 KG — 텍스트 + 표 통합 그래프',
    description: '표/이미지를 포함한 실무 문서를 그래프로 변환한다.',
    sections: [
      { id: 'sec1', title: 'VLM 개념', time: '20min', colorIndex: 0 },
      { id: 'sec2', title: '표→그래프 두 가지 접근', time: '20min', colorIndex: 1 },
      { id: 'sec3', title: '문서→그래프 계층 구조', time: '10min', colorIndex: 2 },
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
    totalSlides: 16,
    milestone: '완성된 GraphRAG 시스템 — 자연어 → 그래프 검색 → 답변 생성',
    description: '자연어 질문 → 그래프 검색 → 답변 생성 파이프라인을 구축한다.',
    sections: [
      { id: 'sec1', title: '파이프라인 통합', time: '15min', colorIndex: 0 },
      { id: 'sec2', title: '기본 Text2Cypher', time: '25min', colorIndex: 1 },
      { id: 'sec3', title: 'Text2Cypher Agent', time: '30min', colorIndex: 2 },
      { id: 'sec4', title: '하이브리드 검색 + 데모', time: '20min', colorIndex: 3 },
    ],
    nextPreview: {
      title: 'Part 7: "프로덕션으로 가는 길" — 실무 적용 가이드',
      description: '품질 평가, 성능 최적화, 운영 방법을 학습한다.',
    },
  },
  {
    part: 7,
    title: '실무 적용 가이드',
    subtitle: '프로덕션으로 가는 길',
    duration: '1시간',
    difficulty: 4,
    totalSlides: 20,
    milestone: '실무 적용 체크리스트 — GDBMS 선정 + Neo4j 최적화 + 평가 기준',
    description: '품질 평가, 성능 최적화, 운영 방법을 학습한다.',
    sections: [
      { id: 'sec1', title: '품질 평가', time: '15min', colorIndex: 0 },
      { id: 'sec2', title: '실패 케이스 + 트러블슈팅', time: '10min', colorIndex: 1 },
      { id: 'sec3', title: 'GDBMS + 성능 최적화', time: '15min', colorIndex: 2 },
      { id: 'sec4', title: '모니터링 + CI/CD', time: '10min', colorIndex: 3 },
      { id: 'sec5', title: '전체 아키텍처 복습 + 확장', time: '10min', colorIndex: 4 },
    ],
  },
];
