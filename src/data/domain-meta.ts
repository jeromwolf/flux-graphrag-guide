export interface DomainMeta {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  scenario: string;
  coreQuery: string;
  queryHops: number;
  difficulty: number;
  status: 'active' | 'coming-soon';
  stages: {
    stage: number;
    name: string;
    nodes: string;
    curriculumParts: string;
    milestone: string;
  }[];
}

export const domainsMeta: DomainMeta[] = [
  {
    id: 'manufacturing',
    name: '제조',
    nameEn: 'Manufacturing',
    icon: '🏭',
    description: '자동차 부품(브레이크 패드) 제조 공정의 결함 원인 추적',
    scenario: '브레이크 패드 결함 추적',
    coreQuery: '접착 박리 결함의 근본 원인 공정과 설비는?',
    queryHops: 3,
    difficulty: 4,
    status: 'active',
    stages: [
      { stage: 0, name: '미니 데모', nodes: '7개', curriculumParts: 'Part 1', milestone: 'Neo4j에서 결함→공정→설비 3-hop 시각화 확인' },
      { stage: 1, name: '교육용', nodes: '35개', curriculumParts: 'Part 2~3', milestone: '수작업 KG + LLM KG + 품질 비교 리포트' },
      { stage: 2, name: '프로토타입', nodes: '500~1K', curriculumParts: 'Part 4~6', milestone: 'Streamlit에서 자연어 질문 → 답변 + 그래프 시각화' },
      { stage: 3, name: '서비스급', nodes: '5K+', curriculumParts: 'Part 7', milestone: '배포 가능한 GraphRAG + 품질 대시보드' },
    ],
  },
  {
    id: 'finance',
    name: '금융',
    nameEn: 'Finance',
    icon: '💰',
    description: '거래 네트워크 + AML(자금세탁방지)',
    scenario: '거래 네트워크 분석',
    coreQuery: '이 자금 이동 경로에 의심 패턴이 있는가?',
    queryHops: 4,
    difficulty: 5,
    status: 'coming-soon',
    stages: [
      { stage: 0, name: '미니 데모', nodes: '~10개', curriculumParts: 'Part 1', milestone: '의심 거래 경로 시각화' },
      { stage: 1, name: '교육용', nodes: '~50개', curriculumParts: 'Part 2~3', milestone: '수작업 vs LLM 비교' },
      { stage: 2, name: '프로토타입', nodes: '~1K', curriculumParts: 'Part 4~6', milestone: 'AML 탐지 데모' },
      { stage: 3, name: '서비스급', nodes: '5K+', curriculumParts: 'Part 7', milestone: '거래 모니터링 대시보드' },
    ],
  },
  {
    id: 'legal',
    name: '법률',
    nameEn: 'Legal',
    icon: '⚖️',
    description: '판례 관계 + 조항 참조 분석',
    scenario: '판례 관계 분석',
    coreQuery: '이 사건에 적용 가능한 유사 판례 체인은?',
    queryHops: 4,
    difficulty: 5,
    status: 'coming-soon',
    stages: [
      { stage: 0, name: '미니 데모', nodes: '~10개', curriculumParts: 'Part 1', milestone: '판례 참조 체인 시각화' },
      { stage: 1, name: '교육용', nodes: '~50개', curriculumParts: 'Part 2~3', milestone: '판례 KG 구축' },
      { stage: 2, name: '프로토타입', nodes: '~1K', curriculumParts: 'Part 4~6', milestone: '판례 검색 데모' },
      { stage: 3, name: '서비스급', nodes: '5K+', curriculumParts: 'Part 7', milestone: '법률 자문 보조 시스템' },
    ],
  },
  {
    id: 'it-telecom',
    name: 'IT/통신',
    nameEn: 'IT/Telecom',
    icon: '🖥️',
    description: '장애 전파 + 서비스 의존성 분석',
    scenario: '장애 영향 분석',
    coreQuery: 'DB 장애 시 영향받는 서비스 범위는?',
    queryHops: 3,
    difficulty: 4,
    status: 'coming-soon',
    stages: [
      { stage: 0, name: '미니 데모', nodes: '~10개', curriculumParts: 'Part 1', milestone: '장애 전파 경로 시각화' },
      { stage: 1, name: '교육용', nodes: '~50개', curriculumParts: 'Part 2~3', milestone: '의존성 KG 구축' },
      { stage: 2, name: '프로토타입', nodes: '~1K', curriculumParts: 'Part 4~6', milestone: '장애 예측 데모' },
      { stage: 3, name: '서비스급', nodes: '5K+', curriculumParts: 'Part 7', milestone: '실시간 모니터링 대시보드' },
    ],
  },
];
