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
];
