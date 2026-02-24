import type { SectionContent, SlideContent } from './part1-content';

export const part12Content: SectionContent[] = [
  // Section 1: Part 10~11 연결 + 케이스 스터디 (20min) — 4 slides
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '12-1',
        tag: 'discussion',
        title: 'Part 10~11 리캡 — 엔터프라이즈 도입의 시작점',
        script: 'Part 10에서 멀티에이전트 시스템을, Part 11에서 디버깅/최적화를 완성했습니다. 이제 "이걸 회사에 도입하려면 어떻게 해야 하는가?"를 다룹니다. PoC 2주 → 프로덕션 2개월 — 보안, CI/CD, 모니터링을 설계합니다. 지금까지 Part 1~11에서 온톨로지 설계, LLM 추출, Entity Resolution, 하이브리드 검색, 멀티에이전트, 디버깅까지 전부 만들었습니다. 이 모든 것을 "2주 PoC"로 압축해서 경영진을 설득하고, "2개월 프로덕션"으로 확장하는 전략을 배웁니다. 기술이 아무리 좋아도, 도입 프로세스를 모르면 사내에서 사장됩니다.',
        table: {
          headers: ['일차', '활동', '해당 Part', '산출물'],
          rows: [
            {
              cells: [
                { text: 'Day 1-2', bold: true },
                { text: '온톨로지 + Meta-Dictionary' },
                { text: 'Part 2' },
                { text: '스키마 정의서' }
              ]
            },
            {
              cells: [
                { text: 'Day 3-4', bold: true },
                { text: 'LLM 추출 + VLM' },
                { text: 'Part 3, 5' },
                { text: 'KG 파이프라인' }
              ]
            },
            {
              cells: [
                { text: 'Day 5', bold: true },
                { text: 'Entity Resolution + Neo4j 적재' },
                { text: 'Part 4' },
                { text: 'Neo4j Graph (100+ 노드)' }
              ]
            },
            {
              cells: [
                { text: 'Day 6-7', bold: true },
                { text: '하이브리드 검색 + Text2Cypher' },
                { text: 'Part 6' },
                { text: 'Agent 파이프라인' }
              ]
            },
            {
              cells: [
                { text: 'Day 8', bold: true },
                { text: '멀티에이전트 구축' },
                { text: 'Part 10' },
                { text: 'Supervisor + 5 Tools' }
              ]
            },
            {
              cells: [
                { text: 'Day 9', bold: true },
                { text: 'RAGAS 평가 + 디버깅' },
                { text: 'Part 7, 11' },
                { text: 'RAGAS 리포트' }
              ]
            },
            {
              cells: [
                { text: 'Day 10', bold: true },
                { text: '비용 최적화 + 리포트' },
                { text: 'Part 11' },
                { text: '경영진 보고서' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: 'Part 1~11의 모든 기술을 2주 PoC로 압축 — 경영진 설득 → 2개월 프로덕션 확장'
        }
      },
      {
        id: '12-2',
        tag: 'theory',
        title: '제조 KG 도입 성공 사례 — 우리 스키마 적용',
        script: '첫 번째 성공 사례는 우리가 Part 2~10에서 구축한 제조 KG를 기업에 도입하는 시나리오입니다. "접착 박리의 원인 공정 추적"이 핵심 과제였습니다. 기존에는 품질 관리자가 접착 박리 결함이 발생하면 수작업으로 원인을 추적했습니다. "접착 도포 → 경화 → 검사" 단계를 하나씩 확인하면서 "접착기 A-3의 도포량 편차인지, 재료 로트 문제인지, 경화 온도 이탈인지" 2시간씩 조사했습니다. GraphRAG 도입 후, Process-Equipment-Defect-Material-Product 온톨로지를 구축하고, 멀티에이전트가 다단계 원인 추적을 자동화했습니다. "접착 박리 → 접착 도포 공정 → 접착기 A-3 도포량 편차 → 접착제 LOT-2024-03 점도 이상 → 재료 입고 시 검사 누락" — 이 5-hop 추적을 5분 만에 완료합니다. 결과: 다단계 원인 추적 정확도가 35%에서 82%로 향상됐고, 평균 조치 시간이 2시간에서 15분으로 줄었습니다.',
        diagram: {
          nodes: [
            { text: '접착 박리 (Defect)', type: 'fail' },
            { text: '← DETECTED_IN', type: 'relation' },
            { text: '접착 도포 (Process)', type: 'entity' },
            { text: '← USES_EQUIPMENT', type: 'relation' },
            { text: '접착기 A-3 (Equipment)', type: 'entity' },
            { text: '← USES_MATERIAL', type: 'relation' },
            { text: '접착제 LOT-2024-03 (Material)', type: 'entity' },
            { text: '5-hop 다단계 원인 추적', type: 'dim' }
          ]
        },
        table: {
          headers: ['항목', '도입 전', '도입 후', '개선율'],
          rows: [
            {
              cells: [
                { text: '다단계 원인 추적 정확도', bold: true },
                { text: '~35%', status: 'fail' },
                { text: '~82%', status: 'pass' },
                { text: '+134%' }
              ]
            },
            {
              cells: [
                { text: '평균 조치 시간', bold: true },
                { text: '2시간' },
                { text: '15분' },
                { text: '-87%' }
              ]
            },
            {
              cells: [
                { text: '생산 중단 비용 절감', bold: true },
                { text: '-' },
                { text: '연간 30억 원' },
                { text: '-' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: 'Part 2~10에서 구축한 Process-Equipment-Defect-Material 온톨로지 — 다단계 원인 추적 정확도 35%→82%'
        }
      },
      {
        id: '12-3',
        tag: 'theory',
        title: '타 도메인 성공 사례 — 보험사 약관 비교',
        script: '다른 도메인의 성공 사례도 살펴봅시다. 국내 대형 보험사가 약관 비교 시스템에 GraphRAG를 도입했습니다. 우리 제조 도메인과는 다른 환경이지만, 도입 전략은 동일합니다. 상담사가 고객 문의에 답변할 때 여러 상품의 보장 범위를 비교해야 했습니다. "암보험 A와 B 중 어느 게 갑상선암을 보장하나요?" 같은 비교 질문에 기존 벡터 RAG는 실패했습니다. 400개 보험 상품 약관에서 Product-Coverage-Disease 관계 그래프를 구축했습니다. Text2Cypher Agent로 비교 질문을 처리하니, 정확도가 30%에서 85%로 향상됐습니다. 핵심 교훈: 도메인은 달라도, "Multi-hop 비교 질문이 많다"면 GraphRAG가 답입니다. 우리 제조 도메인에서도 "접착기 A-3과 B-2의 불량률 비교"같은 비교 질문에 동일한 패턴을 적용할 수 있습니다.',
        table: {
          headers: ['항목', '도입 전', '도입 후', '개선율'],
          rows: [
            {
              cells: [
                { text: '비교 질문 정확도', bold: true },
                { text: '~30%', status: 'fail' },
                { text: '~85%', status: 'pass' },
                { text: '+183%' }
              ]
            },
            {
              cells: [
                { text: '응답 시간', bold: true },
                { text: '평균 5분' },
                { text: '평균 1분' },
                { text: '-80%' }
              ]
            },
            {
              cells: [
                { text: 'ROI 회수 기간', bold: true },
                { text: '-' },
                { text: '6개월' },
                { text: '-' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '도메인은 달라도 패턴은 같다 — Multi-hop 비교 질문이 많으면 GraphRAG가 답'
        }
      },
      {
        id: '12-4',
        tag: 'theory',
        title: '실패 사례 — 커머스 상품 추천',
        script: '세 번째 사례는 실패 사례입니다. 한 이커머스 기업이 "구매 패턴 그래프로 개인화 추천"을 시도했습니다. 실패 원인을 분석해봅시다. 첫째, 문제 정의 실패. Multi-hop 질문이 실제로 필요하지 않았습니다. "이 상품을 산 사람은 저것도 샀다"는 1-hop 질문이었기 때문입니다. 협업 필터링으로 충분했습니다. 둘째, 데이터 품질 무시. 구매 데이터는 있었지만 상품 메타데이터가 부실했습니다. 브랜드, 카테고리가 통일되지 않아 그래프가 분절됐습니다. 셋째, 비용 폭발. 실시간 추천을 위해 매번 그래프 쿼리를 실행하니 비용이 급증했습니다. 캐싱 전략이 없었습니다. 교훈: GraphRAG는 만능이 아닙니다. Part 1에서 배운 "1-hop이면 벡터로 충분하다" 판단 기준을 기억하세요. 문제 정의부터 다시 하고, 데이터 품질을 먼저 확보하고, 비용 시뮬레이션을 PoC 단계에서 하세요.',
        table: {
          headers: ['실패 원인', '당시 판단', '올바른 접근'],
          rows: [
            {
              cells: [
                { text: '문제 정의 실패', bold: true },
                { text: 'GraphRAG로 개인화 강화', status: 'fail' },
                { text: '협업 필터링으로 충분' }
              ]
            },
            {
              cells: [
                { text: '데이터 품질 무시', bold: true },
                { text: '구매 데이터만 확보', status: 'fail' },
                { text: '메타데이터 정제 우선' }
              ]
            },
            {
              cells: [
                { text: '비용 폭발', bold: true },
                { text: '실시간 쿼리 실행', status: 'fail' },
                { text: '캐싱 전략 + 배치 처리' }
              ]
            }
          ]
        },
        callout: {
          type: 'warn',
          text: 'GraphRAG는 만능이 아니다 — Part 1의 판단 기준: 1-hop이면 벡터로 충분'
        }
      }
    ]
  },
  // Section 2: PoC 설계 템플릿 (20min) — 3 slides
  {
    sectionId: 'sec2',
    slides: [
      {
        id: '12-5',
        tag: 'practice',
        title: '2주 PoC 계획서 — Part 1~11 맵핑',
        script: 'PoC는 2주가 적정합니다. 더 길면 본 프로젝트처럼 변하고, 짧으면 검증이 부족합니다. Week 1에는 데이터 + KG 구축에 집중합니다. Day 1-2는 Part 2의 온톨로지 설계와 Meta-Dictionary 작성입니다. Day 3-4는 Part 3, 5의 LLM 추출과 VLM 파이프라인 구축입니다. Day 5는 Part 4의 Entity Resolution과 Neo4j 적재, 품질 검증입니다. Week 2는 검색 + 평가입니다. Day 6-7은 Part 6의 하이브리드 검색과 Text2Cypher Agent 구축입니다. Day 8은 Part 10의 멀티에이전트 시스템 구축입니다. Day 9는 Part 7, 11의 RAGAS 평가와 디버깅입니다. Day 10은 Part 11의 비용 최적화와 경영진 보고서 작성입니다. Part 7에서 만든 RAGAS 데이터셋(20개 질문)을 PoC 평가에 그대로 사용합니다. 새로 만들 필요 없이, 커리큘럼에서 축적한 자산을 바로 쓸 수 있습니다. 핵심은 "최소 기능으로 핵심 가설을 검증"하는 것입니다. 전체 데이터가 아니라 제조 품질 보고서 100건 샘플로 시작하세요.',
        table: {
          headers: ['주차', '일정', '해당 Part', '산출물', '검증 기준'],
          rows: [
            {
              cells: [
                { text: 'Week 1', bold: true },
                { text: 'Day 1-2: 온톨로지 설계' },
                { text: 'Part 2' },
                { text: 'Meta-Dictionary' },
                { text: '도메인 전문가 리뷰 통과' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: 'Day 3-4: LLM 추출 + VLM' },
                { text: 'Part 3, 5' },
                { text: 'KG 파이프라인' },
                { text: '샘플 10개 정확도 70%+' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: 'Day 5: ER + 품질 검증' },
                { text: 'Part 4' },
                { text: 'Neo4j Graph (100 노드)' },
                { text: '관계 연결률 80%+' }
              ]
            },
            {
              cells: [
                { text: 'Week 2', bold: true },
                { text: 'Day 6-7: 하이브리드 검색' },
                { text: 'Part 6' },
                { text: 'Agent 파이프라인' },
                { text: '질문 10개 성공률 60%+' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: 'Day 8: 멀티에이전트' },
                { text: 'Part 10' },
                { text: 'Supervisor + Tools' },
                { text: '복합 질문 처리 확인' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: 'Day 9: RAGAS 평가 + 디버깅' },
                { text: 'Part 7, 11' },
                { text: 'RAGAS 리포트' },
                { text: 'Hard 질문 정확도 70%+' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: 'Day 10: 비용 최적화 + 보고' },
                { text: 'Part 11' },
                { text: '경영진 보고서' },
                { text: 'ROI 시뮬레이션 완료' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '2주 PoC = Part 1~11 압축 재현 — Part 7 RAGAS 데이터셋(20개 질문)을 PoC 평가에 그대로 재사용'
        }
      },
      {
        id: '12-6',
        tag: 'practice',
        title: '성공 기준 정의 — RAGAS 데이터셋 재사용',
        script: 'PoC 성공 기준은 정량적으로 정의해야 합니다. 3가지 카테고리로 나눕니다. 첫째, 정확도 메트릭. Easy 질문 90%+, Medium 질문 80%+, Hard 질문(다단계 원인 추적) 70%+. RAGAS Faithfulness 0.8+. Part 7에서 만든 RAGAS 데이터셋(20개 질문)을 PoC 평가에 그대로 사용합니다. 제조 도메인의 "접착 박리 원인 공정은?", "접착기 A-3의 최근 정비 이력은?" 같은 질문이 이미 준비돼 있습니다. 둘째, 성능 메트릭. 평균 응답 시간 3초 이내, 99%ile 응답 시간 10초 이내. 셋째, 비용 메트릭. 질문당 API 비용 $0.10 이하, 월간 인프라 비용 $500 이하. 이 기준을 사전에 이해관계자와 합의하세요. PoC 끝에 "성공인가 실패인가" 논쟁을 피할 수 있습니다.',
        table: {
          headers: ['메트릭 카테고리', '항목', '목표값', '측정 방법'],
          rows: [
            {
              cells: [
                { text: '정확도', bold: true },
                { text: 'Easy 질문 정확도' },
                { text: '90%+', status: 'pass' },
                { text: 'Part 7 RAGAS 데이터셋' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: 'Hard 질문 (원인 추적)' },
                { text: '70%+', status: 'pass' },
                { text: 'Part 7 RAGAS 데이터셋' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: 'RAGAS Faithfulness' },
                { text: '0.8+', status: 'pass' },
                { text: 'ragas.metrics.faithfulness' }
              ]
            },
            {
              cells: [
                { text: '성능', bold: true },
                { text: '평균 응답 시간' },
                { text: '3초 이내' },
                { text: 'LangSmith trace' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: '99%ile 응답 시간' },
                { text: '10초 이내' },
                { text: 'LangSmith percentile' }
              ]
            },
            {
              cells: [
                { text: '비용', bold: true },
                { text: '질문당 API 비용' },
                { text: '$0.10 이하' },
                { text: 'OpenAI usage API' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: '월간 인프라 비용' },
                { text: '$500 이하' },
                { text: 'Neo4j Aura / AWS 청구서' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: 'Part 7 RAGAS 데이터셋 재사용 — 정량 기준을 사전 합의하여 PoC 끝에 논쟁 방지'
        }
      },
      {
        id: '12-7',
        tag: 'practice',
        title: '경영진 보고용 1-page — 제조 도메인 버전',
        script: 'PoC 결과를 경영진에게 보고할 때 1-page 요약이 필수입니다. 제조 도메인으로 작성해봅시다. 구조는 이렇습니다. 첫째, 배경 (2줄). "기존 벡터 RAG는 다단계 원인 추적 정확도 35% — 품질 관리자가 접착 박리 원인 파악에 평균 2시간 소요". 둘째, 솔루션 (3줄). "제조 품질 보고서 200건에서 Process-Equipment-Defect-Material 관계 그래프를 구축. 멀티에이전트가 다단계 원인 추적을 자동화." 셋째, 결과 (숫자로). "정확도 35%→82%, 조치 시간 2시간→15분". 넷째, ROI. "연간 생산 중단 비용 절감 30억, 투자 비용 8천만원, 3개월 회수". 다섯째, 다음 단계. "프로덕션 전환 2개월, 전 공장 3개 라인 확대 적용". 경영진은 숫자와 ROI를 원합니다. 기술적 세부사항은 부록에 넣으세요.',
        code: {
          language: 'markdown',
          code: `# 제조 품질 GraphRAG PoC 결과 요약 (1-Page)

## 배경
- 기존 벡터 RAG는 다단계 원인 추적 정확도 35%
- 품질 관리자가 접착 박리 원인 파악에 평균 2시간 소요

## 솔루션
- 제조 품질 보고서 200건에서 GraphRAG 구축
- Process-Equipment-Defect-Material-Product 온톨로지
- 멀티에이전트(Part 10)가 다단계 원인 추적 자동화

## 결과 (정량)
| 메트릭 | Before | After | 개선율 |
|-------|--------|-------|--------|
| 다단계 원인 추적 정확도 | 35% | 82% | +134% |
| 평균 조치 시간 | 2시간 | 15분 | -87% |
| 품질 관리자 만족도 | 4.8/10 | 8.5/10 | +77% |

## ROI
- 연간 생산 중단 비용 절감: 30억 원
- 투자 비용: 8천만 원 (개발 + 인프라 6개월)
- **ROI 회수: 3개월**

## Next Steps
1. 프로덕션 전환 (2개월) — 전 공장 품질 관리 시스템 통합
2. 3개 생산 라인 확대 (접착 → 도장 → 조립)
3. 자동 KG 업데이트 파이프라인 구축 (Part 12 CI/CD)`
        },
        callout: {
          type: 'tip',
          text: '경영진은 숫자와 ROI를 원한다 — 제조 도메인: 생산 중단 비용 절감 30억 강조'
        }
      }
    ]
  },
  // Section 3: 보안 & 컴플라이언스 (15min) — 3 slides
  {
    sectionId: 'sec3',
    slides: [
      {
        id: '12-8',
        tag: 'theory',
        title: 'PII 처리 — 제조 도메인 개인정보 마스킹',
        script: 'GraphRAG를 제조, 금융, 의료 도메인에 적용하면 개인정보(PII)가 엔티티로 추출될 수 있습니다. 제조 도메인 예를 보겠습니다. "설비 정비 담당자 홍길동이 접착기 A-3을 점검" — 이 문장에서 담당자명이 Person 노드로 추출됩니다. "정비 이력에 작업자 개인정보(사번, 연락처) 포함" — 마스킹이 필수입니다. 의료 쪽도 마찬가지입니다. "김철수 환자가 서울대병원에서 암 진단"에서 실명이 추출되면 GDPR, 개인정보보호법 위반입니다. 해결책 3가지를 보겠습니다. 첫째, 마스킹. LLM 추출 전에 PII를 마스킹합니다. "홍길동" → "작업자_A", "사번 12345" → "[MASKED]". 둘째, 암호화. 노드 프로퍼티를 AES 암호화해서 저장합니다. 쿼리 시에만 복호화합니다. 셋째, 접근 제어. Neo4j RBAC로 민감 노드에 대한 접근을 제한합니다. 핵심은 "추출 전 마스킹 + 저장 시 암호화 + 조회 시 RBAC" 3단 방어입니다.',
        table: {
          headers: ['방법', '적용 시점', '제조 도메인 예시', '장점', '단점'],
          rows: [
            {
              cells: [
                { text: '마스킹', bold: true },
                { text: 'LLM 추출 전' },
                { text: '"홍길동" → "작업자_A"' },
                { text: '근본적 차단', status: 'pass' },
                { text: '원본 복구 불가' }
              ]
            },
            {
              cells: [
                { text: '암호화', bold: true },
                { text: 'Neo4j 저장 시' },
                { text: '사번/연락처 AES 암호화' },
                { text: '원본 복구 가능' },
                { text: '쿼리 성능 저하', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: 'RBAC', bold: true },
                { text: 'Neo4j 조회 시' },
                { text: '정비팀만 작업자 정보 조회' },
                { text: '세밀한 권한 제어', status: 'pass' },
                { text: '설정 복잡도 높음' }
              ]
            }
          ]
        },
        callout: {
          type: 'warn',
          text: 'PII 처리는 법적 의무 — 제조 도메인도 정비 담당자명/사번 마스킹 필수'
        }
      },
      {
        id: '12-9',
        tag: 'theory',
        title: 'Neo4j RBAC + 서브그래프 격리',
        script: 'Neo4j Enterprise는 RBAC(Role-Based Access Control)를 지원합니다. 역할별로 노드, 관계, 프로퍼티 접근을 제어할 수 있습니다. 제조 도메인에서는 "품질팀은 Defect, Process 노드 조회 가능, 정비 담당자 개인정보 노드는 조회 불가"로 설정합니다. 서브그래프 격리는 한 단계 더 나아갑니다. 공장별로 서브그래프를 분리해서 저장합니다. 예를 들어 접착 라인 그래프와 도장 라인 그래프를 물리적으로 분리합니다. Neo4j Fabric을 사용하면 여러 데이터베이스를 논리적으로 통합해서 쿼리할 수 있습니다. 권한이 있는 서브그래프만 조회됩니다.',
        code: {
          language: 'cypher',
          code: `// Neo4j RBAC 설정 예시 — 제조 도메인

// 1. 역할 생성
CREATE ROLE quality_engineer;
CREATE ROLE maintenance_staff;
CREATE ROLE admin;

// 2. 권한 부여
// 품질팀은 Defect, Process, Equipment 노드만 조회 가능
GRANT MATCH {*} ON GRAPH * NODES Defect TO quality_engineer;
GRANT MATCH {*} ON GRAPH * NODES Process TO quality_engineer;
GRANT MATCH {*} ON GRAPH * NODES Equipment TO quality_engineer;

// 정비팀은 Equipment, Maintenance 노드 조회 가능
GRANT MATCH {*} ON GRAPH * NODES Equipment TO maintenance_staff;
GRANT MATCH {*} ON GRAPH * NODES Maintenance TO maintenance_staff;

// 관리자는 모든 노드 조회 가능
GRANT MATCH {*} ON GRAPH * TO admin;

// 3. 프로퍼티 단위 접근 제어 (Enterprise)
// 정비 담당자 개인정보 차단
DENY READ {worker_name, worker_phone} ON GRAPH * NODES Maintenance TO quality_engineer;

// 4. 서브그래프 격리 (Fabric)
USE fabric.adhesion_line
MATCH (d:Defect)-[:DETECTED_IN]->(p:Process) RETURN d, p
// 접착 라인 서브그래프만 조회`
        },
        callout: {
          type: 'key',
          text: 'Neo4j RBAC + Fabric으로 공장/라인별 서브그래프 격리 가능'
        }
      },
      {
        id: '12-10',
        tag: 'theory',
        title: '감사 로그 — 누가 어떤 쿼리를 실행했는지',
        script: '제조, 금융, 의료 도메인에서는 감사 로그(Audit Log)가 컴플라이언스 필수 요구사항입니다. "누가, 언제, 어떤 쿼리를 실행했는지" 기록해야 합니다. Neo4j Enterprise는 쿼리 로그를 자동으로 기록합니다. query.log 파일에 모든 Cypher 쿼리가 저장됩니다. 이걸 Elasticsearch나 Splunk로 전송해서 실시간 모니터링하세요. 애플리케이션 레벨에서도 로그를 남겨야 합니다. LangSmith나 LangFuse로 LLM 호출을 추적하고, 사용자 ID, 쿼리, 결과를 로깅합니다. GDPR Article 30은 "처리 활동 기록"을 의무화합니다. 감사 로그 없이는 컴플라이언스 통과가 불가능합니다.',
        table: {
          headers: ['로그 레벨', '기록 대상', '도구', '보존 기간'],
          rows: [
            {
              cells: [
                { text: 'DB 레벨', bold: true },
                { text: '모든 Cypher 쿼리' },
                { text: 'Neo4j query.log' },
                { text: '최소 1년' }
              ]
            },
            {
              cells: [
                { text: 'App 레벨', bold: true },
                { text: 'LLM 호출 + 사용자 ID' },
                { text: 'LangSmith / LangFuse' },
                { text: '최소 1년' }
              ]
            },
            {
              cells: [
                { text: '통합 분석', bold: true },
                { text: '이상 패턴 탐지' },
                { text: 'Elasticsearch / Splunk' },
                { text: '실시간 + 1년 보관' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: 'GDPR Article 30 — 처리 활동 기록 의무 / 감사 로그는 컴플라이언스 필수'
        }
      }
    ]
  },
  // Section 4: CI/CD for KG (20min) — 3 slides
  {
    sectionId: 'sec4',
    slides: [
      {
        id: '12-11',
        tag: 'theory',
        title: '스키마 마이그레이션 전략',
        script: 'Knowledge Graph도 스키마가 진화합니다. 새로운 엔티티 타입이 추가되거나, 관계 타입이 변경됩니다. 우리 제조 KG에서도 처음에는 Process-Equipment-Defect 3개였지만, Part 5에서 Material, Product를 추가하고, Part 10에서 Spec, Maintenance까지 확장했습니다. RDB처럼 ALTER TABLE을 하면 안 됩니다. 그래프는 유연하지만, 스키마 변경 시 하위 호환성(Backward Compatibility)을 유지해야 합니다. 전략 3가지를 보겠습니다. 첫째, Schema Versioning. 스키마 버전을 명시합니다. 예: Equipment:v1, Equipment:v2. 구 버전과 신 버전을 병행 운영합니다. 둘째, Additive Changes Only. 기존 노드/관계를 삭제하지 말고 새로운 것만 추가합니다. Deprecated 라벨로 표시합니다. 셋째, Migration Script. Cypher로 마이그레이션 스크립트를 작성합니다. 핵심은 "기존 쿼리가 깨지지 않도록" 하는 것입니다.',
        table: {
          headers: ['전략', '방법', '장점', '단점'],
          rows: [
            {
              cells: [
                { text: 'Schema Versioning', bold: true },
                { text: 'Equipment:v1, Equipment:v2 병행' },
                { text: '하위 호환성 유지', status: 'pass' },
                { text: '중복 노드 증가' }
              ]
            },
            {
              cells: [
                { text: 'Additive Changes', bold: true },
                { text: '삭제 금지, 추가만 허용' },
                { text: '기존 쿼리 안전', status: 'pass' },
                { text: 'Deprecated 관리 필요' }
              ]
            },
            {
              cells: [
                { text: 'Migration Script', bold: true },
                { text: 'Cypher로 v1→v2 변환' },
                { text: '자동화 가능' },
                { text: '스크립트 유지보수', status: 'warn' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: 'Schema Versioning + Additive Changes — 기존 쿼리 보호'
        }
      },
      {
        id: '12-12',
        tag: 'practice',
        title: '증분 업데이트 파이프라인 — 제조 설비 데이터',
        script: 'KG를 매번 전체 재생성하면 비용이 큽니다. 증분 업데이트(Incremental Update)로 변경분만 반영하세요. Airflow DAG로 파이프라인을 구성합니다. 첫째, 변경 탐지. 품질 보고서의 Last Modified 시간을 추적합니다. 변경된 문서만 추출합니다. 둘째, 기존 노드 업데이트. MERGE 문으로 Equipment, Process 등 구체적인 노드 타입을 사용합니다. 셋째, 고아 노드 정리. 더 이상 참조되지 않는 노드를 삭제합니다. 넷째, 품질 검증. 업데이트 후 관계 연결률을 확인합니다. Neo4j 드라이버 초기화에 하드코딩 대신 os.getenv로 환경변수를 사용합니다. 이 파이프라인을 매일 밤 자동 실행하면 항상 최신 KG를 유지할 수 있습니다.',
        code: {
          language: 'python',
          code: `# Airflow DAG for Incremental KG Update — 제조 설비 데이터
import os
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
from neo4j import GraphDatabase
# Claude 옵션: from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI

# 환경변수로 Neo4j 인증 — 절대 하드코딩 금지
driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI", "bolt://localhost:7687"),
    auth=(os.getenv("NEO4J_USER", "neo4j"), os.getenv("NEO4J_PASSWORD"))
)

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
# Claude 옵션: llm = ChatAnthropic(model="claude-sonnet-4-20250514")

def detect_changes():
    """변경된 품질 보고서 탐지"""
    last_update = get_last_update_time()
    changed_docs = [d for d in all_docs if d.modified > last_update]
    return changed_docs

def extract_and_update(docs):
    """LLM 추출 + Neo4j MERGE — 구체적인 노드 타입 사용"""
    with driver.session() as session:
        for doc in docs:
            entities = llm_extract(doc)
            for ent in entities:
                if ent.type == "equipment":
                    session.run("""
                        MERGE (e:Equipment {id: $id})
                        SET e.name = $name,
                            e.last_maintenance = $date,
                            e.updated_at = datetime()
                    """, id=ent.id, name=ent.name, date=ent.date)
                elif ent.type == "defect":
                    session.run("""
                        MERGE (d:Defect {id: $id})
                        SET d.name = $name,
                            d.severity = $severity,
                            d.updated_at = datetime()
                    """, id=ent.id, name=ent.name, severity=ent.severity)
                elif ent.type == "process":
                    session.run("""
                        MERGE (p:Process {id: $id})
                        SET p.name = $name,
                            p.line = $line,
                            p.updated_at = datetime()
                    """, id=ent.id, name=ent.name, line=ent.line)

def cleanup_orphans():
    """고아 노드 정리 — 제조 엔티티 타입별"""
    with driver.session() as session:
        for label in ["Equipment", "Process", "Defect", "Material"]:
            session.run(f"""
                MATCH (e:{label})
                WHERE NOT (e)--()
                DELETE e
            """)

def validate_quality():
    """품질 검증"""
    with driver.session() as session:
        result = session.run(
            "MATCH (e:Equipment) RETURN count(e) as cnt"
        ).single()
        # 연결률 체크 등

dag = DAG('kg_incremental_update',
          schedule_interval='0 2 * * *',  # 매일 새벽 2시
          start_date=datetime(2024, 1, 1))

detect = PythonOperator(task_id='detect', python_callable=detect_changes, dag=dag)
update = PythonOperator(task_id='update', python_callable=extract_and_update, dag=dag)
cleanup = PythonOperator(task_id='cleanup', python_callable=cleanup_orphans, dag=dag)
validate = PythonOperator(task_id='validate', python_callable=validate_quality, dag=dag)

detect >> update >> cleanup >> validate`
        },
        callout: {
          type: 'key',
          text: '증분 업데이트 — os.getenv()로 인증 + Equipment/Defect/Process 구체적 노드 타입 사용'
        }
      },
      {
        id: '12-13',
        tag: 'practice',
        title: 'KG 품질 게이트 — Equipment/Process 타입 검증',
        script: 'CI/CD 파이프라인에 KG 품질 게이트를 추가하세요. 품질이 기준 이하면 배포를 차단합니다. 4가지 체크를 자동화합니다. 첫째, 노드 수 체크. 급격한 증감을 탐지합니다. 예: 전날 대비 플러스마이너스 30% 이상 변화 시 알림. 둘째, 관계 연결률. 고아 노드 비율이 10% 이하인지 확인합니다. 셋째, 스키마 일관성. Equipment의 name, type 필수 프로퍼티가 누락되지 않았는지, Process의 line 정보가 있는지 확인합니다. 넷째, 샘플 쿼리 테스트. 핵심 질문 10개를 자동 실행해서 성공률을 체크합니다. 모든 게이트 통과 시에만 배포합니다. 실패 시 Slack으로 알림합니다.',
        code: {
          language: 'python',
          code: `# KG Quality Gate for CI/CD — 제조 도메인
import os
from neo4j import GraphDatabase

driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI", "bolt://localhost:7687"),
    auth=(os.getenv("NEO4J_USER", "neo4j"), os.getenv("NEO4J_PASSWORD"))
)

def quality_gate():
    """KG 품질 게이트 — 모두 통과해야 배포"""
    with driver.session() as session:

        # 1. 노드 수 체크
        current_count = session.run("MATCH (n) RETURN count(n)").single()[0]
        prev_count = get_previous_count()
        if abs(current_count - prev_count) / prev_count > 0.3:
            raise Exception(f"노드 수 급증/급감: {prev_count} -> {current_count}")

        # 2. 관계 연결률
        orphan_rate = session.run("""
            MATCH (n)
            WITH count(n) as total
            MATCH (orphan)
            WHERE NOT (orphan)--()
            RETURN toFloat(count(orphan)) / total as rate
        """).single()[0]
        if orphan_rate > 0.1:
            raise Exception(f"고아 노드 비율 {orphan_rate:.1%} > 10%")

        # 3. 스키마 일관성 — Equipment/Process 필수 프로퍼티
        missing_equip = session.run("""
            MATCH (e:Equipment)
            WHERE e.name IS NULL OR e.type IS NULL
            RETURN count(e)
        """).single()[0]
        if missing_equip > 0:
            raise Exception(f"Equipment 필수 프로퍼티 누락: {missing_equip}개")

        missing_process = session.run("""
            MATCH (p:Process)
            WHERE p.name IS NULL OR p.line IS NULL
            RETURN count(p)
        """).single()[0]
        if missing_process > 0:
            raise Exception(f"Process 필수 프로퍼티 누락: {missing_process}개")

        # 4. 샘플 쿼리 테스트
        test_queries = load_test_queries()  # Part 7 RAGAS 데이터셋 재사용
        results = [run_query(q) for q in test_queries]
        success_rate = sum(r.success for r in results) / len(results)
        if success_rate < 0.9:
            raise Exception(f"샘플 쿼리 성공률 {success_rate:.1%} < 90%")

    print("All quality gates passed - proceeding with deployment")

# GitHub Actions에서 호출
if __name__ == "__main__":
    try:
        quality_gate()
    except Exception as e:
        send_slack_alert(e)
        exit(1)`
        },
        callout: {
          type: 'key',
          text: '품질 게이트 — Equipment/Process 필수 프로퍼티 검증 + Part 7 데이터셋으로 샘플 테스트'
        }
      }
    ]
  },
  // Section 5: 운영 + 정리 (15min) — 4 slides
  {
    sectionId: 'sec5',
    slides: [
      {
        id: '12-14',
        tag: 'practice',
        title: 'Grafana + Neo4j 메트릭 연동 — gpt-4o 비용 추적',
        script: 'GraphRAG 운영 모니터링을 위해 Grafana 대시보드를 구축하세요. Neo4j는 JMX 메트릭을 제공합니다. Prometheus로 수집하고 Grafana로 시각화합니다. 모니터링할 핵심 메트릭 5가지를 보겠습니다. 첫째, 노드/관계 수. 시간별 추세를 확인합니다. Equipment, Process, Defect 타입별로 분리해서 추적합니다. 둘째, 쿼리 응답 시간. P50, P95, P99를 추적합니다. 셋째, 메모리 사용률. Neo4j Heap 사용률을 모니터링합니다. 넷째, 쿼리 성공/실패율. Text2Cypher 성공률을 추적합니다. 다섯째, LLM API 비용. gpt-4o와 gpt-4o-mini 모델별 일일 비용을 집계합니다. Part 11에서 배운 비용 최적화 효과를 실시간으로 확인할 수 있습니다. 이 대시보드를 팀과 공유하면 이슈를 조기에 발견할 수 있습니다.',
        code: {
          language: 'yaml',
          code: `# Grafana Dashboard Config for GraphRAG — 제조 도메인

datasources:
  - name: Prometheus
    type: prometheus
    url: http://localhost:9090

panels:
  - title: "노드/관계 수 추세 (타입별)"
    query: |
      neo4j_node_count{label="Equipment"}
      neo4j_node_count{label="Process"}
      neo4j_node_count{label="Defect"}
      neo4j_relationship_count{type="CAUSED_BY"}
      neo4j_relationship_count{type="USES_EQUIPMENT"}

  - title: "쿼리 응답 시간 (P50/P95/P99)"
    query: |
      histogram_quantile(0.50, neo4j_cypher_query_duration_seconds_bucket)
      histogram_quantile(0.95, neo4j_cypher_query_duration_seconds_bucket)
      histogram_quantile(0.99, neo4j_cypher_query_duration_seconds_bucket)

  - title: "Neo4j Heap 사용률"
    query: |
      neo4j_memory_heap_used / neo4j_memory_heap_max

  - title: "Text2Cypher 성공률"
    query: |
      sum(rate(text2cypher_success[5m])) / sum(rate(text2cypher_total[5m]))

  - title: "LLM API 일일 비용 (모델별)"
    query: |
      sum(openai_api_cost{model="gpt-4o"}) by (day)
      sum(openai_api_cost{model="gpt-4o-mini"}) by (day)`
        },
        callout: {
          type: 'tip',
          text: 'Grafana 대시보드로 Equipment/Process/Defect 노드 수, 쿼리 시간, gpt-4o 비용을 실시간 모니터링'
        }
      },
      {
        id: '12-15',
        tag: 'practice',
        title: '알림 설정 — 품질 저하/비용 초과/응답 지연',
        script: 'Grafana Alert을 설정해서 이상 상황을 Slack으로 알림받으세요. 3가지 알림을 필수로 설정합니다. 첫째, 품질 저하. 샘플 쿼리 성공률이 80% 이하로 떨어지면 알림. 고아 노드 비율이 15% 이상이면 알림. 둘째, 비용 초과. 일일 LLM API 비용이 $100 초과 시 알림. 월간 인프라 비용이 예산 대비 120% 초과 시 알림. 셋째, 응답 지연. P95 응답 시간이 10초 초과 시 알림. Neo4j 메모리 사용률이 90% 이상이면 알림. 알림은 Severity를 구분하세요. Critical은 즉시 대응, Warning은 모니터링.',
        table: {
          headers: ['알림 유형', '조건', 'Severity', '대응'],
          rows: [
            {
              cells: [
                { text: '품질 저하', bold: true },
                { text: '샘플 쿼리 성공률 < 80%' },
                { text: 'Critical', status: 'fail' },
                { text: '즉시 원인 조사' }
              ]
            },
            {
              cells: [
                { text: '비용 초과', bold: true },
                { text: '일일 API 비용 > $100' },
                { text: 'Warning', status: 'warn' },
                { text: '쿼리 최적화 검토' }
              ]
            },
            {
              cells: [
                { text: '응답 지연', bold: true },
                { text: 'P95 응답 시간 > 10초' },
                { text: 'Warning', status: 'warn' },
                { text: '인덱스 추가 검토' }
              ]
            },
            {
              cells: [
                { text: '메모리 임계', bold: true },
                { text: 'Neo4j Heap > 90%' },
                { text: 'Critical', status: 'fail' },
                { text: '스케일 업 필요' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: 'Grafana Alert로 품질/비용/성능 이상을 Slack 실시간 알림'
        }
      },
      {
        id: '12-16',
        tag: 'theory',
        title: 'On-premises LLM 옵션 — 사내 보안 정책 대응',
        script: '사내 보안 정책으로 외부 API 사용이 불가한 경우가 있습니다. 제조 도메인은 특히 설비 데이터, 공정 파라미터가 영업 비밀인 경우가 많아서 외부 전송이 금지될 수 있습니다. 이때 사용할 수 있는 옵션 3가지를 보겠습니다. 첫째, Ollama + Llama 3.1 70B. 로컬 서버에 배포합니다. A100 GPU 1장이면 충분합니다. LangChain의 ChatOllama로 바로 연결됩니다. 둘째, vLLM + 사내 GPU 클러스터. 대규모 배포에 적합합니다. 배치 처리와 동시 요청 처리가 뛰어납니다. 셋째, Azure OpenAI. 데이터 국내 보관이 보장됩니다. 일본 리전을 사용하면 데이터가 국외로 나가지 않습니다. 성능은 gpt-4o 대비 Llama 3.1 70B가 약 80-85% 수준입니다. 비용 대비 성능으로 보면 On-premises가 월 1만 건 이상일 때 유리합니다.',
        table: {
          headers: ['옵션', '모델', '필요 인프라', '성능 (vs gpt-4o)', '적합 상황'],
          rows: [
            {
              cells: [
                { text: 'Ollama', bold: true },
                { text: 'Llama 3.1 70B' },
                { text: 'A100 GPU 1장' },
                { text: '~80-85%', status: 'warn' },
                { text: '소규모 PoC / 개발' }
              ]
            },
            {
              cells: [
                { text: 'vLLM', bold: true },
                { text: 'Llama 3.1 70B+' },
                { text: 'GPU 클러스터' },
                { text: '~80-85%', status: 'warn' },
                { text: '대규모 프로덕션' }
              ]
            },
            {
              cells: [
                { text: 'Azure OpenAI', bold: true },
                { text: 'gpt-4o' },
                { text: 'Azure 구독' },
                { text: '100%', status: 'pass' },
                { text: '데이터 국내 보관 필수' }
              ]
            }
          ]
        },
        code: {
          language: 'python',
          code: `# On-premises LLM 옵션 코드 예시
import os

# 옵션 1: Ollama (로컬 배포)
from langchain_community.chat_models import ChatOllama
llm_local = ChatOllama(model="llama3.1:70b", base_url="http://localhost:11434")

# 옵션 2: vLLM (사내 GPU 클러스터)
from langchain_openai import ChatOpenAI
llm_vllm = ChatOpenAI(
    model="meta-llama/Llama-3.1-70B-Instruct",
    base_url="http://internal-vllm:8000/v1",
    api_key="not-needed"
)

# 옵션 3: Azure OpenAI (데이터 국내 보관)
from langchain_openai import AzureChatOpenAI
llm_azure = AzureChatOpenAI(
    azure_deployment="gpt-4o",
    api_version="2024-08-01-preview",
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
)

# Claude 옵션: from langchain_anthropic import ChatAnthropic
# llm_claude = ChatAnthropic(model="claude-sonnet-4-20250514")`
        },
        callout: {
          type: 'tip',
          text: '사내 보안 정책 대응 — Ollama(로컬), vLLM(클러스터), Azure OpenAI(국내 보관) 3가지 옵션'
        }
      },
      {
        id: '12-17',
        tag: 'theory',
        title: 'Part 12 핵심 정리 + Part 13 캡스톤 예고',
        script: 'Part 12에서 배운 내용을 정리합니다. Part 10의 멀티에이전트와 Part 11의 디버깅/최적화를 회사에 도입하려면, 케이스 스터디부터 시작합니다. 우리 제조 KG의 접착 박리 원인 추적 사례에서 정확도 35%에서 82%로 향상된 것을 경영진에게 보여주세요. 보험사 비교 질문 사례도 참고용으로 함께 보여주고, 커머스 실패 사례에서는 문제 정의 중요성을 강조합니다. PoC는 2주가 적정합니다. Part 1~11의 모든 기술을 압축 재현하고, Part 7의 RAGAS 데이터셋을 평가에 재사용합니다. 보안과 컴플라이언스는 선택이 아니라 필수입니다. PII 처리는 마스킹+암호화+RBAC 3단 방어, 감사 로그는 GDPR 의무입니다. 사내 보안 정책으로 외부 API가 불가하면 Ollama, vLLM, Azure OpenAI를 고려하세요. CI/CD는 스키마 마이그레이션, 증분 업데이트, 품질 게이트를 자동화합니다. Grafana로 gpt-4o 비용과 품질을 실시간 모니터링합니다. Part 12의 PoC 템플릿과 보안 체크리스트를 Part 13 캡스톤에서 직접 적용합니다. Part 13에서는 Part 1~12 전체를 통합하여 프로덕션급 GraphRAG를 처음부터 끝까지 구축합니다.',
        table: {
          headers: ['주제', '핵심 포인트', '연결 Part'],
          rows: [
            {
              cells: [
                { text: '케이스 스터디', bold: true },
                { text: '제조 원인 추적(+134%), 보험 비교(+183%), 커머스 실패(문제 정의)' },
                { text: 'Part 2~10' }
              ]
            },
            {
              cells: [
                { text: 'PoC 설계', bold: true },
                { text: '2주 계획(Part 1~11 압축), RAGAS 데이터셋 재사용, 정량 기준 합의' },
                { text: 'Part 7, 11' }
              ]
            },
            {
              cells: [
                { text: '보안', bold: true },
                { text: 'PII 마스킹+암호화+RBAC, 감사 로그(GDPR), On-premises LLM' },
                { text: '-' }
              ]
            },
            {
              cells: [
                { text: 'CI/CD', bold: true },
                { text: '스키마 버저닝, 증분 업데이트(Equipment/Process), 품질 게이트' },
                { text: 'Part 4, 5' }
              ]
            },
            {
              cells: [
                { text: '운영', bold: true },
                { text: 'Grafana 모니터링, gpt-4o 비용 추적, 품질/성능 알림' },
                { text: 'Part 11' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: 'Part 12의 PoC 템플릿 + 보안 체크리스트를 Part 13 캡스톤에서 직접 적용합니다'
        }
      }
    ]
  }
];
