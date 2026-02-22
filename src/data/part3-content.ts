import type { SectionContent, SlideContent } from './part1-content';

export const part3Content: SectionContent[] = [
  // Section 1: LLM 추출 프롬프트 설계
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '1-1',
        tag: 'theory',
        title: 'Part 2 → Part 3 연결: 같은 문서, 다른 방법',
        script: 'Part 2에서 품질 보고서 3개로 15노드+20관계를 수작업 구축했습니다. 1시간 넘게 걸렸죠. 이제 같은 문서를 LLM에 넣으면 어떻게 되는지 확인해봅시다. Part 2의 수작업 결과가 Ground Truth(정답)가 되고, LLM 결과를 이것과 비교합니다.',
        diagram: {
          nodes: [
            { text: '품질 보고서 3개', type: 'entity' },
            { text: '동일 입력', type: 'dim' },
            { text: 'Part 2: 수작업', type: 'entity' },
            { text: '15노드/20관계 (Ground Truth)', type: 'relation' },
            { text: 'Part 3: LLM', type: 'entity' },
            { text: '?노드/?관계 (비교 대상)', type: 'relation' }
          ]
        },
        callout: {
          type: 'key',
          text: '같은 입력, 다른 방법 → 비교 가능. Part 2 수작업 결과가 정답 기준입니다.'
        }
      },
      {
        id: '1-2',
        tag: 'theory',
        title: '프롬프트 4단계 구조',
        script: 'LLM으로 엔티티와 관계를 자동 추출하려면 프롬프트를 잘 설계해야 합니다. 4개 섹션으로 구성합니다. System Prompt에서 LLM의 역할을 정의하고, Schema Definition에서 추출할 타입을 명시하고, Few-shot Examples에서 실제 예시를 보여주고, User Query에서 추출할 텍스트를 넣습니다.',
        diagram: {
          nodes: [
            { text: 'System Prompt', type: 'entity' },
            { text: '역할 정의', type: 'dim' },
            { text: 'Schema Definition', type: 'entity' },
            { text: '엔티티/관계 타입', type: 'dim' },
            { text: 'Few-shot Examples', type: 'entity' },
            { text: '제조 도메인 예시', type: 'dim' },
            { text: 'User Query', type: 'entity' },
            { text: '품질 보고서 텍스트', type: 'dim' },
            { text: 'LLM', type: 'entity' },
            { text: 'Structured Output', type: 'entity' }
          ]
        },
        callout: {
          type: 'key',
          text: '각 단계마다 명확한 역할 정의 필요. 모호하면 LLM이 임의로 추출합니다.'
        }
      },
      {
        id: '1-3',
        tag: 'practice',
        title: '제조 도메인 프롬프트 템플릿',
        script: '실제 프롬프트 템플릿입니다. SCHEMA 섹션에 Part 2에서 정의한 온톨로지(7개 엔티티 타입, 9개 관계 타입)를 그대로 넣어줍니다. Few-shot 예시도 제조 도메인으로 작성합니다.',
        code: {
          language: 'python',
          code: `# 제조 도메인 프롬프트 템플릿
EXTRACTION_PROMPT = """
## SYSTEM
당신은 제조 품질 도메인의 Knowledge Graph 엔티티/관계 추출 전문가입니다.
주어진 품질 보고서에서 엔티티와 관계를 정확히 추출하세요.

## SCHEMA (허용된 타입만 사용)
엔티티 타입: Process, Equipment, Defect, Material, Product, Spec, Maintenance
관계 타입: CAUSED_BY, USES_EQUIPMENT, USES_MATERIAL, CONFORMS_TO,
          MAINTAINED_ON, PRODUCES, NEXT_PROCESS, DETECTED_IN, INSPECTED_BY

관계 제약:
- CAUSED_BY: Defect → Process
- USES_EQUIPMENT: Process → Equipment
- USES_MATERIAL: Process → Material
- CONFORMS_TO: Material|Product → Spec
- MAINTAINED_ON: Equipment → Maintenance
- PRODUCES: Process → Product
- NEXT_PROCESS: Process → Process
- DETECTED_IN: Defect → Process

## EXAMPLES
입력: "접착 도포 공정에서 접착기 A-3을 사용하여 접착제 EP-200을 도포한다"
출력:
{{
  "entities": [
    {{"name": "접착 도포", "type": "Process"}},
    {{"name": "접착기 A-3", "type": "Equipment"}},
    {{"name": "접착제 EP-200", "type": "Material"}}
  ],
  "relationships": [
    {{"source": "접착 도포", "relation": "USES_EQUIPMENT", "target": "접착기 A-3"}},
    {{"source": "접착 도포", "relation": "USES_MATERIAL", "target": "접착제 EP-200"}}
  ]
}}

## OUTPUT FORMAT
반드시 위 JSON 형식으로만 출력하세요.
허용된 타입 외의 엔티티/관계는 추출하지 마세요.

## INPUT TEXT
{text}
"""`
        },
        callout: {
          type: 'key',
          text: 'SCHEMA 섹션에 온톨로지를 명시 → LLM이 허용된 타입만 추출 → 일관성 보장'
        }
      },
      {
        id: '1-4',
        tag: 'theory',
        title: '구체화 > 일반화 원칙',
        script: 'LLM 프롬프트에서 가장 중요한 원칙입니다. "관계를 추출해줘"라고 일반적으로 지시하면 LLM이 RELATED_TO, HAS, IS_PART_OF 같은 관계를 임의로 만들어냅니다. 대신 "CAUSED_BY, USES_EQUIPMENT만 추출해"라고 구체적으로 지시하면 온톨로지 일관성이 유지됩니다.',
        table: {
          headers: ['접근 방식', '지시 내용', '결과', '문제/장점'],
          rows: [
            {
              cells: [
                { text: '일반화 (❌)', bold: true, status: 'fail' },
                { text: '"관계를 추출해줘"' },
                { text: 'RELATED_TO, HAS, IS_PART_OF...' },
                { text: '온톨로지 불일치' }
              ]
            },
            {
              cells: [
                { text: '구체화 (✅)', bold: true, status: 'pass' },
                { text: '"CAUSED_BY, USES_EQUIPMENT만 추출"' },
                { text: 'CAUSED_BY, USES_EQUIPMENT' },
                { text: '온톨로지 일관성 유지' }
              ]
            }
          ]
        },
        callout: {
          type: 'warn',
          text: '일반화된 지시 = 온톨로지 붕괴. 항상 구체적으로 지시하세요.'
        }
      },
      {
        id: '1-5',
        tag: 'practice',
        title: 'Meta-Dictionary를 프롬프트에 반영',
        script: 'Part 2에서 만든 Meta-Dictionary를 LLM 프롬프트에 반영합니다. meta_dict 변수에 제조 도메인 키워드 사전을 넣고, system_prompt에 JSON으로 변환해서 포함시킵니다.',
        code: {
          language: 'python',
          code: `import json
from openai import OpenAI

# Part 2에서 만든 제조 Meta-Dictionary
meta_dict = {
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
  }
}

# System Prompt에 Dictionary 반영
system_prompt = f"""
제조 품질 도메인에서 엔티티/관계를 추출하세요.
허용된 관계: {json.dumps(meta_dict, ensure_ascii=False)}
출력 형식: JSON (entities, relationships 배열)
"""

client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4o",
    temperature=0,  # 추출 작업은 일관성 우선, 창의성 불필요
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": report_text}
    ],
    response_format={"type": "json_object"}
)`
        },
        callout: {
          type: 'tip',
          text: 'temperature=0 설정 → 추출 작업은 창의성이 아니라 일관성이 중요합니다.'
        }
      },
      {
        id: '1-6',
        tag: 'theory',
        title: '문제정의 ↔ 엔티티 추출 Alignment',
        script: 'LLM 추출을 시작하기 전에 핵심 질문: "추출할 엔티티/관계가 우리의 질문에 답할 수 있는가?" 예를 들어 우리 질문이 "접착 박리 결함의 원인 공정과 관련 설비는?"이라면, 필요한 엔티티는 Defect, Process, Equipment이고 필요한 관계는 CAUSED_BY, USES_EQUIPMENT입니다. 추출 대상과 질문이 정렬되지 않으면 아무리 많은 데이터를 추출해도 쓸모없습니다.',
        diagram: {
          nodes: [
            { text: '질문', type: 'entity' },
            { text: '접착 박리의 원인 공정 설비는?', type: 'dim' },
            { text: '필요 엔티티', type: 'entity' },
            { text: 'Defect, Process, Equipment', type: 'relation' },
            { text: '필요 관계', type: 'entity' },
            { text: 'CAUSED_BY, USES_EQUIPMENT', type: 'relation' },
            { text: '추출 대상', type: 'entity' },
            { text: 'Defect, Process, Equipment + 관계', type: 'dim' },
            { text: '✅ Aligned', type: 'entity' }
          ]
        },
        callout: {
          type: 'key',
          text: '질문과 추출 대상이 정렬되지 않으면 아무리 많은 데이터를 추출해도 쓸모없습니다.'
        }
      },
      {
        id: '1-7',
        tag: 'theory',
        title: '프롬프트 접근법 — 논문 참고 → 비교 → 튜닝',
        script: 'LLM 추출 프롬프트를 처음부터 만들 필요 없습니다. 3단계 접근법을 사용하세요. 1단계: PathRAG, MS GraphRAG, LightRAG 등 검증된 프롬프트를 수집합니다. 2단계: 가져온 프롬프트를 제조 도메인에 적용해보고 결과를 비교합니다. 3단계: 가장 좋았던 프롬프트에 우리 Meta-Dictionary를 추가하고 few-shot 예시를 조정합니다.',
        table: {
          headers: ['단계', '내용', '핵심 포인트'],
          rows: [
            {
              cells: [
                { text: '1. 논문 참고', bold: true },
                { text: 'PathRAG, GraphRAG 등 검증된 프롬프트 수집' },
                { text: '바퀴를 재발명하지 마라' }
              ]
            },
            {
              cells: [
                { text: '2. 비교', bold: true },
                { text: '제조 도메인에 적용 후 결과 비교' },
                { text: '도메인별 차이가 크다' }
              ]
            },
            {
              cells: [
                { text: '3. 튜닝', bold: true },
                { text: 'Meta-Dictionary 추가, few-shot 조정' },
                { text: '도메인 적합성 최대화' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '처음부터 만들지 마세요. 논문 프롬프트 → 비교 → 도메인 튜닝이 가장 효율적입니다.'
        }
      }
    ]
  },
  // Section 2: 자동 추출 실행
  {
    sectionId: 'sec2',
    slides: [
      {
        id: '2-1',
        tag: 'practice',
        title: 'GPT-4o로 품질 보고서 추출',
        script: 'GPT-4o로 Part 2에서 사용한 품질 보고서를 추출해봅시다. temperature=0으로 설정하여 일관성을 확보하고, Structured Outputs(json_schema)로 스키마를 강제합니다.',
        code: {
          language: 'python',
          code: `from openai import OpenAI
import json

client = OpenAI()

# Part 2에서 사용한 동일한 품질 보고서
report_text = """2025년 1월 브레이크 패드 BP-100 생산 라인에서 접착 박리 결함이 3건 발생했다.
접착 도포 공정(80°C)에서 접착기 A-3을 사용하여 접착제 EP-200을 도포하는 과정에서
접착제 도포량이 규격(KS M 6613) 대비 15% 부족한 것으로 확인되었다."""

response = client.chat.completions.create(
    model="gpt-4o",
    temperature=0,
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": report_text}
    ],
    response_format={"type": "json_object"}
)

extracted = json.loads(response.choices[0].message.content)
print(json.dumps(extracted, indent=2, ensure_ascii=False))
# {"entities": [
#   {"name": "브레이크 패드 BP-100", "type": "Product"},
#   {"name": "접착 박리", "type": "Defect"},
#   {"name": "접착 도포", "type": "Process"},
#   {"name": "접착기 A-3", "type": "Equipment"},
#   {"name": "접착제 EP-200", "type": "Material"},
#   {"name": "KS M 6613", "type": "Spec"}
# ], "relationships": [
#   {"source": "접착 박리", "relation": "CAUSED_BY", "target": "접착 도포"},
#   {"source": "접착 도포", "relation": "USES_EQUIPMENT", "target": "접착기 A-3"},
#   ...
# ]}`
        },
        callout: {
          type: 'tip',
          text: 'temperature=0 + json_object 포맷 → 일관된 구조화 출력. 실무에서는 json_schema로 스키마까지 강제할 수 있습니다.'
        }
      },
      {
        id: '2-2',
        tag: 'practice',
        title: 'Claude로 품질 보고서 추출',
        script: 'Claude도 사용해봅시다. Claude API는 system 파라미터를 별도로 제공합니다. messages 배열이 아닌 system 파라미터에 시스템 프롬프트를 넣는 것이 올바른 방법입니다.',
        code: {
          language: 'python',
          code: `from anthropic import Anthropic
import json

client = Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5-20250514",
    max_tokens=2048,
    system=system_prompt,  # system 파라미터 별도 제공
    messages=[
        {"role": "user", "content": report_text}
    ]
)

extracted = json.loads(response.content[0].text)
print(json.dumps(extracted, indent=2, ensure_ascii=False))
# Claude는 긴 보고서에서 맥락을 잘 파악하여
# 암묵적 관계(CONFORMS_TO 등)도 잘 추출하는 경향`
        },
        callout: {
          type: 'tip',
          text: 'Claude API: system은 별도 파라미터로 전달. messages 배열에 넣지 않습니다.'
        }
      },
      {
        id: '2-3',
        tag: 'practice',
        title: '추출 결과 검증 코드',
        script: 'LLM이 추출한 결과를 무조건 믿으면 안 됩니다. 검증 함수를 구현합니다. 엔티티 타입이 허용 목록에 있는지, 관계 타입이 Meta-Dictionary에 있는지, source/target이 실제 엔티티에 존재하는지 확인합니다.',
        code: {
          language: 'python',
          code: `ALLOWED_TYPES = {"Process", "Equipment", "Defect", "Material",
                 "Product", "Spec", "Maintenance"}

def validate_extraction(extracted, meta_dict):
    """LLM 추출 결과 검증"""
    valid_entities, valid_rels, errors = [], [], []
    entity_names = set()

    # 1. 엔티티 타입 검증
    for e in extracted.get("entities", []):
        if e["type"] in ALLOWED_TYPES:
            valid_entities.append(e)
            entity_names.add(e["name"])
        else:
            errors.append(f"Invalid type: {e['type']} for {e['name']}")

    # 2. 관계 검증
    for r in extracted.get("relationships", []):
        if r["relation"] not in meta_dict:
            errors.append(f"Invalid relation: {r['relation']}")
            continue
        if r["source"] not in entity_names or r["target"] not in entity_names:
            errors.append(f"Missing entity: {r['source']} -> {r['target']}")
            continue
        valid_rels.append(r)

    return {
        "entities": valid_entities,
        "relationships": valid_rels,
        "errors": errors,
        "stats": {
            "total": len(extracted.get("entities", [])),
            "valid": len(valid_entities),
            "error_count": len(errors)
        }
    }`
        },
        callout: {
          type: 'warn',
          text: 'LLM 결과를 무조건 믿지 마세요. 화이트리스트 검증은 Cypher Injection 방지에도 필수입니다.'
        }
      },
      {
        id: '2-4',
        tag: 'practice',
        title: '검증된 결과 Neo4j 적재',
        script: '검증이 끝난 결과를 Neo4j에 적재합니다. MERGE 문으로 중복을 방지하고, 엔티티 타입은 화이트리스트로 검증 후 사용합니다.',
        code: {
          language: 'python',
          code: `import os
from neo4j import GraphDatabase

driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI", "bolt://localhost:7687"),
    auth=(os.getenv("NEO4J_USER", "neo4j"),
          os.getenv("NEO4J_PASSWORD", "password123"))
)
# ⚠️ 실무에서는 비밀번호를 .env 파일로 관리하세요

def insert_entities(tx, entities):
    for e in entities:
        if e['type'] not in ALLOWED_TYPES:
            continue  # 화이트리스트에 없는 타입 차단
        tx.run(
            f"MERGE (n:{e['type']} {{name: $name}})",
            name=e['name']
        )

def insert_relationships(tx, relationships):
    for r in relationships:
        tx.run(f"""
            MATCH (a {{name: $source}}), (b {{name: $target}})
            MERGE (a)-[:{r['relation']}]->(b)
        """, source=r['source'], target=r['target'])

with driver.session() as session:
    validated = validate_extraction(extracted, meta_dict)
    session.execute_write(insert_entities, validated["entities"])
    session.execute_write(insert_relationships, validated["relationships"])
    print(f"적재 완료: {validated['stats']}")`
        },
        callout: {
          type: 'tip',
          text: 'MERGE 사용 → 중복 방지. CREATE를 쓰면 같은 노드/관계가 여러 번 생성됩니다.'
        }
      }
    ]
  },
  // Section 3: 수작업 vs LLM 비교
  {
    sectionId: 'sec3',
    slides: [
      {
        id: '3-1',
        tag: 'discussion',
        title: 'Precision / Recall / F1 — 3 메트릭',
        script: 'Part 2의 수작업 결과(Ground Truth)와 LLM 결과를 비교합니다. 정확도를 Precision(정밀도), Recall(재현율), F1 Score로 측정합니다. 아래 숫자는 품질 보고서 3개 기준 예시이며, 실제 결과는 실습에서 직접 측정합니다.',
        code: {
          language: 'python',
          code: `def calculate_metrics(extracted_set, ground_truth_set):
    """
    extracted_set: LLM 추출 (source, relation, target) 집합
    ground_truth_set: Part 2 수작업 (source, relation, target) 집합
    """
    tp = extracted_set & ground_truth_set
    precision = len(tp) / len(extracted_set) if extracted_set else 0
    recall = len(tp) / len(ground_truth_set) if ground_truth_set else 0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) else 0
    return {"precision": precision, "recall": recall, "f1": f1}`
        },
        table: {
          headers: ['메트릭', '수작업 (Part 2)', 'GPT-4o (예시)', 'Claude (예시)'],
          rows: [
            { cells: [{ text: 'Precision (정밀도)', bold: true }, { text: '100% (기준)', status: 'pass' }, { text: '~85%', status: 'warn' }, { text: '~88%', status: 'warn' }] },
            { cells: [{ text: 'Recall (재현율)', bold: true }, { text: '100% (기준)', status: 'pass' }, { text: '~90%', status: 'pass' }, { text: '~92%', status: 'pass' }] },
            { cells: [{ text: 'F1 Score', bold: true }, { text: '1.00', status: 'pass' }, { text: '~0.87', status: 'warn' }, { text: '~0.90', status: 'warn' }] },
            { cells: [{ text: '소요 시간', bold: true }, { text: '60분+' }, { text: '~30초', status: 'pass' }, { text: '~30초', status: 'pass' }] }
          ]
        },
        callout: {
          type: 'warn',
          text: '위 수치는 예시입니다. 실습에서 직접 측정하세요. 도메인과 문서에 따라 크게 달라집니다.'
        }
      },
      {
        id: '3-2',
        tag: 'discussion',
        title: 'LLM이 틀리는 5가지 패턴 — 제조 도메인',
        script: 'LLM이 제조 도메인에서 어떻게 틀리는지 패턴을 분석합니다. 이 패턴을 알아야 검증 로직을 설계할 수 있습니다.',
        table: {
          headers: ['패턴', '제조 도메인 예시', '대응'],
          rows: [
            {
              cells: [
                { text: '1. 환각 관계', bold: true },
                { text: '"접착 도포→연삭" NEXT_PROCESS 생성 (실제: 열압착이 중간에 있음)' },
                { text: '공정 순서 검증 로직' }
              ]
            },
            {
              cells: [
                { text: '2. 누락 엔티티', bold: true },
                { text: 'KS M 6613 규격 언급을 놓치고 Spec 노드 미생성' },
                { text: 'Recall 측정으로 감지' }
              ]
            },
            {
              cells: [
                { text: '3. 방향 오류', bold: true },
                { text: 'CAUSED_BY를 Process→Defect로 추출 (정답: Defect→Process)' },
                { text: 'Meta-Dictionary 방향 검증' }
              ]
            },
            {
              cells: [
                { text: '4. 동의어 혼용', bold: true },
                { text: '"접착기 A-3", "A-3 접착기", "접착 설비"를 별개 노드로 생성' },
                { text: 'Part 4 Entity Resolution' }
              ]
            },
            {
              cells: [
                { text: '5. 과도 세분화', bold: true },
                { text: '"접착제 EP-200"과 "EP-200 에폭시 접착제"를 별개 Material로 분리' },
                { text: 'Part 4 Entity Resolution' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '패턴 4-5(동의어/과도 세분화)는 Part 4 Entity Resolution에서 해결합니다.'
        }
      },
      {
        id: '3-3',
        tag: 'discussion',
        title: 'LLM 평가 바이어스 주의',
        script: 'GPT-4o로 추출한 결과를 GPT-4o로 평가하면 바이어스가 발생합니다. 자기가 만든 결과니까 "이거 맞아"라고 판단할 가능성이 높아요. 교차 평가(GPT→Claude 결과 평가, Claude→GPT 결과 평가)를 하거나, Part 2 수작업 결과를 Ground Truth로 사용하세요. 전체의 10% 이상은 사람이 직접 확인해야 합니다.',
        callout: {
          type: 'warn',
          text: '자동화해도 검수는 필수입니다. Part 2 수작업 결과가 있으니 이걸 Ground Truth로 사용하세요.'
        }
      }
    ]
  },
  // Section 4: Neo4j 자동 적재
  {
    sectionId: 'sec4',
    slides: [
      {
        id: '4-1',
        tag: 'practice',
        title: '일괄 적재 스크립트 (에러 핸들링 포함)',
        script: '여러 품질 보고서를 한 번에 처리하는 스크립트입니다. rate limit 대응과 에러 핸들링을 포함합니다.',
        code: {
          language: 'python',
          code: `import time

# 품질 보고서 로드
reports = load_reports()  # Part 2에서 사용한 3개 + 추가 문서

results = []
for i, report in enumerate(reports):
    try:
        extracted = extract_with_llm(report)
        validated = validate_extraction(extracted, meta_dict)

        with driver.session() as session:
            session.execute_write(insert_entities, validated["entities"])
            session.execute_write(insert_relationships, validated["relationships"])

        results.append(validated["stats"])
        print(f"[{i+1}/{len(reports)}] 완료: "
              f"엔티티 {validated['stats']['valid']}개")
    except Exception as e:
        print(f"[{i+1}/{len(reports)}] 실패: {e}")
        time.sleep(5)  # rate limit 대응
        continue
    time.sleep(0.5)  # API rate limit 방지

print(f"총 {len(reports)}개 문서 처리 완료")`
        },
        callout: {
          type: 'tip',
          text: 'API 비용 참고: 보고서 1건 ≈ 500토큰 입력 + 300토큰 출력. 100건 ≈ $0.50 (GPT-4o 기준). 진짜 비용은 검수 인력 시간입니다.'
        }
      },
      {
        id: '4-2',
        tag: 'practice',
        title: '수작업 vs 자동 — 최종 비교',
        script: '수작업과 자동화의 최종 비교입니다. 수작업의 진짜 병목은 속도가 아니라 판단 일관성이었죠. LLM은 빠르지만 정확도가 낮습니다. 실무에서는 LLM으로 빠르게 초안을 만들고, 사람이 검수하는 하이브리드 방식이 가장 효과적입니다.',
        table: {
          headers: ['항목', '수작업 (Part 2)', 'LLM 자동화 (Part 3)'],
          rows: [
            { cells: [{ text: '시간', bold: true }, { text: '60분+' }, { text: '30초', status: 'pass' }] },
            { cells: [{ text: '처리량', bold: true }, { text: '15노드/20관계' }, { text: '유사 수준 추출', status: 'pass' }] },
            { cells: [{ text: 'Precision', bold: true }, { text: '100%', status: 'pass' }, { text: '~85-88%', status: 'warn' }] },
            { cells: [{ text: 'Recall', bold: true }, { text: '100%', status: 'pass' }, { text: '~90-92%', status: 'pass' }] },
            { cells: [{ text: '판단 일관성', bold: true }, { text: '피로 시 저하', status: 'warn' }, { text: '안정적 (같은 프롬프트)', status: 'pass' }] },
            { cells: [{ text: '확장성', bold: true }, { text: '100문서 = 40시간', status: 'fail' }, { text: '100문서 = 5분', status: 'pass' }] }
          ]
        }
      },
      {
        id: '4-3',
        tag: 'discussion',
        title: 'Part 3 마무리 — 자동화는 시작일 뿐',
        script: 'LLM 자동화로 속도는 비약적으로 향상되었지만, 정확도 과제가 남아있습니다. 특히 동의어 문제("접착기 A-3" vs "A-3 접착기")는 프롬프트만으로 해결이 어렵습니다. Part 4에서 Entity Resolution을 배워서 중복/유사 엔티티를 통합합니다. 그리고 Part 2에서 수작업을 경험했기 때문에, LLM이 뽑은 결과가 맞는지 틀렸는지 판단할 수 있습니다. 수작업 경험 없이 자동화부터 하면 품질 판단이 불가능합니다.',
        callout: {
          type: 'key',
          text: 'Part 4 예고: "접착기 A-3"과 "A-3 접착기"를 같은 엔티티로 통합하는 Entity Resolution을 배웁니다.'
        }
      }
    ]
  }
];
