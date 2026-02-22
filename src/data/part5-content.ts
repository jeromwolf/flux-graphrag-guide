import type { SectionContent, SlideContent } from './part1-content';

export const part5Content: SectionContent[] = [
  // Section 1: VLM 개념 (Part 4 연결 오프닝, OCR vs VLM, 최신 VLM 모델 비교)
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '1-1',
        tag: 'theory',
        title: '"텍스트만 추출하면 끝인 줄 알았다"',
        script: 'Part 2~4에서 품질 보고서의 텍스트로 30노드 KG를 구축했습니다. 중복도 제거하고, Multi-hop 쿼리도 동작합니다. 하지만 같은 품질 보고서를 다시 열어보세요. 검사 성적표(표)와 공정 흐름도(이미지)가 포함되어 있습니다. 텍스트만 추출하면 "BP-100의 경도 측정값이 HRS 42로, KS M 6613 기준 HRS 45-65 범위를 미달한다"는 핵심 정보가 빠집니다. 표에는 합격/불합격 판정, 규격 대비 수치가 있고, 공정 흐름도에는 공정 순서와 설비 배치가 있어요. 이걸 놓치면 "어떤 검사 항목이 불합격이었나?"라는 질문에 답할 수 없습니다.',
        visual: '품질 보고서 페이지: 텍스트(추출됨) + 검사 성적표(미추출) + 공정 흐름도(미추출)',
        callout: {
          type: 'warn',
          text: '텍스트만 추출한 KG는 불완전하다 — 표와 이미지에 핵심 정보가 숨어 있다.'
        }
      },
      {
        id: '1-2',
        tag: 'theory',
        title: 'OCR vs VLM — 패러다임 전환',
        script: '표를 처리하는 전통적인 방법은 OCR입니다. 하지만 OCR은 문자를 인식할 뿐, 구조를 이해하지 못합니다. 검사 성적표에서 셀 병합된 "BP-100" 제품명이 여러 행에 걸쳐 있으면 OCR은 이걸 처리 못해요. "경도"가 어느 제품의 검사 항목인지 맥락도 파악 못합니다. VLM(Vision Language Model)은 다릅니다. 이미지를 이해하고, 표 구조를 보존하고, "이 셀은 BP-100의 경도 측정값"이라는 맥락까지 파악합니다.',
        table: {
          headers: ['기능', 'OCR (구세대)', 'VLM (신세대)'],
          rows: [
            {
              cells: [
                { text: '인식 대상', bold: true },
                { text: '문자만', status: 'warn' },
                { text: '시각적 구조 + 맥락', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '구조 보존', bold: true },
                { text: '손실', status: 'fail' },
                { text: '보존', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '셀 병합 처리', bold: true },
                { text: '불가', status: 'fail' },
                { text: '가능', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '맥락 이해', bold: true },
                { text: '불가', status: 'fail' },
                { text: '가능', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: 'VLM은 표를 "이미지"가 아니라 "구조화된 데이터"로 이해합니다.'
        }
      },
      {
        id: '1-3',
        tag: 'theory',
        title: '주요 VLM 모델 — 2025년 기준',
        script: 'VLM 모델도 여러 가지가 있습니다. GPT-4o는 범용이고 Structured Outputs를 지원합니다. Claude Sonnet 4.5는 긴 문서 처리가 강력하고, PDF를 직접 전달할 수 있어서 이미지 변환 없이 바로 처리 가능합니다. Gemini 2.0 Flash는 빠르고 무료 티어가 있어서 프로토타이핑에 좋습니다. Upstage Document Parse는 한국어 문서에 특화되어 레이아웃 분석이 뛰어나고, 제조 현장의 한글 검사 성적표 처리에 강합니다.',
        table: {
          headers: ['모델', '개발사', '특징', '표 인식', '비용'],
          rows: [
            {
              cells: [
                { text: 'GPT-4o', bold: true },
                { text: 'OpenAI' },
                { text: '범용, Structured Outputs 지원' },
                { text: '우수', status: 'pass' },
                { text: '$$$$', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: 'Claude Sonnet 4.5', bold: true },
                { text: 'Anthropic' },
                { text: '긴 문서, PDF 네이티브 지원' },
                { text: '우수', status: 'pass' },
                { text: '$$$', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: 'Gemini 2.0 Flash', bold: true },
                { text: 'Google' },
                { text: '빠름, 무료 티어' },
                { text: '개선됨', status: 'pass' },
                { text: '$$', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Upstage Document Parse', bold: true },
                { text: 'Upstage' },
                { text: '한국어 문서 특화, 레이아웃 분석' },
                { text: '우수', status: 'pass' },
                { text: '$$', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '실무 추천: Claude Sonnet 4.5 (PDF 직접 전달) 또는 GPT-4o (Structured Outputs). 한국어 문서는 Upstage Document Parse도 고려하세요.'
        }
      }
    ]
  },
  // Section 2: 표→그래프 두 가지 접근 (접근법 A/B + 제조 표 유형별 의사결정 가이드)
  {
    sectionId: 'sec2',
    slides: [
      {
        id: '2-1',
        tag: 'theory',
        title: '접근법 A — 관계 중심 (엔티티/관계 추출)',
        script: '표를 그래프로 바꾸는 방법은 두 가지입니다. 접근법 A는 관계 중심입니다. 표 이미지를 VLM에 넣고, 엔티티와 관계를 직접 추출해서 그래프에 적재합니다. 검사 성적표처럼 "BP-100이 KS M 6613 규격을 미달한다"는 관계가 명확한 표에 적합합니다. 설비 점검표에서 "열프레스 HP-01이 2025-01-15에 점검되었다"도 마찬가지입니다.',
        diagram: {
          nodes: [
            { text: '표 이미지', type: 'entity' },
            { text: 'VLM', type: 'relation' },
            { text: '엔티티/관계 추출', type: 'entity' },
            { text: 'JSON 출력', type: 'dim' },
            { text: 'Neo4j 적재', type: 'entity' }
          ]
        },
        callout: {
          type: 'key',
          text: '관계가 명확한 표 → 접근법 A (예: 검사 성적표, 설비 점검표, 공정 흐름도)'
        }
      },
      {
        id: '2-2',
        tag: 'theory',
        title: '접근법 B — 정보 중심 (요약 + 벡터화)',
        script: '접근법 B는 정보 중심입니다. 표를 구조화 데이터로 변환하고, LLM으로 요약한 다음, 요약문을 벡터화해서 그래프에 넣습니다. 공정 파라미터 기록표처럼 온도/압력/시간 수치가 가득한 표에 적합합니다. 불량 통계표의 월별 불량률 데이터도 요약+벡터화가 효과적이에요. Pinterest도 이 방식을 씁니다.',
        diagram: {
          nodes: [
            { text: '표 이미지', type: 'entity' },
            { text: 'VLM', type: 'relation' },
            { text: '구조화 데이터', type: 'entity' },
            { text: 'LLM 요약', type: 'relation' },
            { text: '요약문', type: 'entity' },
            { text: '벡터화 + 그래프', type: 'relation' }
          ]
        },
        callout: {
          type: 'key',
          text: '수치 데이터가 많은 표 → 접근법 B (예: 공정 파라미터 기록표, 불량 통계표)'
        }
      },
      {
        id: '2-3',
        tag: 'theory',
        title: '검사 성적표 사례 — 접근법 A',
        script: 'BP-100 브레이크 패드의 검사 성적표를 봅시다. 제품, 검사 항목, 규격, 기준값, 측정값, 판정이 있습니다. 경도가 HRS 42로 기준 범위 HRS 45-65를 미달해서 불합격입니다. 이건 관계가 명확하니까 접근법 A를 씁니다. VLM이 "BP-100 → CONFORMS_TO → KS M 6613" 관계를 추출하고, 불합격 항목은 Defect 노드로 만듭니다.',
        table: {
          headers: ['제품', '검사항목', '규격', '기준값', '측정값', '판정'],
          rows: [
            {
              cells: [
                { text: 'BP-100' },
                { text: '경도' },
                { text: 'KS M 6613' },
                { text: 'HRS 45-65' },
                { text: 'HRS 42', status: 'fail' },
                { text: '불합격', status: 'fail' }
              ]
            },
            {
              cells: [
                { text: 'BP-100' },
                { text: '마찰계수' },
                { text: 'KS M 6613' },
                { text: '0.35-0.45' },
                { text: '0.38', status: 'pass' },
                { text: '합격', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'BP-100' },
                { text: '두께' },
                { text: 'KS R 1142' },
                { text: '12.0-12.5mm' },
                { text: '12.3mm', status: 'pass' },
                { text: '합격', status: 'pass' }
              ]
            }
          ]
        },
        diagram: {
          nodes: [
            { text: 'BP-100:Product', type: 'entity' },
            { text: 'CONFORMS_TO', type: 'relation' },
            { text: 'KS M 6613:Spec', type: 'entity' },
            { text: 'HAS_DEFECT', type: 'relation' },
            { text: '경도 미달:Defect', type: 'entity' }
          ]
        },
        callout: {
          type: 'tip',
          text: '접근법 A: 검사 성적표 → Product/Spec/Defect 엔티티 + CONFORMS_TO/HAS_DEFECT 관계'
        }
      },
      {
        id: '2-4',
        tag: 'theory',
        title: '공정 파라미터 기록표 사례 — 접근법 B',
        script: '공정 파라미터 기록표는 온도, 압력, 시간 등 수치가 빽빽합니다. 접착 도포 공정의 시간대별 온도가 78, 82, 80, 79도로 기록되어 있어요. 이걸 일일이 엔티티로 만들면 복잡하기만 합니다. 접근법 B로 요약합니다. "2025-01-15 접착 도포 공정: 온도 78-82도 범위, 평균 79.8도로 기준값 80도 대비 정상 범위." 이 요약을 벡터화해서 그래프에 넣으면, "접착 도포 공정의 온도 추이는?"이라는 질문에 벡터 검색으로 답할 수 있습니다.',
        callout: {
          type: 'tip',
          text: '접근법 B: 수치 데이터 → 요약 + 벡터화 → 자연어 검색 가능'
        }
      },
      {
        id: '2-5',
        tag: 'theory',
        title: '제조 표 유형별 접근법 의사결정 가이드',
        script: '어떤 표에 어떤 접근법을 쓸지 정리합니다. 검사 성적표는 합격/불합격과 규격 대비 측정값이 있으니 접근법 A입니다. Product→CONFORMS_TO→Spec 관계가 명확하니까요. 공정 파라미터 기록표는 수치 데이터가 많으니 접근법 B입니다. 요약+벡터화가 적합해요. 설비 점검표는 점검 항목/상태/교체 이력이 있으니 접근법 A입니다. Equipment→MAINTAINED_ON 관계가 명확합니다. 불량 통계표는 월별/공정별 불량률이니 접근법 B, 트렌드 파악이 핵심이에요. 공정 흐름도는 이미지지만 접근법 A입니다. Process→NEXT_PROCESS 순서를 추출합니다.',
        table: {
          headers: ['제조 문서 표 유형', '접근법', '이유'],
          rows: [
            {
              cells: [
                { text: '검사 성적표', bold: true },
                { text: 'A (관계 중심)', status: 'pass' },
                { text: 'Product→CONFORMS_TO→Spec 관계 명확' }
              ]
            },
            {
              cells: [
                { text: '공정 파라미터 기록표', bold: true },
                { text: 'B (정보 중심)', status: 'warn' },
                { text: '수치 데이터 많음, 요약+벡터화 적합' }
              ]
            },
            {
              cells: [
                { text: '설비 점검표', bold: true },
                { text: 'A (관계 중심)', status: 'pass' },
                { text: 'Equipment→MAINTAINED_ON 관계 명확' }
              ]
            },
            {
              cells: [
                { text: '불량 통계표', bold: true },
                { text: 'B (정보 중심)', status: 'warn' },
                { text: '통계 수치 중심, 트렌드 파악' }
              ]
            },
            {
              cells: [
                { text: '공정 흐름도 (이미지)', bold: true },
                { text: 'A (관계 중심)', status: 'pass' },
                { text: 'Process→NEXT_PROCESS 순서 추출' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '관계가 명확하면 A, 수치/통계가 많으면 B. 공정 흐름도는 이미지지만 관계 추출이므로 A.'
        }
      }
    ]
  },
  // Section 3: 문서→그래프 계층 구조 (제조 품질 보고서 계층, Pinterest→제조 연결)
  {
    sectionId: 'sec3',
    slides: [
      {
        id: '3-1',
        tag: 'theory',
        title: '제조 품질 보고서 — 문서 계층 구조',
        script: '제조 품질 보고서는 계층 구조가 있습니다. 최상위에 QualityReport가 있고, 그 아래 InspectionResult(검사 결과)와 ProcessRecord(공정 기록) 섹션이 있습니다. 표와 이미지도 계층에 포함됩니다. InspectionTable(검사 성적표)과 ProcessFlowDiagram(공정 흐름도)이 별도 노드로 연결됩니다. 각 표와 이미지는 MENTIONS 관계로 Product, Spec, Defect, Process, Equipment 엔티티와 연결됩니다. 이 계층을 그래프에 반영하면 "검사 결과 섹션에서 불합격 판정된 항목은?"처럼 문서 구조를 활용한 검색이 가능합니다.',
        diagram: {
          nodes: [
            { text: 'QualityReport', type: 'entity' },
            { text: 'HAS_SECTION', type: 'relation' },
            { text: 'InspectionResult', type: 'entity' },
            { text: 'HAS_TABLE', type: 'relation' },
            { text: 'InspectionTable', type: 'entity' },
            { text: 'MENTIONS', type: 'relation' },
            { text: 'Product / Spec / Defect', type: 'dim' }
          ]
        },
        callout: {
          type: 'key',
          text: '문서 계층 = QualityReport → Section → Table/Figure → Entity. 계층을 반영하면 검색 정확도 향상.'
        }
      },
      {
        id: '3-2',
        tag: 'theory',
        title: '품질 보고서 전체 계층 — Cypher 스키마',
        script: '품질 보고서의 전체 계층을 Cypher로 표현합니다. QualityReport에서 HAS_SECTION으로 InspectionResult와 ProcessRecord에 연결하고, HAS_TABLE로 InspectionTable, HAS_FIGURE로 ProcessFlowDiagram에 연결합니다. 표와 이미지 노드에서 MENTIONS로 실제 도메인 엔티티에 연결합니다. 이 구조 덕분에 "어느 보고서의 어느 표에서 이 엔티티가 언급되었는지"를 추적할 수 있습니다.',
        code: {
          language: 'cypher',
          code: `// 품질 보고서 계층 구조
(:QualityReport) -[:HAS_SECTION]-> (:InspectionResult)
(:QualityReport) -[:HAS_SECTION]-> (:ProcessRecord)
(:QualityReport) -[:HAS_TABLE]->   (:InspectionTable)
(:QualityReport) -[:HAS_FIGURE]->  (:ProcessFlowDiagram)

// 표/이미지 → 도메인 엔티티 연결
(:InspectionTable)      -[:MENTIONS]-> (:Product)
(:InspectionTable)      -[:MENTIONS]-> (:Spec)
(:InspectionTable)      -[:MENTIONS]-> (:Defect)
(:ProcessFlowDiagram)   -[:MENTIONS]-> (:Process)
(:ProcessFlowDiagram)   -[:MENTIONS]-> (:Equipment)`
        },
        callout: {
          type: 'tip',
          text: 'MENTIONS 관계로 표/이미지와 도메인 엔티티를 연결 — 출처 추적의 핵심'
        }
      },
      {
        id: '3-3',
        tag: 'theory',
        title: '표는 SQL — Pinterest 아이디어 + 제조 적용',
        script: 'Pinterest는 표 데이터를 SQLite에 넣고, SQL로 조회한 결과를 요약해서 벡터화합니다. 제조에서도 이 방식을 쓸 수 있어요. 공정 파라미터 기록표를 SQLite에 넣고, "접착 도포 공정의 최근 5회 평균 온도는?"을 SQL 쿼리로 조회합니다. 결과를 LLM으로 요약하고, 요약문을 벡터화해서 KG에 넣습니다. 구조화 데이터의 정확한 수치 조회와 자연어 검색의 유연성을 동시에 얻는 하이브리드 접근입니다.',
        visual: '(공정 파라미터 표 → SQLite → SQL 쿼리 → 요약 → 벡터) 흐름도',
        callout: {
          type: 'tip',
          text: 'Pinterest 패턴: 표 → SQL DB → 쿼리 → 요약 → 벡터. 제조 공정 파라미터 기록표에 적합.'
        }
      }
    ]
  },
  // Section 4: 표 이미지 → 구조화 데이터 (검사 성적표 실습, VLM API, 검증 코드, 모델 비교)
  {
    sectionId: 'sec4',
    slides: [
      {
        id: '4-1',
        tag: 'practice',
        title: 'VLM API 호출 — 검사 성적표 추출',
        script: '검사 성적표 이미지를 Claude API에 보내서 구조화 데이터를 추출합니다. Anthropic() 클라이언트는 ANTHROPIC_API_KEY 환경변수를 자동으로 읽으므로 API 키를 코드에 하드코딩하지 않습니다. temperature=0으로 설정해서 추출 결과의 일관성을 확보합니다. Part 3~4에서 강조한 패턴과 동일합니다. system 파라미터로 역할을 명시하고, Few-shot 예시를 포함하면 정확도가 크게 올라갑니다.',
        code: {
          language: 'python',
          code: `import anthropic
import base64

# 검사 성적표 이미지를 base64로 인코딩
with open("inspection_report_table.png", "rb") as f:
    img_b64 = base64.b64encode(f.read()).decode()

# ANTHROPIC_API_KEY 환경변수 자동 로드
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5-20250514",
    max_tokens=2048,
    temperature=0,  # 추출 작업 — 일관성 우선 (Part 3-4 패턴)
    system="제조 품질검사 성적표에서 데이터를 정확하게 추출하는 전문가입니다. "
           "모든 수치는 원본 그대로 추출하고, 판정 결과를 정확히 기록하세요.",
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/png",
                    "data": img_b64
                }
            },
            {
                "type": "text",
                "text": """이 검사 성적표를 JSON 배열로 변환하세요.

예시:
[{"제품": "BP-100", "검사항목": "경도", "규격": "KS M 6613",
  "기준값": "HRS 45-65", "측정값": "HRS 42", "판정": "불합격"}]

모든 행을 빠짐없이 추출하세요."""
            }
        ]
    }]
)

print(response.content[0].text)`
        },
        callout: {
          type: 'tip',
          text: 'API 키 하드코딩 금지 — Anthropic()은 ANTHROPIC_API_KEY 환경변수를 자동 로드합니다. temperature=0 필수.'
        }
      },
      {
        id: '4-2',
        tag: 'practice',
        title: 'PDF 네이티브 지원 — 이미지 변환 불필요',
        script: 'Claude Sonnet 4.5는 PDF를 직접 전달할 수 있습니다. 품질 보고서가 PDF라면 이미지로 변환할 필요 없이 바로 보내면 됩니다. 여러 페이지에 걸친 검사 성적표도 한 번에 처리 가능합니다. 단, PDF 파일 크기 제한에 주의하세요.',
        code: {
          language: 'python',
          code: `import anthropic
import base64

# PDF 파일을 직접 전달 — 이미지 변환 불필요
with open("quality_report_2025.pdf", "rb") as f:
    pdf_b64 = base64.b64encode(f.read()).decode()

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5-20250514",
    max_tokens=4096,
    temperature=0,
    system="제조 품질 보고서의 검사 성적표와 공정 기록을 정확하게 추출합니다.",
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "document",
                "source": {
                    "type": "base64",
                    "media_type": "application/pdf",
                    "data": pdf_b64
                }
            },
            {
                "type": "text",
                "text": "이 품질 보고서에서 모든 검사 성적표를 JSON으로 추출하세요."
            }
        ]
    }]
)

print(response.content[0].text)`
        },
        callout: {
          type: 'key',
          text: 'Claude PDF 네이티브 지원: 이미지 변환 없이 PDF 직접 전달. 다중 페이지 표도 한 번에 처리.'
        }
      },
      {
        id: '4-3',
        tag: 'practice',
        title: '검사 성적표 Few-shot 프롬프트',
        script: 'VLM에 Few-shot 예시를 제공하면 정확도가 크게 올라갑니다. 특히 제조 검사 성적표는 형식이 일정하므로, 한두 개 예시만 줘도 효과가 좋습니다. 주의할 점: 측정값의 단위(HRS, mm, 무차원 등)를 명시적으로 포함하도록 지시하세요. VLM이 단위를 누락하는 경우가 잦습니다.',
        code: {
          language: 'text',
          code: `제조 검사 성적표를 JSON으로 변환하세요.

[Few-shot 예시]
입력: 제품 BP-100, 경도, KS M 6613, HRS 45-65, HRS 42, 불합격
출력: {"제품": "BP-100", "검사항목": "경도", "규격": "KS M 6613",
       "기준값": "HRS 45-65", "측정값": "HRS 42", "판정": "불합격"}

추출 규칙:
1. 모든 행을 JSON 배열로 출력
2. 측정값에 단위를 반드시 포함 (HRS, mm, 무차원 등)
3. 셀 병합된 제품명은 해당 행 모두에 적용
4. 빈 셀은 null로 표기
5. 판정은 "합격" 또는 "불합격"만 사용`
        },
        callout: {
          type: 'tip',
          text: 'Few-shot 예시 1-2개 → 정확도 대폭 향상. 단위 포함을 명시적으로 지시하세요.'
        }
      },
      {
        id: '4-4',
        tag: 'practice',
        title: '표 추출 결과 검증 — validate_table_extraction()',
        script: 'VLM도 완벽하지 않습니다. Part 3의 validate_extraction 패턴을 표 데이터에 적용합니다. 필수 필드 존재 여부, 판정값 유효성(합격/불합격만 허용), 측정값 단위 포함 여부, 기준값 범위 파싱 가능 여부를 확인합니다. 특히 수치 정확도가 중요합니다. VLM이 "HRS 42"를 "HRS 24"로 잘못 읽는 경우가 있어요.',
        code: {
          language: 'python',
          code: `REQUIRED_FIELDS = {"제품", "검사항목", "규격", "기준값", "측정값", "판정"}
VALID_JUDGMENTS = {"합격", "불합격"}

def validate_table_extraction(rows: list[dict]) -> dict:
    """검사 성적표 추출 결과 검증 (Part 3 validate_extraction 패턴)"""
    valid_rows, errors = [], []

    for i, row in enumerate(rows):
        # 1. 필수 필드 검증
        missing = REQUIRED_FIELDS - set(row.keys())
        if missing:
            errors.append(f"행 {i}: 필수 필드 누락 — {missing}")
            continue

        # 2. 판정값 유효성
        if row["판정"] not in VALID_JUDGMENTS:
            errors.append(f"행 {i}: 잘못된 판정값 — {row['판정']}")
            continue

        # 3. 측정값 단위 포함 여부
        if not any(u in str(row["측정값"]) for u in ["HRS", "mm", "0."]):
            errors.append(f"행 {i}: 측정값 단위 누락 — {row['측정값']}")

        valid_rows.append(row)

    return {
        "valid_rows": valid_rows,
        "errors": errors,
        "stats": {"total": len(rows), "valid": len(valid_rows),
                  "error_count": len(errors)}
    }`
        },
        callout: {
          type: 'warn',
          text: 'VLM도 완벽하지 않음 → 검증 필수. Part 3의 validate_extraction 패턴을 표 데이터에 적용.'
        }
      },
      {
        id: '4-5',
        tag: 'practice',
        title: 'GPT-4o vs Claude Sonnet 4.5 비교',
        script: '두 모델을 검사 성적표에서 비교해봅시다. 셀 병합 처리는 둘 다 우수합니다. 긴 표(50행 이상)에서는 Claude가 강력합니다. PDF 직접 전달은 Claude만 지원해요. 수치 정확도는 둘 다 우수하지만, 반드시 검증 코드로 확인하세요.',
        table: {
          headers: ['항목', 'GPT-4o', 'Claude Sonnet 4.5'],
          rows: [
            {
              cells: [
                { text: '셀 병합 처리', bold: true },
                { text: '우수', status: 'pass' },
                { text: '우수', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '긴 표 처리 (50행+)', bold: true },
                { text: '보통', status: 'warn' },
                { text: '우수', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'PDF 네이티브', bold: true },
                { text: '미지원', status: 'fail' },
                { text: '지원', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '수치 정확도', bold: true },
                { text: '우수', status: 'pass' },
                { text: '우수', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: 'Structured Outputs', bold: true },
                { text: '지원', status: 'pass' },
                { text: '미지원', status: 'warn' }
              ]
            }
          ]
        },
        callout: {
          type: 'warn',
          text: '위 비용은 예시이며, 이미지 해상도와 토큰 수에 따라 달라집니다. 실무에서는 반드시 자체 벤치마크를 수행하세요.'
        }
      }
    ]
  },
  // Section 5: 구조화 데이터 → KG 적재 (접근법 A: 검사 성적표, 접근법 B: 공정 파라미터, KG 통합, 하이브리드 검색)
  {
    sectionId: 'sec5',
    slides: [
      {
        id: '5-1',
        tag: 'practice',
        title: '접근법 A — 검사 성적표 → KG 적재',
        script: 'VLM이 추출한 검사 성적표 JSON을 그래프에 적재합니다. Product→CONFORMS_TO→Spec 관계를 만들고, 불합격 항목은 Defect 노드로 생성합니다. Neo4j 인증은 환경변수를 사용합니다. Part 3-4와 동일한 os.getenv 패턴이에요.',
        code: {
          language: 'python',
          code: `import os
from neo4j import GraphDatabase

# 환경변수로 인증 — Part 3-4 패턴
driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI", "bolt://localhost:7687"),
    auth=(os.getenv("NEO4J_USER", "neo4j"),
          os.getenv("NEO4J_PASSWORD", "password123"))
)

# 검사 성적표 데이터 (VLM 추출 결과)
inspection_data = [
    {"제품": "BP-100", "검사항목": "경도", "규격": "KS M 6613",
     "기준값": "HRS 45-65", "측정값": "HRS 42", "판정": "불합격"},
    {"제품": "BP-100", "검사항목": "마찰계수", "규격": "KS M 6613",
     "기준값": "0.35-0.45", "측정값": "0.38", "판정": "합격"},
    {"제품": "BP-100", "검사항목": "두께", "규격": "KS R 1142",
     "기준값": "12.0-12.5mm", "측정값": "12.3mm", "판정": "합격"},
]

def create_inspection_graph(tx, row):
    query = """
    MERGE (p:Product {name: $product})
    MERGE (s:Spec {name: $spec})
    MERGE (p)-[:CONFORMS_TO {
        item: $item, criteria: $criteria,
        measured: $measured, judgment: $judgment
    }]->(s)
    """
    tx.run(query, product=row["제품"], spec=row["규격"],
           item=row["검사항목"], criteria=row["기준값"],
           measured=row["측정값"], judgment=row["판정"])

    # 불합격 항목 → Defect 노드 생성
    if row["판정"] == "불합격":
        tx.run("""
            MERGE (p:Product {name: $product})
            MERGE (d:Defect {name: $defect_name})
            SET d.item = $item, d.measured = $measured,
                d.criteria = $criteria
            MERGE (p)-[:HAS_DEFECT]->(d)
        """, product=row["제품"],
             defect_name=f"{row['검사항목']} 미달",
             item=row["검사항목"], measured=row["측정값"],
             criteria=row["기준값"])

with driver.session() as session:
    for row in inspection_data:
        session.execute_write(create_inspection_graph, row)`
        },
        callout: {
          type: 'tip',
          text: 'MERGE로 중복 방지. 불합격 항목은 Defect 노드로 분리하여 불량 추적 가능.'
        }
      },
      {
        id: '5-2',
        tag: 'practice',
        title: '접근법 B — 공정 파라미터 → 요약 + 벡터화',
        script: '공정 파라미터 기록표는 접근법 B로 처리합니다. 표를 요약하고, 다국어 모델로 벡터화해서 그래프에 넣습니다. Part 4에서 사용한 paraphrase-multilingual-MiniLM-L12-v2를 동일하게 사용합니다. all-MiniLM-L6-v2는 영어 전용이라 한국어 제조 도메인에서는 부적합합니다.',
        code: {
          language: 'python',
          code: `from openai import OpenAI
from sentence_transformers import SentenceTransformer

client = OpenAI()
# 다국어 모델 — Part 4와 동일 (한영 혼용 제조 도메인)
embed_model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

# 1. 공정 파라미터 표 요약 생성
table_json = """
[{"공정": "접착 도포", "시간": "09:00", "온도": 78, "압력": 2.1, "습도": 45},
 {"공정": "접착 도포", "시간": "09:30", "온도": 82, "압력": 2.3, "습도": 44},
 {"공정": "접착 도포", "시간": "10:00", "온도": 80, "압력": 2.2, "습도": 46}]
"""

summary_prompt = f"""
이 공정 파라미터 기록표를 요약하시오:
{table_json}

요약 요구사항:
- 공정명과 측정 시간 범위
- 각 파라미터의 범위와 평균
- 기준값 대비 이상 여부
- 주요 트렌드 (상승/하강/안정)
"""

response = client.chat.completions.create(
    model="gpt-4o-mini",
    temperature=0,
    messages=[{"role": "user", "content": summary_prompt}]
)
summary = response.choices[0].message.content

# 2. 요약 벡터화
embedding = embed_model.encode(summary)

# 3. Neo4j에 적재
def create_table_summary(tx, summary, embedding):
    query = """
    CREATE (ts:TableSummary {
        text: $summary,
        embedding: $embedding,
        source: 'process_parameter_20250115.png',
        process: '접착 도포',
        doc_type: 'process_parameter'
    })
    """
    tx.run(query, summary=summary, embedding=embedding.tolist())

with driver.session() as session:
    session.execute_write(create_table_summary, summary, embedding)`
        },
        callout: {
          type: 'tip',
          text: 'paraphrase-multilingual-MiniLM-L12-v2 = 다국어 지원. all-MiniLM-L6-v2(영어 전용) 대신 사용.'
        }
      },
      {
        id: '5-3',
        tag: 'practice',
        title: 'Part 2~4 KG와 통합 — 제조 도메인 MERGE',
        script: 'Part 2~4에서 만든 텍스트 기반 KG와 Part 5의 표/이미지 KG를 통합합니다. MERGE로 동일 엔티티를 연결하고, 출처 정보를 source 속성에 추가합니다. 기존 TextChunk 노드와 새로운 InspectionTable/TableSummary 노드가 같은 엔티티를 통해 연결됩니다.',
        code: {
          language: 'cypher',
          code: `// 1. 표에서 추출한 엔티티를 기존 KG와 MERGE
MERGE (p:Product {name: 'BP-100'})
SET p.source = coalesce(p.source, []) + 'inspection_report_table.png'

// 2. 검사 성적표 노드 생성 + 문서 계층 연결
CREATE (it:InspectionTable {
  source: 'inspection_report_table.png',
  date: '2025-01-15'
})
MATCH (qr:QualityReport {name: '품질검사보고서_2025-01-15'})
MERGE (qr)-[:HAS_TABLE]->(it)

// 3. 표 노드 → 도메인 엔티티 MENTIONS
MATCH (it:InspectionTable {source: 'inspection_report_table.png'})
MATCH (p:Product {name: 'BP-100'})
MERGE (it)-[:MENTIONS]->(p)

MATCH (it:InspectionTable {source: 'inspection_report_table.png'})
MATCH (s:Spec {name: 'KS M 6613'})
MERGE (it)-[:MENTIONS]->(s)

// 4. 기존 텍스트 노드와 교차 연결
MATCH (t:TextChunk)
WHERE t.text CONTAINS 'BP-100'
MATCH (p:Product {name: 'BP-100'})
MERGE (p)-[:MENTIONED_IN]->(t)

// 5. 통합 확인 — 텍스트+표 연결
MATCH path = (p:Product {name: 'BP-100'})-[*1..2]-(n)
RETURN path LIMIT 50`
        },
        callout: {
          type: 'key',
          text: 'MERGE로 텍스트(Part 2~4) + 표(Part 5) 통합 그래프 구축. Multi-hop 쿼리가 텍스트와 표를 넘나듭니다.'
        }
      },
      {
        id: '5-4',
        tag: 'practice',
        title: '벡터 인덱스 — Neo4j 5.x 방식',
        script: '접근법 B의 요약 노드를 벡터 검색하려면 Neo4j 5.x의 벡터 인덱스를 사용합니다. 기존 gds.similarity.cosine 함수 대신 네이티브 벡터 인덱스를 생성하고, db.index.vector.queryNodes로 검색합니다. 벡터 차원은 paraphrase-multilingual-MiniLM-L12-v2의 384차원에 맞춥니다.',
        code: {
          language: 'cypher',
          code: `// Neo4j 5.x 벡터 인덱스 생성
CREATE VECTOR INDEX table_summary_index
FOR (ts:TableSummary) ON (ts.embedding)
OPTIONS {indexConfig: {
  \`vector.dimensions\`: 384,
  \`vector.similarity_function\`: 'cosine'
}}

// 벡터 검색 — 질문과 유사한 표 요약 찾기
CALL db.index.vector.queryNodes(
  'table_summary_index', 5, $query_embedding
) YIELD node, score
RETURN node.text, node.source, node.process, score
ORDER BY score DESC`
        },
        callout: {
          type: 'key',
          text: 'Neo4j 5.x 벡터 인덱스: gds.similarity.cosine 대신 네이티브 인덱스 사용. 차원수 384 = multilingual-MiniLM.'
        }
      },
      {
        id: '5-5',
        tag: 'practice',
        title: '하이브리드 검색 — 벡터 + 그래프',
        script: '벡터 검색과 그래프 검색을 결합합니다. "접착 도포 공정의 검사 성적표에서 불합격 항목은?"이라는 질문에 대해, 벡터 검색으로 관련 표 요약을 찾고, 그래프 검색으로 Product→CONFORMS_TO→Spec 관계를 탐색합니다. 두 결과를 합쳐서 LLM에게 전달하면 정확한 답변을 생성할 수 있습니다. 이 하이브리드 검색이 Part 6의 핵심 주제입니다.',
        code: {
          language: 'python',
          code: `def hybrid_search(question: str):
    # 1. 질문 임베딩
    q_embedding = embed_model.encode(question)

    # 2. 벡터 검색 — Neo4j 5.x 벡터 인덱스
    vector_query = """
    CALL db.index.vector.queryNodes(
        'table_summary_index', 5, $q_emb
    ) YIELD node, score
    RETURN node.text AS summary, node.source, score
    """

    # 3. 그래프 검색 — 불합격 항목 탐색
    graph_query = """
    MATCH (p:Product)-[c:CONFORMS_TO]->(s:Spec)
    WHERE c.judgment = '불합격'
    RETURN p.name AS product, c.item AS item,
           c.measured AS measured, s.name AS spec
    """

    # 4. 결과 합치기
    with driver.session() as session:
        vector_results = session.run(vector_query,
                                     q_emb=q_embedding.tolist())
        graph_results = session.run(graph_query)

        return {
            "vector": [dict(r) for r in vector_results],
            "graph": [dict(r) for r in graph_results]
        }

# 예시
result = hybrid_search(
    "접착 도포 공정의 검사 성적표에서 불합격 항목은?"
)`
        },
        callout: {
          type: 'key',
          text: '하이브리드 검색: 벡터로 관련 표 찾고 + 그래프로 관계 탐색 → Part 6에서 완성'
        }
      }
    ]
  },
  // Section 6: 중간 점검 (전체 KG 시각화, 접근법 A/B 비교)
  {
    sectionId: 'sec6',
    slides: [
      {
        id: '6-1',
        tag: 'discussion',
        title: '지금까지 만든 KG 전체 시각화',
        script: 'Neo4j Browser에서 전체 그래프를 확인합니다. Part 2~4의 텍스트 노드(Process, Equipment, Defect, Material, Product, Spec, Maintenance)와 Part 5의 표/이미지 노드(InspectionTable, TableSummary, ProcessFlowDiagram)가 하나의 그래프로 통합되어 있습니다. Product "BP-100"을 중심으로 텍스트 청크, 검사 성적표, 공정 파라미터 요약이 모두 연결됩니다.',
        code: {
          language: 'cypher',
          code: `// 전체 그래프 확인 (샘플 100개)
MATCH (n)
RETURN n
LIMIT 100

// 노드 타입별 개수
MATCH (n)
RETURN labels(n) AS type, count(n) AS count
ORDER BY count DESC

// 텍스트-표 통합 확인 — BP-100 중심
MATCH (p:Product {name: 'BP-100'})-[r]-(n)
RETURN p.name, type(r), labels(n), n.name
ORDER BY type(r)

// 불합격 항목 추적 — 표에서 추출된 Defect
MATCH (p:Product)-[:HAS_DEFECT]->(d:Defect)
RETURN p.name, d.name, d.measured, d.criteria`
        },
        callout: {
          type: 'key',
          text: '텍스트(Part 2~4) + 표/이미지(Part 5) = 멀티모달 통합 KG!'
        }
      },
      {
        id: '6-2',
        tag: 'discussion',
        title: '접근법 A/B 비교 — 제조 도메인 결론',
        script: '접근법 A와 B를 비교합니다. A는 관계 추론이 정확하고 Cypher 쿼리로 직접 답을 찾을 수 있습니다. "BP-100의 불합격 항목은?"에 바로 답합니다. B는 정보 손실이 적고 벡터 검색이 가능합니다. "접착 도포 공정의 온도 추이는?"에 자연어로 답합니다. 실무에서는 표 유형에 따라 선택하거나, 둘 다 사용합니다. 검사 성적표는 A, 공정 파라미터는 B, 필요하면 동시에 적용합니다.',
        table: {
          headers: ['항목', '접근법 A (관계 중심)', '접근법 B (정보 중심)'],
          rows: [
            {
              cells: [
                { text: '적합한 표', bold: true },
                { text: '검사 성적표, 설비 점검표' },
                { text: '공정 파라미터, 불량 통계' }
              ]
            },
            {
              cells: [
                { text: '그래프 추론 정확도', bold: true },
                { text: '높음', status: 'pass' },
                { text: '낮음', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: 'Cypher 쿼리 가능', bold: true },
                { text: '가능', status: 'pass' },
                { text: '제한적', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: '정보 손실', bold: true },
                { text: '있음 (수치 일부 누락)', status: 'warn' },
                { text: '최소화 (요약 보존)', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '벡터 검색', bold: true },
                { text: '불가', status: 'fail' },
                { text: '가능', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '설계 복잡도', bold: true },
                { text: '높음 (온톨로지 필요)', status: 'warn' },
                { text: '낮음', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '실무 추천: 관계 명확한 표는 A, 수치 데이터 표는 B. 둘 다 쓰면 하이브리드 검색 가능 → Part 6.'
        }
      }
    ]
  }
];
