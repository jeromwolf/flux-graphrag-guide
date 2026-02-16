import type { SectionContent, SlideContent } from './part1-content';

export const part12Content: SectionContent[] = [
  // Section 1: 도입 케이스 스터디
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '12-1',
        tag: 'theory',
        title: '보험사 약관 비교 GraphRAG — 성공 사례',
        script: '첫 번째 성공 사례는 국내 대형 보험사의 약관 비교 시스템입니다. 도입 배경을 보면, 상담사가 고객 문의에 답변할 때 여러 상품의 보장 범위를 비교해야 했습니다. 기존 벡터 RAG는 "암보험 A와 B 중 어느 게 갑상선암을 보장하나요?"라는 질문에 실패했습니다. 관계를 추적하지 못했기 때문입니다. 아키텍처는 이렇게 구성됐습니다. 400개 보험 상품 약관을 LLM으로 추출해서 Product-Coverage-Disease 관계 그래프를 구축했습니다. Text2Cypher Agent로 비교 질문을 Cypher 쿼리로 변환했고, 하이브리드 검색으로 일반 질문도 처리했습니다. 결과는 놀라웠습니다. 비교 질문 정확도가 30%에서 85%로 향상됐고, 상담사 응답 시간이 평균 5분에서 1분으로 줄었습니다. ROI는 6개월 만에 회수됐습니다.',
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
          type: 'key',
          text: '비교 질문이 많은 도메인에서 GraphRAG는 압도적 성과 — 정확도 3배 향상'
        }
      },
      {
        id: '12-2',
        tag: 'theory',
        title: '제조사 설비 고장 원인 추적 — 성공 사례',
        script: '두 번째 사례는 반도체 제조사의 설비 고장 원인 추적 시스템입니다. 설비 고장이 발생하면 "왜 고장났는가?"를 빠르게 찾아야 생산 중단 시간을 줄일 수 있습니다. 고장 원인은 Multi-hop 체인으로 연결됩니다. 예를 들어 "칩러 온도 상승 → 냉각수 필터 막힘 → 필터 교체 주기 초과 → 유지보수 일정 누락". 이런 체인을 벡터 RAG로는 추적할 수 없었습니다. GraphRAG 도입 후 Equipment-Sensor-Failure-MaintenanceLog 관계 그래프를 구축했습니다. Multi-hop 쿼리로 고장 원인 체인을 5분 안에 추적했습니다. 결과: 평균 고장 조치 시간이 2시간에서 20분으로 줄었고, 생산 중단 비용을 연간 50억 절감했습니다. 핵심은 Multi-hop 추론 능력이었습니다.',
        diagram: {
          nodes: [
            { text: '설비 고장', type: 'fail' },
            { text: '← 센서 이상', type: 'relation' },
            { text: '온도 센서', type: 'entity' },
            { text: '← 냉각수 필터 막힘', type: 'relation' },
            { text: '냉각 시스템', type: 'entity' },
            { text: '← 교체 주기 초과', type: 'relation' },
            { text: '유지보수 일정', type: 'entity' },
            { text: 'Multi-hop 원인 추적', type: 'dim' }
          ]
        },
        callout: {
          type: 'key',
          text: 'Multi-hop으로 고장 원인 체인 추적 — 생산 중단 비용 연간 50억 절감'
        }
      },
      {
        id: '12-3',
        tag: 'theory',
        title: '커머스 상품 추천 — 실패에서 배운 교훈',
        script: '세 번째 사례는 실패 사례입니다. 한 이커머스 기업이 "구매 패턴 그래프로 개인화 추천"을 시도했습니다. 실패 원인을 분석해봅시다. 첫째, 문제 정의 실패. Multi-hop 질문이 실제로 필요하지 않았습니다. "이 상품을 산 사람은 저것도 샀다"는 1-hop 질문이었기 때문입니다. 협업 필터링으로 충분했습니다. 둘째, 데이터 품질 무시. 구매 데이터는 있었지만 상품 메타데이터가 부실했습니다. 브랜드, 카테고리가 통일되지 않아 그래프가 분절됐습니다. 셋째, 비용 폭발. 실시간 추천을 위해 매번 그래프 쿼리를 실행하니 비용이 급증했습니다. 캐싱 전략이 없었습니다. 교훈: GraphRAG는 만능이 아니다. 문제 정의부터 다시 하라. 데이터 품질을 먼저 확보하라. 비용 시뮬레이션을 PoC 단계에서 하라.',
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
          text: 'GraphRAG는 만능이 아니다 — 문제 정의부터 다시 하라'
        }
      }
    ]
  },
  // Section 2: PoC 설계 템플릿
  {
    sectionId: 'sec2',
    slides: [
      {
        id: '12-4',
        tag: 'practice',
        title: '2주 PoC 계획서 작성법',
        script: 'PoC는 2주가 적정합니다. 더 길면 본 프로젝트처럼 변하고, 짧으면 검증이 부족합니다. Week 1에는 데이터 + KG 구축에 집중합니다. Day 1-2: 온톨로지 설계, Meta-Dictionary 작성. Day 3-4: LLM 추출 파이프라인 구축. Day 5: Neo4j 적재 + 품질 검증. Week 2는 검색 + 평가입니다. Day 6-7: Text2Cypher Agent 구축. Day 8-9: 하이브리드 검색 적용. Day 10: RAGAS 평가 + 리포트 작성. 핵심은 "최소 기능으로 핵심 가설을 검증"하는 것입니다. 전체 데이터가 아니라 샘플 데이터로 시작하세요. 100개 문서면 충분합니다.',
        table: {
          headers: ['주차', '일정', '산출물', '검증 기준'],
          rows: [
            {
              cells: [
                { text: 'Week 1', bold: true },
                { text: 'Day 1-2: 온톨로지 설계' },
                { text: 'Meta-Dictionary' },
                { text: '도메인 전문가 리뷰 통과' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: 'Day 3-4: LLM 추출' },
                { text: 'KG 파이프라인' },
                { text: '샘플 10개 정확도 70%+' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: 'Day 5: 품질 검증' },
                { text: 'Neo4j Graph (100 노드)' },
                { text: '관계 연결률 80%+' }
              ]
            },
            {
              cells: [
                { text: 'Week 2', bold: true },
                { text: 'Day 6-7: Text2Cypher' },
                { text: 'Agent 파이프라인' },
                { text: '질문 10개 성공률 60%+' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: 'Day 8-9: 하이브리드 검색' },
                { text: '통합 시스템' },
                { text: 'End-to-end 동작 확인' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: 'Day 10: 평가 + 리포트' },
                { text: 'RAGAS 리포트' },
                { text: 'Hard 질문 정확도 70%+' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '2주 PoC = 최소 기능으로 핵심 가설 검증 — 샘플 데이터로 시작'
        }
      },
      {
        id: '12-5',
        tag: 'practice',
        title: '성공 기준 정의 — 정량 메트릭',
        script: 'PoC 성공 기준은 정량적으로 정의해야 합니다. 3가지 카테고리로 나눕니다. 첫째, 정확도 메트릭. Easy 질문 90%+, Medium 질문 80%+, Hard 질문 70%+. RAGAS Faithfulness 0.8+. 둘째, 성능 메트릭. 평균 응답 시간 3초 이내, 99%ile 응답 시간 10초 이내. 셋째, 비용 메트릭. 질문당 API 비용 $0.10 이하, 월간 인프라 비용 $500 이하. 이 기준을 사전에 이해관계자와 합의하세요. PoC 끝에 "성공인가 실패인가" 논쟁을 피할 수 있습니다.',
        table: {
          headers: ['메트릭 카테고리', '항목', '목표값', '측정 방법'],
          rows: [
            {
              cells: [
                { text: '정확도', bold: true },
                { text: 'Easy 질문 정확도' },
                { text: '90%+', status: 'pass' },
                { text: 'RAGAS eval_dataset' }
              ]
            },
            {
              cells: [
                { text: '', bold: false },
                { text: 'Hard 질문 정확도' },
                { text: '70%+', status: 'pass' },
                { text: 'RAGAS eval_dataset' }
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
          text: '정량 기준을 사전 합의 — PoC 끝에 "성공/실패" 논쟁 방지'
        }
      },
      {
        id: '12-6',
        tag: 'practice',
        title: '경영진 보고용 1-page 요약',
        script: 'PoC 결과를 경영진에게 보고할 때 1-page 요약이 필수입니다. 구조는 이렇습니다. 첫째, 배경 (2줄). "기존 시스템의 문제는 무엇인가?" 둘째, 솔루션 (3줄). "GraphRAG로 어떻게 해결했나?" 셋째, 결과 (숫자로). "정확도 30%→85%, 응답 시간 5분→1분". 넷째, ROI (비용 vs 효과). "연간 인건비 절감 2억, 투자 비용 5천만원, 3개월 회수". 다섯째, 다음 단계. "프로덕션 전환 2개월, 3개 부서 확대 적용". 경영진은 숫자와 ROI를 원합니다. 기술적 세부사항은 부록에 넣으세요.',
        code: {
          language: 'markdown',
          code: `# GraphRAG PoC 결과 요약 (1-Page)

## 배경
- 기존 벡터 RAG는 비교 질문 정확도 30% — 상담사 응답 시간 5분 소요

## 솔루션
- 보험 상품 약관 400개를 GraphRAG로 구축
- Text2Cypher Agent로 비교 질문 자동 처리
- 하이브리드 검색으로 일반 질문 병행 처리

## 결과 (정량)
| 메트릭 | Before | After | 개선율 |
|-------|--------|-------|--------|
| 비교 질문 정확도 | 30% | 85% | +183% |
| 응답 시간 | 5분 | 1분 | -80% |
| 상담사 만족도 | 5.2/10 | 8.7/10 | +67% |

## ROI
- 연간 인건비 절감: 2억 원 (상담사 100명 × 하루 20분 절약)
- 투자 비용: 5천만 원 (개발 + 인프라 6개월)
- **ROI 회수: 3개월**

## Next Steps
1. 프로덕션 전환 (2개월) — 전사 상담 시스템 통합
2. 3개 부서 확대 (법률/재무/마케팅)
3. 자동 KG 업데이트 파이프라인 구축`
        },
        callout: {
          type: 'tip',
          text: '경영진은 숫자와 ROI를 원한다 — 기술 세부사항은 부록으로'
        }
      }
    ]
  },
  // Section 3: 보안 & 컴플라이언스
  {
    sectionId: 'sec3',
    slides: [
      {
        id: '12-7',
        tag: 'theory',
        title: 'PII 처리 — 엔티티에 개인정보가 들어갈 때',
        script: 'GraphRAG를 금융, 의료, 법률 도메인에 적용하면 개인정보(PII)가 엔티티로 추출될 수 있습니다. 예를 들어 보험 청구 문서에서 "김철수 환자가 서울대병원에서 암 진단"이라는 문장을 추출하면 Person 노드에 실명이 들어갑니다. 이건 GDPR, 개인정보보호법 위반입니다. 해결책 3가지를 보겠습니다. 첫째, 마스킹. LLM 추출 전에 PII를 마스킹합니다. "김철수" → "환자_A". 둘째, 암호화. 노드 프로퍼티를 AES 암호화해서 저장합니다. 쿼리 시에만 복호화합니다. 셋째, 접근 제어. Neo4j RBAC로 민감 노드에 대한 접근을 제한합니다. 핵심은 "추출 전 마스킹 + 저장 시 암호화 + 조회 시 RBAC" 3단 방어입니다.',
        table: {
          headers: ['방법', '적용 시점', '장점', '단점'],
          rows: [
            {
              cells: [
                { text: '마스킹', bold: true },
                { text: 'LLM 추출 전' },
                { text: '근본적 차단', status: 'pass' },
                { text: '원본 복구 불가' }
              ]
            },
            {
              cells: [
                { text: '암호화', bold: true },
                { text: 'Neo4j 저장 시' },
                { text: '원본 복구 가능' },
                { text: '쿼리 성능 저하', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: 'RBAC', bold: true },
                { text: 'Neo4j 조회 시' },
                { text: '세밀한 권한 제어', status: 'pass' },
                { text: '설정 복잡도 높음' }
              ]
            }
          ]
        },
        callout: {
          type: 'warn',
          text: 'PII 처리는 법적 의무 — 추출 전 마스킹 + 저장 시 암호화 + RBAC 3단 방어'
        }
      },
      {
        id: '12-8',
        tag: 'theory',
        title: 'Neo4j RBAC + 서브그래프 격리',
        script: 'Neo4j Enterprise는 RBAC(Role-Based Access Control)를 지원합니다. 역할별로 노드, 관계, 프로퍼티 접근을 제어할 수 있습니다. 예를 들어 "상담사 역할은 보험 상품 노드만 조회 가능, 개인정보 노드는 조회 불가"로 설정합니다. 서브그래프 격리는 한 단계 더 나아갑니다. 부서별로 서브그래프를 분리해서 저장합니다. 예를 들어 법무팀 그래프와 재무팀 그래프를 물리적으로 분리합니다. Neo4j Fabric을 사용하면 여러 데이터베이스를 논리적으로 통합해서 쿼리할 수 있습니다. 권한이 있는 서브그래프만 조회됩니다.',
        code: {
          language: 'cypher',
          code: `// Neo4j RBAC 설정 예시

// 1. 역할 생성
CREATE ROLE consultant;
CREATE ROLE admin;

// 2. 권한 부여
// 상담사는 Product 노드만 조회 가능
GRANT MATCH {*} ON GRAPH * NODES Product TO consultant;

// 관리자는 모든 노드 조회 가능
GRANT MATCH {*} ON GRAPH * TO admin;

// 3. 프로퍼티 단위 접근 제어 (Enterprise)
DENY READ {ssn} ON GRAPH * NODES Person TO consultant;

// 4. 서브그래프 격리 (Fabric)
USE fabric.legal
MATCH (c:Contract) RETURN c
// 법무팀 서브그래프만 조회`
        },
        callout: {
          type: 'key',
          text: 'Neo4j RBAC + Fabric으로 부서별 서브그래프 격리 가능'
        }
      },
      {
        id: '12-9',
        tag: 'theory',
        title: '감사 로그 — 누가 어떤 쿼리를 실행했는지',
        script: '금융, 의료 도메인에서는 감사 로그(Audit Log)가 컴플라이언스 필수 요구사항입니다. "누가, 언제, 어떤 쿼리를 실행했는지" 기록해야 합니다. Neo4j Enterprise는 쿼리 로그를 자동으로 기록합니다. query.log 파일에 모든 Cypher 쿼리가 저장됩니다. 이걸 Elasticsearch나 Splunk로 전송해서 실시간 모니터링하세요. 애플리케이션 레벨에서도 로그를 남겨야 합니다. LangSmith나 LangFuse로 LLM 호출을 추적하고, 사용자 ID, 쿼리, 결과를 로깅합니다. GDPR Article 30은 "처리 활동 기록"을 의무화합니다. 감사 로그 없이는 컴플라이언스 통과가 불가능합니다.',
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
  // Section 4: CI/CD for KG
  {
    sectionId: 'sec4',
    slides: [
      {
        id: '12-10',
        tag: 'theory',
        title: '스키마 마이그레이션 전략',
        script: 'Knowledge Graph도 스키마가 진화합니다. 새로운 엔티티 타입이 추가되거나, 관계 타입이 변경됩니다. RDB처럼 ALTER TABLE을 하면 안 됩니다. 그래프는 유연하지만, 스키마 변경 시 하위 호환성(Backward Compatibility)을 유지해야 합니다. 전략 3가지를 보겠습니다. 첫째, Schema Versioning. 스키마 버전을 명시합니다. 예: Product:v1, Product:v2. 구 버전과 신 버전을 병행 운영합니다. 둘째, Additive Changes Only. 기존 노드/관계를 삭제하지 말고 새로운 것만 추가합니다. Deprecated 라벨로 표시합니다. 셋째, Migration Script. Cypher로 마이그레이션 스크립트를 작성합니다. 예: Product:v1을 Product:v2로 변환하는 스크립트. 핵심은 "기존 쿼리가 깨지지 않도록" 하는 것입니다.',
        table: {
          headers: ['전략', '방법', '장점', '단점'],
          rows: [
            {
              cells: [
                { text: 'Schema Versioning', bold: true },
                { text: 'Product:v1, Product:v2 병행' },
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
        id: '12-11',
        tag: 'practice',
        title: '증분 업데이트 파이프라인',
        script: 'KG를 매번 전체 재생성하면 비용이 큽니다. 증분 업데이트(Incremental Update)로 변경분만 반영하세요. Airflow DAG로 파이프라인을 구성합니다. 첫째, 변경 탐지. 문서의 Last Modified 시간을 추적합니다. 변경된 문서만 추출합니다. 둘째, 기존 노드 업데이트. MERGE 문으로 기존 노드를 업데이트합니다. 셋째, 고아 노드 정리. 더 이상 참조되지 않는 노드를 삭제합니다. 넷째, 품질 검증. 업데이트 후 관계 연결률을 확인합니다. 이 파이프라인을 매일 밤 자동 실행하면 항상 최신 KG를 유지할 수 있습니다.',
        code: {
          language: 'python',
          code: `# Airflow DAG for Incremental KG Update

from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

def detect_changes():
    """변경된 문서 탐지"""
    last_update = get_last_update_time()
    changed_docs = [d for d in all_docs if d.modified > last_update]
    return changed_docs

def extract_and_update(docs):
    """LLM 추출 + Neo4j MERGE"""
    for doc in docs:
        entities = llm_extract(doc)
        for ent in entities:
            neo4j.run("""
                MERGE (e:Entity {id: $id})
                SET e.name = $name, e.updated_at = datetime()
            """, id=ent.id, name=ent.name)

def cleanup_orphans():
    """고아 노드 정리"""
    neo4j.run("""
        MATCH (e:Entity)
        WHERE NOT (e)--()
        DELETE e
    """)

def validate_quality():
    """품질 검증"""
    result = neo4j.run("MATCH (e:Entity) RETURN count(e)")
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
          text: '증분 업데이트로 비용 절감 — 매일 밤 자동 실행으로 최신 KG 유지'
        }
      },
      {
        id: '12-12',
        tag: 'practice',
        title: 'KG 품질 게이트 자동화',
        script: 'CI/CD 파이프라인에 KG 품질 게이트를 추가하세요. 품질이 기준 이하면 배포를 차단합니다. 4가지 체크를 자동화합니다. 첫째, 노드 수 체크. 급격한 증감을 탐지합니다. 예: 전날 대비 ±30% 이상 변화 시 알림. 둘째, 관계 연결률. 고아 노드 비율이 10% 이하인지 확인합니다. 셋째, 스키마 일관성. 필수 프로퍼티가 누락되지 않았는지 확인합니다. 넷째, 샘플 쿼리 테스트. 핵심 질문 10개를 자동 실행해서 성공률을 체크합니다. 모든 게이트 통과 시에만 배포합니다. 실패 시 Slack으로 알림합니다.',
        code: {
          language: 'python',
          code: `# KG Quality Gate for CI/CD

def quality_gate():
    """KG 품질 게이트 — 모두 통과해야 배포"""

    # 1. 노드 수 체크
    current_count = neo4j.run("MATCH (n) RETURN count(n)").single()[0]
    prev_count = get_previous_count()
    if abs(current_count - prev_count) / prev_count > 0.3:
        raise Exception(f"노드 수 급증/급감: {prev_count} → {current_count}")

    # 2. 관계 연결률
    orphan_rate = neo4j.run("""
        MATCH (n)
        WITH count(n) as total
        MATCH (orphan)
        WHERE NOT (orphan)--()
        RETURN toFloat(count(orphan)) / total as rate
    """).single()[0]
    if orphan_rate > 0.1:
        raise Exception(f"고아 노드 비율 {orphan_rate:.1%} > 10%")

    # 3. 스키마 일관성
    missing = neo4j.run("""
        MATCH (p:Product)
        WHERE p.name IS NULL OR p.category IS NULL
        RETURN count(p)
    """).single()[0]
    if missing > 0:
        raise Exception(f"필수 프로퍼티 누락: {missing}개")

    # 4. 샘플 쿼리 테스트
    test_queries = load_test_queries()
    results = [run_query(q) for q in test_queries]
    success_rate = sum(r.success for r in results) / len(results)
    if success_rate < 0.9:
        raise Exception(f"샘플 쿼리 성공률 {success_rate:.1%} < 90%")

    print("✅ 모든 품질 게이트 통과 — 배포 진행")

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
          text: '품질 게이트 자동화 — 기준 이하 시 배포 차단 + Slack 알림'
        }
      }
    ]
  },
  // Section 5: 운영 대시보드
  {
    sectionId: 'sec5',
    slides: [
      {
        id: '12-13',
        tag: 'practice',
        title: 'Grafana + Neo4j 메트릭 연동',
        script: 'GraphRAG 운영 모니터링을 위해 Grafana 대시보드를 구축하세요. Neo4j는 JMX 메트릭을 제공합니다. Prometheus로 수집하고 Grafana로 시각화합니다. 모니터링할 핵심 메트릭 5가지를 보겠습니다. 첫째, 노드/관계 수. 시간별 추세를 확인합니다. 둘째, 쿼리 응답 시간. P50, P95, P99를 추적합니다. 셋째, 메모리 사용률. Neo4j Heap 사용률을 모니터링합니다. 넷째, 쿼리 성공/실패율. Text2Cypher 성공률을 추적합니다. 다섯째, LLM API 비용. 일일 비용을 집계합니다. 이 대시보드를 팀과 공유하면 이슈를 조기에 발견할 수 있습니다.',
        code: {
          language: 'yaml',
          code: `# Grafana Dashboard Config for GraphRAG

datasources:
  - name: Prometheus
    type: prometheus
    url: http://localhost:9090

panels:
  - title: "노드/관계 수 추세"
    query: |
      neo4j_node_count{label="ALL"}
      neo4j_relationship_count{type="ALL"}

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

  - title: "LLM API 일일 비용"
    query: |
      sum(openai_api_cost{service="gpt-4"}) by (day)`
        },
        callout: {
          type: 'tip',
          text: 'Grafana 대시보드로 노드 수, 쿼리 시간, 비용을 실시간 모니터링'
        }
      },
      {
        id: '12-14',
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
        id: '12-15',
        tag: 'theory',
        title: 'Part 12 핵심 정리',
        script: 'Part 12에서 배운 내용을 정리합니다. 엔터프라이즈 도입은 케이스 스터디부터 시작합니다. 보험사 비교 질문, 제조사 고장 추적 성공 사례를 봤습니다. 실패 사례에서는 문제 정의 중요성을 배웠습니다. PoC는 2주가 적정합니다. Week 1은 데이터+KG, Week 2는 검색+평가입니다. 성공 기준은 정량적으로 정의하고 사전 합의해야 합니다. 보안과 컴플라이언스는 선택이 아니라 필수입니다. PII 처리는 마스킹+암호화+RBAC 3단 방어가 필요합니다. 감사 로그는 GDPR 의무 요구사항입니다. CI/CD는 스키마 마이그레이션, 증분 업데이트, 품질 게이트를 자동화합니다. 운영 대시보드는 Grafana로 구축하고 품질/비용/성능 알림을 설정합니다. 핵심 메시지: PoC는 2주, 프로덕션은 2개월. 보안과 자동화를 처음부터 설계하세요.',
        table: {
          headers: ['주제', '핵심 포인트'],
          rows: [
            {
              cells: [
                { text: '케이스 스터디', bold: true },
                { text: '보험 비교(+183%), 제조 고장 추적(50억 절감), 커머스 실패(문제 정의 중요)' }
              ]
            },
            {
              cells: [
                { text: 'PoC 설계', bold: true },
                { text: '2주 계획(Week1: 데이터+KG, Week2: 검색+평가), 정량 기준 사전 합의' }
              ]
            },
            {
              cells: [
                { text: '보안', bold: true },
                { text: 'PII 마스킹+암호화+RBAC, 감사 로그(GDPR 의무)' }
              ]
            },
            {
              cells: [
                { text: 'CI/CD', bold: true },
                { text: '스키마 버저닝, 증분 업데이트, 품질 게이트 자동화' }
              ]
            },
            {
              cells: [
                { text: '운영', bold: true },
                { text: 'Grafana 모니터링, 품질/비용/성능 알림' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: 'PoC는 2주, 프로덕션은 2개월 — 보안과 자동화를 처음부터 설계'
        }
      }
    ]
  }
];
