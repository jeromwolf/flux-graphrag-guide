import type { SectionContent, SlideContent } from './part1-content';

export const part2Content: SectionContent[] = [
  // Section 1: 온톨로지 설계 워크숍
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '1-1',
        tag: 'discussion',
        title: '도메인 연결 — Part 1 그래프 확장',
        script: 'Part 1에서 브레이크 패드 7개 노드를 만들었죠? 그런데 실제 제조 현장에는 공정이 3~4개, 설비가 10대 이상, 결함 유형도 여러 개입니다. 이걸 수작업으로 확장해봅시다. Part 1의 7노드+5관계를 15노드+20관계로 키우는 게 이번 Part의 목표입니다.',
        callout: {
          type: 'key',
          text: 'Part 1의 그래프를 지우지 마세요. Part 2에서는 이 위에 확장합니다.'
        }
      },
      {
        id: '1-2',
        tag: 'discussion',
        title: 'Node Labels 정의 — 제조 도메인 7개 타입',
        script: '우리 제조 도메인에서 사용할 엔티티 타입 7개입니다. Part 1에서 이미 이 타입들을 사용했죠. 이번엔 각 타입의 인스턴스를 더 추가합니다.',
        table: {
          headers: ['Entity Type', '예시', '설명'],
          rows: [
            { cells: [{ text: 'Process', bold: true }, { text: '접착 도포, 열압착, 성형, 연삭' }, { text: '공정' }] },
            { cells: [{ text: 'Equipment', bold: true }, { text: '접착기 A-3, 열압착기 HP-01' }, { text: '설비' }] },
            { cells: [{ text: 'Defect', bold: true }, { text: '접착 박리, 두께 불균일, 경도 미달' }, { text: '결함' }] },
            { cells: [{ text: 'Material', bold: true }, { text: '접착제 EP-200, 마찰재 FM-100' }, { text: '자재' }] },
            { cells: [{ text: 'Product', bold: true }, { text: '브레이크 패드 BP-100' }, { text: '제품' }] },
            { cells: [{ text: 'Spec', bold: true }, { text: 'KS M 6613, ISO 6310' }, { text: '규격/표준' }] },
            { cells: [{ text: 'Maintenance', bold: true }, { text: '2025-01-15 정기 점검' }, { text: '정비 이력' }] }
          ]
        }
      },
      {
        id: '1-3',
        tag: 'theory',
        title: 'Relationship 9가지 — 제조 도메인 관계',
        script: '제조 도메인의 관계 9가지입니다. 관계 방향이 중요합니다. CAUSED_BY는 "결함이 공정에 의해 발생"이므로 Defect→Process 방향이에요. NEXT_PROCESS는 공정 순서를 나타내므로 Process→Process 방향이죠.',
        table: {
          headers: ['Prefix', '의미', '예시'],
          rows: [
            { cells: [{ text: 'CAUSED_BY', bold: true }, { text: '결함 원인' }, { text: '접착 박리 → 접착 도포' }] },
            { cells: [{ text: 'USES_EQUIPMENT', bold: true }, { text: '설비 사용' }, { text: '접착 도포 → 접착기 A-3' }] },
            { cells: [{ text: 'USES_MATERIAL', bold: true }, { text: '자재 사용' }, { text: '접착 도포 → 접착제 EP-200' }] },
            { cells: [{ text: 'CONFORMS_TO', bold: true }, { text: '규격 준수' }, { text: '접착제 EP-200 → KS M 6613' }] },
            { cells: [{ text: 'MAINTAINED_ON', bold: true }, { text: '정비 이력' }, { text: '접착기 A-3 → 2025-01-15' }] },
            { cells: [{ text: 'PRODUCES', bold: true }, { text: '생산' }, { text: '열압착 → 브레이크 패드' }] },
            { cells: [{ text: 'NEXT_PROCESS', bold: true }, { text: '다음 공정' }, { text: '접착 도포 → 열압착' }] },
            { cells: [{ text: 'DETECTED_IN', bold: true }, { text: '결함 발견' }, { text: '두께 불균일 → 연삭' }] },
            { cells: [{ text: 'INSPECTED_BY', bold: true }, { text: '검사 담당' }, { text: 'BP-100 → 김품질' }] }
          ]
        },
        callout: {
          type: 'tip',
          text: '관계 방향이 중요합니다. CAUSED_BY는 Defect→Process이지, Process→Defect가 아닙니다.'
        }
      }
    ]
  },
  // Section 2: Meta-Dictionary 만들기
  {
    sectionId: 'sec2',
    slides: [
      {
        id: '2-1',
        tag: 'practice',
        title: 'Meta-Dictionary란?',
        script: 'Meta-Dictionary는 도메인 전문가의 암묵지를 체계화한 관계 키워드 사전입니다. 품질 보고서에서 "원인", "발생", "기인"이라는 단어를 보면 CAUSED_BY 관계를 떠올리잖아요. 이 암묵적인 지식을 JSON으로 정리하는 겁니다. Part 3에서 LLM으로 자동 추출할 때, 이 Dictionary를 프롬프트에 넣어주면 LLM이 더 정확하게 관계를 추출합니다.',
        diagram: {
          nodes: [
            { text: '품질 보고서', type: 'entity' },
            { text: '키워드 추출', type: 'relation' },
            { text: '패턴 정의', type: 'entity' },
            { text: 'JSON 구조화', type: 'relation' },
            { text: 'Meta-Dictionary', type: 'entity' }
          ]
        }
      },
      {
        id: '2-2',
        tag: 'practice',
        title: 'Meta-Dictionary JSON 구조',
        script: 'Meta-Dictionary의 JSON 구조입니다. 각 관계마다 keywords 필드에 관련 키워드를 배열로 넣습니다. CAUSED_BY이면 "원인", "발생", "기인", "유발" 같은 거죠. source_type과 target_type은 관계의 방향을 정의합니다. CAUSED_BY는 Defect에서 Process로 가는 관계니까 source_type이 Defect, target_type이 Process입니다.',
        code: {
          language: 'json',
          code: `{
  "CAUSED_BY": {
    "keywords": ["원인", "발생", "기인", "유발"],
    "source_type": "Defect",
    "target_type": "Process"
  },
  "USES_EQUIPMENT": {
    "keywords": ["사용 설비", "장비", "기계"],
    "source_type": "Process",
    "target_type": "Equipment"
  },
  "USES_MATERIAL": {
    "keywords": ["사용 자재", "원자재", "투입"],
    "source_type": "Process",
    "target_type": "Material"
  },
  "CONFORMS_TO": {
    "keywords": ["규격", "기준", "표준", "인증"],
    "source_type": "Material",
    "target_type": "Spec"
  },
  "MAINTAINED_ON": {
    "keywords": ["정비", "점검", "보수", "교체"],
    "source_type": "Equipment",
    "target_type": "Maintenance"
  },
  "NEXT_PROCESS": {
    "keywords": ["다음 공정", "후속", "이후"],
    "source_type": "Process",
    "target_type": "Process"
  },
  "DETECTED_IN": {
    "keywords": ["발견", "검출", "확인"],
    "source_type": "Defect",
    "target_type": "Process"
  }
}`
        },
        callout: {
          type: 'tip',
          text: 'Part 3에서 이 Dictionary를 LLM 프롬프트에 반영하여 자동 추출 정확도를 높입니다.'
        }
      },
      {
        id: '2-3',
        tag: 'practice',
        title: 'Meta-Dictionary 작성 실습',
        script: '자, 이제 여러분이 직접 Meta-Dictionary를 완성해봅시다. 위에서 7개 관계만 정의했는데, PRODUCES와 INSPECTED_BY도 추가해보세요. 품질 보고서를 읽으면서 "이 문장에서 어떤 관계가 추출되나?" 생각해보세요. 예를 들어 "열압착 공정에서 브레이크 패드를 생산한다"는 PRODUCES 관계의 키워드 "생산"이 포함된 거죠. 10분 동안 작업해보세요.',
        callout: {
          type: 'warn',
          text: '키워드는 너무 많이 넣으면 LLM이 헷갈립니다. 핵심 키워드 3-5개만 선택하세요.'
        }
      }
    ]
  },
  // Section 3: 데이터 정제
  {
    sectionId: 'sec3',
    slides: [
      {
        id: '3-1',
        tag: 'practice',
        title: '품질 보고서에서 엔티티/관계 추출',
        script: '이제 실제 품질 보고서에서 엔티티와 관계를 추출해봅시다. 예시 문서를 볼게요. "2025년 1월 브레이크 패드 BP-100 생산 라인에서 접착 박리 결함이 3건 발생했다. 접착 도포 공정(80°C)에서 접착기 A-3을 사용하여 접착제 EP-200을 도포하는 과정에서 접착제 도포량이 규격(KS M 6613) 대비 15% 부족한 것으로 확인되었다." 이 문서에서 엔티티는? BP-100(Product), 접착 박리(Defect), 접착 도포(Process), 접착기 A-3(Equipment), 접착제 EP-200(Material), KS M 6613(Spec). 관계는? 접착 박리-[:CAUSED_BY]->접착 도포, 접착 도포-[:USES_EQUIPMENT]->접착기 A-3, 접착 도포-[:USES_MATERIAL]->접착제 EP-200, 접착제 EP-200-[:CONFORMS_TO]->KS M 6613.',
        visual: '품질 보고서 화면에 엔티티는 형광펜으로 강조, 관계는 화살표로 표시',
        callout: {
          type: 'tip',
          text: '물리적으로 종이에 인쇄해서 밑줄 긋는 것도 좋은 학습 방법입니다.'
        }
      },
      {
        id: '3-2',
        tag: 'practice',
        title: '"같은 문장, 다른 추출" — 온톨로지 합의의 어려움',
        script: 'Part 1에서 "팀원 3명이 각각 다르게 뽑는다"고 했죠? 실제로 해보겠습니다. 같은 문장을 3명이 추출하면 이렇게 다릅니다.',
        table: {
          headers: ['추출자', '엔티티', '관계', '판단 근거'],
          rows: [
            {
              cells: [
                { text: 'A', bold: true },
                { text: '접착 도포, 접착기 A-3, EP-200 (3개)' },
                { text: 'USES_EQUIPMENT, USES_MATERIAL' },
                { text: '"접착 도포"를 하나의 공정 엔티티로 봄' }
              ]
            },
            {
              cells: [
                { text: 'B', bold: true },
                { text: '접착, 도포, 접착기 A-3, EP-200 (4개)' },
                { text: 'PART_OF, USES_EQUIPMENT, USES_MATERIAL' },
                { text: '"접착"과 "도포"를 각각 엔티티로 분리' }
              ]
            },
            {
              cells: [
                { text: 'C', bold: true },
                { text: '접착기 A-3, EP-200 (2개)' },
                { text: 'APPLIES (접착기→접착제)' },
                { text: '"접착 도포"를 관계로 처리, 엔티티로 안 봄' }
              ]
            }
          ]
        },
        callout: {
          type: 'warn',
          text: '누가 맞을까? → 정답은 없습니다. 이래서 온톨로지 합의가 필요합니다. 우리는 A 방식(공정을 하나의 엔티티로)으로 통일합니다.'
        }
      },
      {
        id: '3-3',
        tag: 'practice',
        title: '엑셀 정리 — 노드 & 관계 목록',
        script: '추출한 엔티티와 관계를 엑셀에 정리해봅시다. 노드 목록 시트에 Entity, Label, Properties 컬럼을 만드세요. 관계 목록 시트에는 Source, Relation, Target 컬럼을 만드세요.',
        table: {
          headers: ['Entity', 'Label', 'Properties'],
          rows: [
            { cells: [{ text: '접착 도포' }, { text: 'Process' }, { text: '{name, temp, unit}' }] },
            { cells: [{ text: '열압착' }, { text: 'Process' }, { text: '{name, temp, unit}' }] },
            { cells: [{ text: '접착기 A-3' }, { text: 'Equipment' }, { text: '{name, location}' }] },
            { cells: [{ text: '접착 박리' }, { text: 'Defect' }, { text: '{name, severity}' }] },
            { cells: [{ text: '접착제 EP-200' }, { text: 'Material' }, { text: '{name, vendor}' }] }
          ]
        }
      },
      {
        id: '3-4',
        tag: 'practice',
        title: '15개 노드, 20개 관계 추출 미션',
        script: '자, 이제 여러분의 미션입니다. 아래 품질 보고서 3개를 읽고, Part 1의 7노드에 8개를 더 추가하여 총 15개 노드와 20개 관계를 만드세요. 시간은 30분입니다. 10번째 관계를 추출할 때쯤 "이 관계 방향이 맞나?", "이건 엔티티인가 속성인가?" 같은 판단이 점점 어려워집니다. 이게 진짜 수작업의 한계입니다.',
        code: {
          language: 'text',
          code: `[샘플 문서 1: 품질 검사 보고서]
"2025년 1월 브레이크 패드 BP-100 생산 라인에서 접착 박리 결함이 3건 발생했다.
접착 도포 공정(80°C)에서 접착기 A-3을 사용하여 접착제 EP-200을 도포하는 과정에서
접착제 도포량이 규격(KS M 6613) 대비 15% 부족한 것으로 확인되었다.
접착기 A-3은 2025년 1월 15일 정기 점검을 받았으며, 점검 당시 이상 없음으로 판정."

[샘플 문서 2: 공정 이상 보고서]
"열압착 공정(180°C)에서 열압착기 HP-01 사용 중 경도 미달 결함 2건 발생.
마찰재 FM-100의 배합 비율이 ISO 6310 규격 대비 편차가 있는 것으로 의심됨.
열압착기 HP-01은 동일 정기 점검일(2025-01-15)에 점검 완료."

[샘플 문서 3: 최종 검사 보고서]
"성형 → 연삭 공정을 거친 브레이크 패드 BP-100에서 두께 불균일 1건 발생.
연삭 공정에서 마찰재 FM-100 표면 처리 시 불균일이 발생한 것으로 추정.
제품은 ISO 6310 두께 공차 규격을 만족해야 한다."`
        },
        callout: {
          type: 'warn',
          text: '같은 엔티티가 여러 문서에 나오면 한 번만 추출하세요. 중복 제거가 중요합니다.'
        }
      }
    ]
  },
  // Section 4: Neo4j 직접 입력
  {
    sectionId: 'sec4',
    slides: [
      {
        id: '4-1',
        tag: 'practice',
        title: 'Part 2 추가 노드 8개 생성',
        script: 'Part 1에서 만든 7개 노드 위에 8개를 더 추가합니다. Neo4j Browser를 열고 아래 CREATE 문을 실행하세요.',
        code: {
          language: 'cypher',
          code: `// Part 2: 추가 노드 8개 생성 (Part 1의 7개에 이어서)
CREATE (proc2:Process {name: "열압착", temp: 180, unit: "°C"})
CREATE (proc3:Process {name: "성형", temp: 25, unit: "°C"})
CREATE (proc4:Process {name: "연삭", temp: 25, unit: "°C"})
CREATE (equip2:Equipment {name: "열압착기 HP-01", location: "2공장"})
CREATE (defect2:Defect {name: "두께 불균일", severity: "Major"})
CREATE (defect3:Defect {name: "경도 미달", severity: "Major"})
CREATE (mat2:Material {name: "마찰재 FM-100", vendor: "대한마찰"})
CREATE (spec2:Spec {name: "ISO 6310", type: "두께 공차"})`
        },
        callout: {
          type: 'tip',
          text: 'Neo4j Browser에서 MATCH (n) RETURN count(n) 을 실행하면 총 15개가 나와야 합니다.'
        }
      },
      {
        id: '4-2',
        tag: 'practice',
        title: 'Part 2 추가 관계 15개 생성',
        script: '이제 관계를 만들어봅시다. Part 1의 5개 관계에 15개를 더 추가합니다. MATCH로 노드를 찾고 CREATE로 관계를 연결합니다.',
        code: {
          language: 'cypher',
          code: `// 공정 순서 (NEXT_PROCESS)
MATCH (p1:Process {name: "접착 도포"})
MATCH (p2:Process {name: "열압착"})
CREATE (p1)-[:NEXT_PROCESS]->(p2)

MATCH (p2:Process {name: "열압착"})
MATCH (p3:Process {name: "성형"})
CREATE (p2)-[:NEXT_PROCESS]->(p3)

MATCH (p3:Process {name: "성형"})
MATCH (p4:Process {name: "연삭"})
CREATE (p3)-[:NEXT_PROCESS]->(p4)

// 설비/자재 사용
MATCH (p2:Process {name: "열압착"})
MATCH (e2:Equipment {name: "열압착기 HP-01"})
CREATE (p2)-[:USES_EQUIPMENT]->(e2)

MATCH (p2:Process {name: "열압착"})
MATCH (m2:Material {name: "마찰재 FM-100"})
CREATE (p2)-[:USES_MATERIAL]->(m2)

// 생산
MATCH (p2:Process {name: "열압착"})
MATCH (prod:Product {name: "브레이크 패드 BP-100"})
CREATE (p2)-[:PRODUCES]->(prod)

// 결함 원인 + 발견 공정
MATCH (d2:Defect {name: "두께 불균일"})
MATCH (p4:Process {name: "연삭"})
CREATE (d2)-[:CAUSED_BY]->(p4)
CREATE (d2)-[:DETECTED_IN]->(p4)

MATCH (d3:Defect {name: "경도 미달"})
MATCH (p2:Process {name: "열압착"})
CREATE (d3)-[:CAUSED_BY]->(p2)
CREATE (d3)-[:DETECTED_IN]->(p2)

// 규격 준수
MATCH (m2:Material {name: "마찰재 FM-100"})
MATCH (s2:Spec {name: "ISO 6310"})
CREATE (m2)-[:CONFORMS_TO]->(s2)

// 정비 이력 공유
MATCH (e2:Equipment {name: "열압착기 HP-01"})
MATCH (maint:Maintenance {date: "2025-01-15"})
CREATE (e2)-[:MAINTAINED_ON]->(maint)

// 제품 규격
MATCH (prod:Product {name: "브레이크 패드 BP-100"})
MATCH (s2:Spec {name: "ISO 6310"})
CREATE (prod)-[:CONFORMS_TO]->(s2)

// 연삭에서 마찰재 사용
MATCH (p4:Process {name: "연삭"})
MATCH (m2:Material {name: "마찰재 FM-100"})
CREATE (p4)-[:USES_MATERIAL]->(m2)`
        }
      },
      {
        id: '4-3',
        tag: 'practice',
        title: '수작업 품질 기준 4가지',
        script: '15노드+20관계를 만들었으면, "잘 만들었는지" 검증해야 합니다. 수작업 KG의 품질 기준 4가지입니다.',
        table: {
          headers: ['기준', '확인 방법', '우리 그래프'],
          rows: [
            {
              cells: [
                { text: '커버리지', bold: true },
                { text: '원본 문서의 핵심 정보가 모두 포함되는가?' },
                { text: '3개 보고서 → 15노드 추출', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '일관성', bold: true },
                { text: '같은 유형이 같은 Label로 분류되는가?' },
                { text: '공정=Process, 결함=Defect 통일', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '연결성', bold: true },
                { text: '고립된 노드(관계 없는 노드)가 없는가?' },
                { text: 'MATCH (n) WHERE NOT (n)--() 로 확인', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: '방향성', bold: true },
                { text: '모든 관계의 방향이 의미적으로 올바른가?' },
                { text: 'CAUSED_BY: Defect→Process ✓', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '이 4가지 기준은 Part 3 LLM 자동 추출 결과를 평가할 때도 동일하게 사용합니다.'
        }
      },
      {
        id: '4-4',
        tag: 'discussion',
        title: '수작업 실수 Top 5 — 제조 도메인',
        script: '수작업에서 자주 하는 실수 5가지입니다. 여러분도 한두 개는 이미 경험했을 겁니다.',
        table: {
          headers: ['순위', '실수 유형', '제조 도메인 예시'],
          rows: [
            {
              cells: [
                { text: '1', bold: true },
                { text: '엔티티 vs 속성 혼동' },
                { text: '"80°C"가 별도 노드인가, temp 속성인가?' }
              ]
            },
            {
              cells: [
                { text: '2', bold: true },
                { text: '관계 방향 실수' },
                { text: 'CAUSED_BY가 Defect→Process인지 Process→Defect인지' }
              ]
            },
            {
              cells: [
                { text: '3', bold: true },
                { text: '과도한 세분화' },
                { text: '"열압착 공정"과 "열압착 작업"을 별도 노드로 만들기' }
              ]
            },
            {
              cells: [
                { text: '4', bold: true },
                { text: '중복 엔티티' },
                { text: '"접착기 A-3"과 "A-3 접착기"를 다른 노드로 만들기' }
              ]
            },
            {
              cells: [
                { text: '5', bold: true },
                { text: '암묵적 관계 누락' },
                { text: '"브레이크 패드가 ISO 6310을 만족해야 한다" → CONFORMS_TO 놓치기' }
              ]
            }
          ]
        }
      },
      {
        id: '4-5',
        tag: 'discussion',
        title: '이거 100개 문서면 어떻게 하지?',
        script: '15개 노드에 1시간 걸렸으면, 100개 문서에는 40시간입니다. 그리고 40시간 동안 일관된 판단을 유지할 수 있을까요? 3시간째부터 "아까는 이걸 엔티티로 뽑았는데 지금은 속성으로 처리하고 있네?" 같은 불일치가 생깁니다. 이 고통을 체감하는 게 중요합니다. Part 3에서 LLM 자동화를 배울 때 "아, 자동화가 정말 필요하구나"라고 느낄 수 있거든요.',
        visual: '화면에 큰 글씨로 "15개 노드 = 1시간, 100개 문서 = 40시간 + 일관성 붕괴"',
        callout: {
          type: 'key',
          text: '수작업의 진짜 한계는 속도가 아니라 일관성입니다. 사람은 피로해지면 판단이 흔들립니다.'
        }
      }
    ]
  },
  // Section 5: 쿼리 실습 + 시각화
  {
    sectionId: 'sec5',
    slides: [
      {
        id: '5-1',
        tag: 'practice',
        title: 'Multi-hop 질문 — 제조 도메인',
        script: '이제 15노드+20관계 그래프로 복잡한 질문을 해봅시다. "접착 박리 결함의 원인 공정과 같은 설비를 쓰는 다른 공정은?" — 이건 3-hop 질의입니다.',
        code: {
          language: 'cypher',
          code: `// "접착 박리 결함의 원인 공정과 같은 설비를 쓰는 다른 공정은?"
MATCH (d:Defect {name: "접착 박리"})
      -[:CAUSED_BY]->(p:Process)
      -[:USES_EQUIPMENT]->(e:Equipment)
      <-[:USES_EQUIPMENT]-(other:Process)
WHERE other <> p
RETURN d.name AS 결함,
       p.name AS 원인공정,
       e.name AS 공유설비,
       other.name AS 다른공정

// "경도 미달 결함이 발생한 공정의 자재 규격은?"
MATCH (d:Defect {name: "경도 미달"})
      -[:CAUSED_BY]->(p:Process)
      -[:USES_MATERIAL]->(m:Material)
      -[:CONFORMS_TO]->(s:Spec)
RETURN d.name, p.name, m.name, s.name`
        },
        callout: {
          type: 'key',
          text: 'Part 1에서 의사코드로만 봤던 차이를, 이제 직접 만든 데이터로 확인했습니다.'
        }
      },
      {
        id: '5-2',
        tag: 'practice',
        title: '벡터 RAG vs Graph — 같은 질문, 다른 결과',
        script: '벡터 RAG와 GraphRAG를 나란히 비교해봅시다. 같은 제조 도메인 질문인데 결과가 완전히 다릅니다.',
        table: {
          headers: ['시스템', '질문', '결과', '원인/장점'],
          rows: [
            {
              cells: [
                { text: '벡터 RAG', bold: true },
                { text: '경도 미달 결함의 자재 규격은?' },
                { text: '정보 없음', status: 'fail' },
                { text: '결함→공정→자재→규격 연결 불가' }
              ]
            },
            {
              cells: [
                { text: 'GraphRAG', bold: true },
                { text: '경도 미달 결함의 자재 규격은?' },
                { text: '경도 미달 → 열압착 → FM-100 → ISO 6310', status: 'pass' },
                { text: '관계 추적으로 4-hop 답변' }
              ]
            }
          ]
        }
      },
      {
        id: '5-3',
        tag: 'practice',
        title: 'Neo4j Browser 시각화 + 검증',
        script: 'Neo4j Browser에서 전체 그래프를 시각화해보세요. MATCH (n)-[r]->(m) RETURN n, r, m 쿼리를 실행하면 15개 노드와 20개 관계가 한눈에 보입니다. 고립된 노드가 없는지, 관계 방향이 맞는지 시각적으로 확인하세요.',
        code: {
          language: 'cypher',
          code: `// 전체 그래프 시각화
MATCH (n)-[r]->(m) RETURN n, r, m

// 검증: 노드 수 (15개)
MATCH (n) RETURN count(n) AS total_nodes

// 검증: 관계 수 (20개)
MATCH ()-[r]->() RETURN count(r) AS total_rels

// 검증: 고립 노드 (0개여야 함)
MATCH (n) WHERE NOT (n)--() RETURN n`
        },
        callout: {
          type: 'tip',
          text: '시각화는 데이터 품질 검증의 핵심 도구입니다. 고립된 노드, 이상한 관계 방향을 빠르게 발견할 수 있습니다.'
        }
      },
      {
        id: '5-4',
        tag: 'discussion',
        title: '체감 포인트 — Part 2 완료',
        script: '벡터 RAG로 안 되던 질문이 그래프로 풀렸습니다. 이 차이를 기억하세요. 그리고 수작업의 고통도 기억하세요. 15노드에 1시간, 100문서면 40시간, 일관성 붕괴... Part 3에서는 LLM이 이 수작업을 대신합니다. 하지만 수작업 경험 없이 자동화부터 하면 "LLM이 뽑은 결과가 맞는지 틀렸는지" 판단할 수 없습니다. 그래서 이 고통이 필요했던 겁니다.',
        callout: {
          type: 'key',
          text: 'Part 3 예고: LLM이 수작업을 대신합니다. 하지만 Part 2의 수작업 경험이 있어야 LLM 결과를 평가할 수 있습니다.'
        }
      }
    ]
  }
];
