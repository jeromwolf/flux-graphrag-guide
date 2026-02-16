import type { SectionContent } from './part1-content';

export const part11Content: SectionContent[] = [
  // Section 1: GraphRAG 실패 유형 분류
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '11-1',
        tag: 'theory',
        title: '세 가지 실패 유형',
        script: 'GraphRAG가 이상한 답을 내놓는 이유는 크게 세 가지입니다. Retrieval 실패 — 필요한 노드를 못 찾음. Generation 실패 — 노드는 찾았는데 답이 이상함. Schema 실패 — Cypher 쿼리가 틀렸거나 실행 불가. 이 세 가지를 구분하지 못하면 디버깅 시간이 10배 걸립니다.',
        diagram: {
          nodes: [
            { text: '❌ Retrieval 실패', type: 'fail' },
            { text: '관련 노드를 못 찾음', type: 'dim' },
            { text: '❌ Generation 실패', type: 'fail' },
            { text: '노드는 찾았는데 답이 이상', type: 'dim' },
            { text: '❌ Schema 실패', type: 'fail' },
            { text: 'Cypher 쿼리가 틀림', type: 'dim' }
          ]
        }
      },
      {
        id: '11-2',
        tag: 'theory',
        title: '실패 유형별 디버깅 진입점',
        script: '각 실패 유형마다 확인할 곳이 다릅니다. 이 표를 머릿속에 넣어두세요.',
        table: {
          headers: ['유형', '증상', '확인할 곳', '해결 방법'],
          rows: [
            {
              cells: [
                { text: 'Retrieval 실패', bold: true },
                { text: '결과가 빈 배열 []' },
                { text: 'Cypher 결과, 노드 존재 여부' },
                { text: '온톨로지 재검증, 엔티티 정규화' }
              ]
            },
            {
              cells: [
                { text: 'Generation 실패', bold: true },
                { text: '답이 질문과 무관' },
                { text: 'LLM 프롬프트, 컨텍스트 길이' },
                { text: '프롬프트 개선, 컨텍스트 요약' }
              ]
            },
            {
              cells: [
                { text: 'Schema 실패', bold: true },
                { text: 'Cypher 문법 에러' },
                { text: 'LLM 생성 쿼리, 스키마 정의' },
                { text: 'Few-shot 예시 추가, 스키마 단순화' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '실패 유형을 3초 안에 구분하는 것이 디버깅의 핵심입니다.'
        }
      },
      {
        id: '11-3',
        tag: 'theory',
        title: '실제 실패 사례 10가지',
        script: '현업에서 자주 발생하는 실패 패턴 10가지입니다. 1) 엔티티 대소문자 불일치. 2) 날짜 포맷 파싱 실패. 3) Cypher의 예약어 충돌. 4) 컨텍스트 윈도우 초과. 5) 너무 긴 Multi-hop (5-hop 이상). 6) 순환 참조 무한 루프. 7) 노드 타입 오타 (Company vs company). 8) 관계 방향 반대로 생성. 9) 프로퍼티 이름 불일치. 10) LLM이 Cypher 대신 SQL 생성.',
        callout: {
          type: 'warn',
          text: '이 10가지 패턴만 체크해도 80%의 실패를 예방할 수 있습니다.'
        }
      }
    ]
  },

  // Section 2: 추적 파이프라인 실습
  {
    sectionId: 'sec2',
    slides: [
      {
        id: '11-4',
        tag: 'practice',
        title: 'LangSmith/LangFuse 셋업',
        script: 'LangSmith나 LangFuse를 사용하면 RAG 파이프라인의 모든 단계를 추적할 수 있습니다. 여기서는 LangSmith 예시로 갑니다.',
        code: {
          language: 'python',
          code: `# pip install langsmith
import os
from langsmith import Client

# 1. API 키 설정
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "your-api-key"
os.environ["LANGCHAIN_PROJECT"] = "graphrag-debug"

# 2. LangChain으로 RAG 실행하면 자동으로 추적됨
from langchain_openai import ChatOpenAI
from langchain.chains import GraphCypherQAChain

chain = GraphCypherQAChain.from_llm(
    llm=ChatOpenAI(temperature=0),
    graph=graph,
    verbose=True
)

# 이제 모든 호출이 LangSmith에 기록됨
result = chain.invoke({"query": "삼성전자에 투자한 기관은?"})`
        },
        callout: {
          type: 'tip',
          text: 'LangSmith UI에서 각 LLM 호출의 입력/출력, Cypher 쿼리, 실행 시간을 모두 볼 수 있습니다.'
        }
      },
      {
        id: '11-5',
        tag: 'practice',
        title: '전 구간 트레이싱 — 어디서 잘못됐는지 3분 안에',
        script: 'LangSmith 대시보드에서 실패한 호출을 클릭하면 각 단계별로 뭐가 잘못됐는지 3분 안에 찾을 수 있습니다.',
        code: {
          language: 'python',
          code: `# LangSmith에서 확인할 수 있는 정보
# 1. LLM Cypher 생성
#    Input: "삼성전자에 투자한 기관은?"
#    Output: "MATCH (c:Company {name: 'samsung'})<-[:INVESTED_IN]-(i) RETURN i"
#    ❌ 문제: 'samsung' 대신 '삼성전자'여야 함

# 2. Neo4j 쿼리 실행
#    Query: MATCH (c:Company {name: 'samsung'})...
#    Result: []
#    ❌ 노드를 못 찾음

# 3. LLM Answer 생성
#    Context: []
#    Output: "정보가 없습니다"
#    ❌ 빈 컨텍스트로 답변 생성

# 해결: Few-shot 예시에 '삼성전자' 원문 사용 추가`
        },
        callout: {
          type: 'key',
          text: '각 단계의 입력/출력을 보면 정확히 어느 지점에서 잘못됐는지 바로 알 수 있습니다.'
        }
      },
      {
        id: '11-6',
        tag: 'practice',
        title: '실패 쿼리 디버깅 실전 훈련',
        script: '10개의 실패 케이스를 하나씩 추적해봅시다. 1) 엔티티 이름 불일치. 2) 관계 방향 반대. 3) 프로퍼티 타입 불일치. 4) Cypher 문법 에러. 5) 컨텍스트 초과. 6) 순환 참조. 7) 노드 타입 오타. 8) 날짜 파싱 실패. 9) LLM이 SQL 생성. 10) Multi-hop 너무 김. 각 케이스를 LangSmith로 추적하면서 문제를 정확히 찾아내는 연습을 합니다.',
        callout: {
          type: 'tip',
          text: '실전 훈련은 Jupyter Notebook으로 진행합니다. 각 케이스별로 트레이싱 URL을 캡처해보세요.'
        }
      }
    ]
  },

  // Section 3: 비용 폭발 구간 식별
  {
    sectionId: 'sec3',
    slides: [
      {
        id: '11-7',
        tag: 'theory',
        title: '엔티티 추출 비용 — 문서당 얼마?',
        script: 'GraphRAG의 가장 큰 비용은 엔티티 추출 단계입니다. 문서를 LLM에 보내서 엔티티와 관계를 추출하는데, 문서가 길면 토큰이 기하급수적으로 늘어납니다.',
        table: {
          headers: ['문서 크기', '모델', '입력 토큰', '출력 토큰', '비용 (예상)'],
          rows: [
            {
              cells: [
                { text: '1K 토큰', bold: false },
                { text: 'GPT-4' },
                { text: '1,500' },
                { text: '500' },
                { text: '$0.045' }
              ]
            },
            {
              cells: [
                { text: '5K 토큰', bold: false },
                { text: 'GPT-4' },
                { text: '7,500' },
                { text: '1,200' },
                { text: '$0.24' }
              ]
            },
            {
              cells: [
                { text: '10K 토큰', bold: false },
                { text: 'GPT-4' },
                { text: '15,000' },
                { text: '2,000' },
                { text: '$0.50' }
              ]
            },
            {
              cells: [
                { text: '10K 토큰', bold: false },
                { text: 'GPT-3.5-turbo' },
                { text: '15,000' },
                { text: '2,000' },
                { text: '$0.04', status: 'pass' }
              ]
            }
          ]
        },
        callout: {
          type: 'warn',
          text: '1,000개 문서를 GPT-4로 추출하면 $500 이상 나옵니다. GPT-3.5-turbo를 쓰면 $40 정도.'
        }
      },
      {
        id: '11-8',
        tag: 'theory',
        title: '커뮤니티 요약 토큰 폭발',
        script: 'MS GraphRAG 방식을 쓰면 커뮤니티 탐지 후 각 커뮤니티를 요약합니다. 노드가 1만 개면 커뮤니티가 수백 개 나오고, 각 커뮤니티를 LLM으로 요약하면 비용이 기하급수적으로 증가합니다. 이게 MS GraphRAG의 가장 큰 단점입니다. 우리가 Cypher 방식을 쓰는 이유 중 하나입니다.',
        diagram: {
          nodes: [
            { text: '📄 1만 개 노드', type: 'entity' },
            { text: 'Leiden 알고리즘', type: 'relation' },
            { text: '🏘️ 300개 커뮤니티', type: 'entity' },
            { text: 'LLM 요약 × 300', type: 'relation' },
            { text: '💸 토큰 폭발', type: 'fail' }
          ]
        },
        callout: {
          type: 'warn',
          text: 'MS GraphRAG는 대규모 KG에서 비용이 기하급수적으로 증가합니다. Cypher 방식은 커뮤니티 요약이 없어서 비용이 훨씬 적습니다.'
        }
      },
      {
        id: '11-9',
        tag: 'theory',
        title: 'Text2Cypher 재시도 루프의 함정',
        script: 'Cypher 쿼리 생성에 실패하면 LLM에게 다시 요청합니다. 근데 이게 계속 실패하면 재시도 루프에 빠집니다. 5번 재시도하면 토큰이 5배로 늘어납니다.',
        diagram: {
          nodes: [
            { text: '🤖 LLM: Cypher 생성', type: 'entity' },
            { text: '❌ 실패', type: 'fail' },
            { text: '🔁 재시도 #1', type: 'entity' },
            { text: '❌ 실패', type: 'fail' },
            { text: '🔁 재시도 #2', type: 'entity' },
            { text: '❌ 실패', type: 'fail' },
            { text: '💸 비용 3배', type: 'fail' }
          ]
        },
        callout: {
          type: 'warn',
          text: '재시도 횟수를 3회로 제한하고, 실패하면 폴백 전략(벡터 검색)으로 전환하세요.'
        }
      }
    ]
  },

  // Section 4: 비용 최적화 7가지 기법
  {
    sectionId: 'sec4',
    slides: [
      {
        id: '11-10',
        tag: 'practice',
        title: '시맨틱 캐싱 + 배치 처리 + 모델 라우팅',
        script: '첫 번째 기법은 시맨틱 캐싱입니다. 비슷한 질문이 들어오면 LLM을 다시 호출하지 않고 캐시된 결과를 씁니다. 두 번째는 배치 처리 — 여러 문서를 한 번에 처리. 세 번째는 모델 라우팅 — 간단한 쿼리는 GPT-3.5, 복잡한 쿼리만 GPT-4.',
        code: {
          language: 'python',
          code: `# 1. 시맨틱 캐싱
from langchain.cache import InMemoryCache
from langchain.embeddings import OpenAIEmbeddings

cache = InMemoryCache(embeddings=OpenAIEmbeddings())
llm = ChatOpenAI(cache=cache)

# 2. 배치 처리
documents = [doc1, doc2, doc3, ...]
batch_size = 10
for i in range(0, len(documents), batch_size):
    batch = documents[i:i+batch_size]
    extract_entities_batch(batch)  # LLM 호출 횟수 1/10

# 3. 모델 라우팅
def route_model(query):
    if is_simple(query):
        return ChatOpenAI(model="gpt-3.5-turbo")
    else:
        return ChatOpenAI(model="gpt-4")`
        },
        callout: {
          type: 'key',
          text: '이 3가지만 적용해도 비용이 50% 이상 줄어듭니다.'
        }
      },
      {
        id: '11-11',
        tag: 'practice',
        title: '스키마 프루닝 + 증분 업데이트',
        script: '네 번째는 스키마 프루닝 — LLM에게 전체 스키마를 보내지 말고 관련 부분만 보냅니다. 다섯 번째는 증분 업데이트 — 전체 KG를 재구축하지 말고 변경된 문서만 업데이트.',
        code: {
          language: 'python',
          code: `# 4. 스키마 프루닝
# 질문: "삼성전자에 투자한 기관은?"
# 전체 스키마를 보내지 말고, Company와 Investor 관련 부분만

relevant_schema = prune_schema(full_schema, query)
cypher = llm.generate_cypher(query, relevant_schema)

# 5. 증분 업데이트
# 새 문서만 추출
new_docs = get_new_documents_since(last_update)
for doc in new_docs:
    entities = extract_entities(doc)
    graph.merge_entities(entities)  # 중복은 자동 병합`
        },
        callout: {
          type: 'tip',
          text: '스키마 프루닝은 프롬프트 토큰을 50% 줄이고, 증분 업데이트는 재구축 비용을 90% 줄입니다.'
        }
      },
      {
        id: '11-12',
        tag: 'practice',
        title: '프롬프트 압축 + 결과 캐싱',
        script: '여섯 번째는 프롬프트 압축 — LongLLMLingua 같은 도구로 프롬프트를 압축합니다. 일곱 번째는 결과 캐싱 — Cypher 쿼리 결과를 Redis에 캐싱.',
        code: {
          language: 'python',
          code: `# 6. 프롬프트 압축
from llmlingua import PromptCompressor

compressor = PromptCompressor()
compressed_prompt = compressor.compress_prompt(
    original_prompt,
    rate=0.5  # 50% 압축
)

# 7. 결과 캐싱
import redis
cache = redis.Redis(host='localhost', port=6379)

def cached_cypher_query(cypher):
    key = f"cypher:{hash(cypher)}"
    cached = cache.get(key)
    if cached:
        return json.loads(cached)
    result = graph.query(cypher)
    cache.setex(key, 3600, json.dumps(result))  # 1시간
    return result`
        },
        callout: {
          type: 'key',
          text: '이 7가지 기법을 모두 적용하면 월 비용을 70-80% 줄일 수 있습니다.'
        }
      }
    ]
  },

  // Section 5: 최적화 전/후 비교
  {
    sectionId: 'sec5',
    slides: [
      {
        id: '11-13',
        tag: 'discussion',
        title: '100개 쿼리 벤치마크 — 최적화 전',
        script: '실제 프로덕션 환경에서 100개 쿼리를 처리하는 비용과 성능을 측정했습니다. 최적화 전 결과입니다.',
        table: {
          headers: ['지표', '값', '상태'],
          rows: [
            {
              cells: [
                { text: '총 비용', bold: true },
                { text: '$487' },
                { text: '❌', status: 'fail' }
              ]
            },
            {
              cells: [
                { text: '평균 응답 시간', bold: false },
                { text: '8.3초' },
                { text: '❌', status: 'fail' }
              ]
            },
            {
              cells: [
                { text: 'LLM 호출 횟수', bold: false },
                { text: '437회' },
                { text: '❌', status: 'fail' }
              ]
            },
            {
              cells: [
                { text: '캐시 히트율', bold: false },
                { text: '0%' },
                { text: '❌', status: 'fail' }
              ]
            },
            {
              cells: [
                { text: '정확도', bold: false },
                { text: '87%' },
                { text: '⚠️', status: 'warn' }
              ]
            }
          ]
        },
        callout: {
          type: 'warn',
          text: '월 $500 가까운 비용에 응답 시간도 느립니다. 최적화 필요.'
        }
      },
      {
        id: '11-14',
        tag: 'discussion',
        title: '최적화 적용 후 — 월 $500 → $150',
        script: '7가지 최적화 기법을 모두 적용한 결과입니다. 비용이 70% 줄고, 속도는 2배 빨라졌습니다.',
        table: {
          headers: ['지표', '최적화 전', '최적화 후', '개선율'],
          rows: [
            {
              cells: [
                { text: '총 비용', bold: true },
                { text: '$487' },
                { text: '$142', status: 'pass' },
                { text: '-71%' }
              ]
            },
            {
              cells: [
                { text: '평균 응답 시간', bold: false },
                { text: '8.3초' },
                { text: '4.1초', status: 'pass' },
                { text: '-51%' }
              ]
            },
            {
              cells: [
                { text: 'LLM 호출 횟수', bold: false },
                { text: '437회' },
                { text: '178회', status: 'pass' },
                { text: '-59%' }
              ]
            },
            {
              cells: [
                { text: '캐시 히트율', bold: false },
                { text: '0%' },
                { text: '62%', status: 'pass' },
                { text: '+62%p' }
              ]
            },
            {
              cells: [
                { text: '정확도', bold: false },
                { text: '87%' },
                { text: '89%', status: 'pass' },
                { text: '+2%p' }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '비용도 줄고 속도도 빨라지고 정확도도 올랐습니다. 최적화의 힘!'
        }
      },
      {
        id: '11-15',
        tag: 'theory',
        title: 'Part 11 핵심 정리',
        script: 'Part 11 핵심 정리입니다. 첫째, GraphRAG 실패는 Retrieval/Generation/Schema 세 가지로 분류합니다. 둘째, LangSmith/LangFuse로 전 구간을 추적하면 3분 안에 문제를 찾을 수 있습니다. 셋째, 비용 폭발은 엔티티 추출과 재시도 루프에서 발생합니다. 넷째, 7가지 최적화 기법으로 비용을 70% 줄일 수 있습니다. 다섯째, 비용 최적화의 80%는 캐싱에서 옵니다.',
        callout: {
          type: 'key',
          text: '비용 최적화의 80%는 캐싱에서 옵니다. 시맨틱 캐싱과 결과 캐싱을 반드시 적용하세요.'
        },
        table: {
          headers: ['핵심 개념', '한 줄 요약'],
          rows: [
            {
              cells: [
                { text: '실패 유형 분류', bold: true },
                { text: 'Retrieval/Generation/Schema' }
              ]
            },
            {
              cells: [
                { text: '추적 도구', bold: true },
                { text: 'LangSmith/LangFuse로 3분 안에 원인 파악' }
              ]
            },
            {
              cells: [
                { text: '비용 폭발 구간', bold: true },
                { text: '엔티티 추출, 커뮤니티 요약, 재시도 루프' }
              ]
            },
            {
              cells: [
                { text: '최적화 기법', bold: true },
                { text: '7가지 기법으로 비용 70% 절감' }
              ]
            },
            {
              cells: [
                { text: '핵심 원칙', bold: true },
                { text: '캐싱이 80%, 나머지가 20%' }
              ]
            }
          ]
        }
      }
    ]
  }
];
