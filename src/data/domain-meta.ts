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
    description: '브레이크 패드 제조 공정의 결함 원인을 그래프로 추적합니다. 같은 도메인을 4단계로 확장하며 GraphRAG를 체득합니다.',
    scenario: '브레이크 패드 결함 추적',
    coreQuery: '접착 박리 결함의 근본 원인 공정과 설비는?',
    queryHops: 3,
    difficulty: 4,
    status: 'active',
    stages: [
      { stage: 0, name: '첫 맛보기', nodes: '7개', curriculumParts: 'Part 1', milestone: '7개 노드로 그래프가 뭔지 눈으로 확인' },
      { stage: 1, name: '직접 만들기', nodes: '35개', curriculumParts: 'Part 2~3', milestone: '손으로 35개 노드 KG를 직접 구축해보기' },
      { stage: 2, name: '자동화 + 검색', nodes: '1K', curriculumParts: 'Part 4~6', milestone: 'LLM으로 1K 노드 자동 생성 + 자연어 질문 답변' },
      { stage: 3, name: '실무 배포', nodes: '5K+', curriculumParts: 'Part 7', milestone: '5K+ 노드 프로덕션 시스템 + 품질 대시보드 완성' },
    ],
  },
  {
    id: 'finance',
    name: '금융',
    nameEn: 'Finance',
    icon: '💰',
    description: '금융 거래 네트워크에서 이상 패턴을 그래프로 탐지합니다. 계좌 간 자금 흐름, 거래 빈도, 관계망을 분석하여 사기 거래와 자금 세탁을 추적합니다.',
    scenario: '이상 거래 탐지 및 자금 세탁 추적',
    coreQuery: '의심 계좌와 3단계 이내 연결된 고위험 거래 패턴은?',
    queryHops: 3,
    difficulty: 5,
    status: 'coming-soon',
    stages: [
      { stage: 0, name: '첫 맛보기', nodes: '10개', curriculumParts: 'Part 1', milestone: '10개 계좌-거래 노드로 금융 그래프 이해' },
      { stage: 1, name: '직접 만들기', nodes: '50개', curriculumParts: 'Part 2~3', milestone: '50개 노드 거래 네트워크 수작업 구축' },
      { stage: 2, name: '자동화 + 탐지', nodes: '2K', curriculumParts: 'Part 4~6', milestone: 'LLM으로 2K 노드 자동 생성 + 이상 탐지 질의' },
      { stage: 3, name: '실시간 모니터링', nodes: '10K+', curriculumParts: 'Part 7', milestone: '10K+ 노드 실시간 사기탐지 시스템 완성' },
    ],
  },
  {
    id: 'legal',
    name: '법률',
    nameEn: 'Legal',
    icon: '⚖️',
    description: '대법원 판례 간 인용 관계를 그래프로 구축합니다. 판례-법조문-법리 간 관계를 추적하여 유사 판례 검색과 법률 추론을 지원합니다.',
    scenario: '판례 인용 관계 분석 및 법률 추론',
    coreQuery: '특정 판례를 인용한 판례들의 공통 법리적 근거는?',
    queryHops: 3,
    difficulty: 4,
    status: 'coming-soon',
    stages: [
      { stage: 0, name: '첫 맛보기', nodes: '8개', curriculumParts: 'Part 1', milestone: '8개 판례-법조문 노드로 법률 그래프 이해' },
      { stage: 1, name: '직접 만들기', nodes: '40개', curriculumParts: 'Part 2~3', milestone: '40개 노드 판례 인용 네트워크 수작업 구축' },
      { stage: 2, name: '자동화 + 검색', nodes: '1.5K', curriculumParts: 'Part 4~6', milestone: 'LLM으로 1.5K 노드 자동 구축 + 판례 추론 질의' },
      { stage: 3, name: '법률 AI 어시스턴트', nodes: '8K+', curriculumParts: 'Part 7', milestone: '8K+ 노드 판례 검색 + 법률 추론 시스템 완성' },
    ],
  },
  {
    id: 'it-telecom',
    name: 'IT/텔레콤',
    nameEn: 'IT & Telecom',
    icon: '📡',
    description: 'IT 인프라와 텔레콤 네트워크의 장애 전파 경로를 그래프로 분석합니다. 서버-서비스-네트워크 장비 간 의존성을 추적하여 장애 원인과 영향 범위를 신속히 파악합니다.',
    scenario: '네트워크 장애 전파 경로 분석',
    coreQuery: '특정 서버 장애가 영향을 미치는 다운스트림 서비스 체인은?',
    queryHops: 4,
    difficulty: 3,
    status: 'coming-soon',
    stages: [
      { stage: 0, name: '첫 맛보기', nodes: '8개', curriculumParts: 'Part 1', milestone: '8개 서버-서비스 노드로 인프라 그래프 이해' },
      { stage: 1, name: '직접 만들기', nodes: '30개', curriculumParts: 'Part 2~3', milestone: '30개 노드 인프라 토폴로지 수작업 구축' },
      { stage: 2, name: '자동화 + 분석', nodes: '1K', curriculumParts: 'Part 4~6', milestone: 'LLM으로 1K 노드 자동 구축 + 장애 영향 분석' },
      { stage: 3, name: '장애 관제 시스템', nodes: '5K+', curriculumParts: 'Part 7', milestone: '5K+ 노드 실시간 장애 전파 추적 시스템 완성' },
    ],
  },
];
