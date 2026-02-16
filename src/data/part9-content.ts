import type { SectionContent } from './part1-content';

export const part9Content: SectionContent[] = [
  // Section 1: 커뮤니티 탐지 (20min) - 3 slides
  {
    sectionId: 'sec1',
    slides: [
      {
        id: '9-1',
        tag: 'theory',
        title: '커뮤니티란? — 강하게 연결된 노드 그룹',
        script: '그래프에서 "커뮤니티"는 서로 밀접하게 연결된 노드들의 클러스터를 의미합니다. 같은 커뮤니티 내부는 연결이 많고, 커뮤니티 간에는 연결이 적죠. 제조 KG에서는 같은 공정라인의 장비들, 금융에서는 자주 거래하는 기업 그룹이 커뮤니티가 됩니다. GraphRAG에서 커뮤니티를 찾으면 관련 노드를 묶어서 검색할 수 있고, 요약도 만들 수 있습니다.',
        diagram: {
          nodes: [
            { text: '장비A', type: 'entity' },
            { text: '연결1', type: 'relation' },
            { text: '장비B', type: 'entity' },
            { text: '연결2', type: 'relation' },
            { text: '장비C', type: 'entity' },
            { text: '약한 연결', type: 'dim' },
            { text: '다른 커뮤니티', type: 'fail' }
          ]
        },
        callout: {
          type: 'key',
          text: '커뮤니티 = 내부 밀집 + 외부 희소. GraphRAG의 Global Search는 커뮤니티 요약 기반입니다.'
        }
      },
      {
        id: '9-2',
        tag: 'theory',
        title: 'Louvain vs Leiden — 어떤 알고리즘을 쓸까?',
        script: '커뮤니티 탐지 알고리즘은 여러 가지가 있지만, 실무에서는 Louvain과 Leiden이 대표적입니다. Louvain은 빠르지만 품질이 불안정할 수 있고, Leiden은 약간 느리지만 더 정확합니다. Neo4j GDS에서는 둘 다 지원하며, 대부분의 경우 Leiden을 권장합니다. 100만 노드 이상에서는 속도 차이가 체감되므로 상황에 맞게 선택하세요.',
        table: {
          headers: ['항목', 'Louvain', 'Leiden'],
          rows: [
            {
              cells: [
                { text: '속도' },
                { text: '⭐⭐⭐', status: 'pass' },
                { text: '⭐⭐', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: '품질' },
                { text: '⭐⭐', status: 'warn' },
                { text: '⭐⭐⭐', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '확장성' },
                { text: '1M+ 노드', status: 'pass' },
                { text: '1M+ 노드', status: 'pass' }
              ]
            },
            {
              cells: [
                { text: '권장 용도' },
                { text: '빠른 프로토타입' },
                { text: '프로덕션', status: 'pass', bold: true }
              ]
            }
          ]
        },
        callout: {
          type: 'tip',
          text: '실무 권장: Leiden. 속도가 문제라면 샘플링으로 그래프 크기를 줄이세요.'
        }
      },
      {
        id: '9-3',
        tag: 'practice',
        title: 'Neo4j GDS 커뮤니티 탐지 실행',
        script: 'Neo4j GDS(Graph Data Science) 라이브러리로 Leiden을 실행해봅시다. 먼저 그래프를 메모리에 프로젝션하고, 알고리즘을 돌려서 각 노드의 커뮤니티 ID를 얻습니다. 결과를 노드에 속성으로 저장하면, 나중에 같은 커뮤니티끼리 묶어서 검색할 수 있습니다. 제조 예시: 같은 공정라인 장비들이 하나의 커뮤니티로 묶입니다.',
        code: {
          language: 'cypher',
          code: `// 1. 그래프 프로젝션 생성
CALL gds.graph.project(
  'myGraph',
  'Equipment',
  'CONNECTED_TO'
);

// 2. Leiden 실행 (스트리밍)
CALL gds.leiden.stream('myGraph')
YIELD nodeId, communityId
RETURN gds.util.asNode(nodeId).name AS equipment,
       communityId
ORDER BY communityId, equipment
LIMIT 20;

// 3. 커뮤니티 속성 저장
CALL gds.leiden.write('myGraph', {
  writeProperty: 'community'
});

// 4. 커뮤니티별 노드 수 확인
MATCH (n:Equipment)
RETURN n.community AS community,
       count(n) AS size
ORDER BY size DESC;`
        },
        callout: {
          type: 'tip',
          text: 'gds.graph.project는 메모리 작업. 대용량이면 Cypher projection으로 필터링하세요.'
        }
      }
    ]
  },

  // Section 2: 중심성 알고리즘 (20min) - 3 slides
  {
    sectionId: 'sec2',
    slides: [
      {
        id: '9-4',
        tag: 'theory',
        title: 'PageRank — 영향력 있는 노드 찾기',
        script: 'PageRank는 구글 검색의 핵심 알고리즘입니다. 많은 링크를 받는 페이지가 중요하다는 원리죠. KG에서는 "많이 참조되는 노드"가 중요한 노드입니다. 제조 예시: 여러 공정에서 사용하는 핵심 부품. 금융: 많은 거래의 중심이 되는 기업. GraphRAG에서는 PageRank 높은 노드를 우선 검색하거나, 리랭킹에 활용합니다.',
        diagram: {
          nodes: [
            { text: '핵심 노드', type: 'entity' },
            { text: '← 참조1', type: 'relation' },
            { text: '노드A', type: 'dim' },
            { text: '← 참조2', type: 'relation' },
            { text: '노드B', type: 'dim' },
            { text: '← 참조3', type: 'relation' },
            { text: '노드C', type: 'dim' }
          ]
        },
        callout: {
          type: 'key',
          text: 'PageRank = 링크 개수 × 링크의 품질. GraphRAG 리랭킹에 필수 알고리즘입니다.'
        }
      },
      {
        id: '9-5',
        tag: 'theory',
        title: 'Betweenness Centrality — 정보 흐름의 브리지',
        script: 'Betweenness Centrality는 "많은 최단 경로가 지나가는 노드"를 찾습니다. 이런 노드는 정보 흐름의 병목점이자 브리지 역할을 합니다. 제조 예시: 여러 라인을 연결하는 중간 공정. 조직도: 팀 간 협업의 허브 인물. GraphRAG에서는 이런 노드를 찾아서 컨텍스트에 포함하면 더 풍부한 답변을 얻을 수 있습니다.',
        diagram: {
          nodes: [
            { text: '커뮤니티A', type: 'dim' },
            { text: '→', type: 'relation' },
            { text: '브리지 노드', type: 'entity' },
            { text: '→', type: 'relation' },
            { text: '커뮤니티B', type: 'dim' }
          ]
        },
        callout: {
          type: 'tip',
          text: '브리지 노드는 제거 시 그래프가 단절될 수 있는 critical path입니다.'
        }
      },
      {
        id: '9-6',
        tag: 'practice',
        title: 'Neo4j GDS 중심성 알고리즘 실습',
        script: 'PageRank와 Betweenness Centrality를 Neo4j GDS로 실행해봅시다. 두 알고리즘 모두 stream, write, mutate 모드를 지원합니다. stream은 결과 확인용, write는 노드에 속성 저장, mutate는 인메모리 그래프에만 저장. 실무에서는 write로 저장 후 Cypher 쿼리에서 활용합니다.',
        code: {
          language: 'cypher',
          code: `// 1. PageRank 실행 (상위 10개)
CALL gds.pageRank.stream('myGraph')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS node,
       score
ORDER BY score DESC
LIMIT 10;

// 2. PageRank 저장
CALL gds.pageRank.write('myGraph', {
  writeProperty: 'pagerank'
});

// 3. Betweenness Centrality 실행
CALL gds.betweenness.stream('myGraph')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name AS node,
       score
ORDER BY score DESC
LIMIT 10;

// 4. 두 중심성 조합 조회
MATCH (n:Equipment)
WHERE n.pagerank > 0.1 AND n.betweenness > 0.5
RETURN n.name, n.pagerank, n.betweenness
ORDER BY n.pagerank DESC;`
        },
        callout: {
          type: 'warn',
          text: 'Betweenness는 계산 비용이 높습니다. 대용량 그래프는 샘플링 권장.'
        }
      }
    ]
  },

  // Section 3: 경로 알고리즘 (20min) - 3 slides
  {
    sectionId: 'sec3',
    slides: [
      {
        id: '9-7',
        tag: 'theory',
        title: '최단 경로 — Multi-hop 추론의 핵심',
        script: '최단 경로 알고리즘은 두 노드 사이의 가장 짧은 경로를 찾습니다. Dijkstra는 가중치가 있는 그래프에서, All Shortest Paths는 모든 최단 경로를 찾습니다. GraphRAG에서는 "A와 B의 관계"를 물어볼 때 경로를 추출해서 LLM에 전달합니다. 예: "제품 X와 불량 원인 Y의 연결 고리는?" → 경로 = 증거 사슬.',
        diagram: {
          nodes: [
            { text: '제품X', type: 'entity' },
            { text: '→ 사용', type: 'relation' },
            { text: '부품A', type: 'dim' },
            { text: '→ 공급', type: 'relation' },
            { text: '공급사B', type: 'dim' },
            { text: '→ 불량', type: 'fail' },
            { text: '원인Y', type: 'entity' }
          ]
        },
        callout: {
          type: 'key',
          text: '경로 = 추론의 증거. LLM에 경로를 주면 hallucination이 줄어듭니다.'
        }
      },
      {
        id: '9-8',
        tag: 'practice',
        title: '경로 탐색 실습 — shortestPath()',
        script: 'Neo4j의 shortestPath() 함수로 최단 경로를 찾아봅시다. 관계 방향과 타입을 지정할 수 있고, 최대 깊이도 제한할 수 있습니다. 결과는 path 객체로 반환되며, nodes()와 relationships()로 분리해서 분석할 수 있습니다. 실무 팁: maxHops를 5 이하로 제한하세요. 너무 길면 의미가 희석됩니다.',
        code: {
          language: 'cypher',
          code: `// 1. 두 노드 간 최단 경로
MATCH (start:Equipment {name: '장비A'}),
      (end:Equipment {name: '장비Z'})
MATCH path = shortestPath((start)-[*..5]-(end))
RETURN path;

// 2. 경로 노드와 관계 추출
MATCH (start:Equipment {name: '장비A'}),
      (end:Equipment {name: '장비Z'})
MATCH path = shortestPath((start)-[*..5]-(end))
RETURN [node IN nodes(path) | node.name] AS nodes,
       [rel IN relationships(path) | type(rel)] AS relations;

// 3. 모든 최단 경로 찾기 (All Shortest Paths)
MATCH (start:Equipment {name: '장비A'}),
      (end:Equipment {name: '장비Z'})
MATCH paths = allShortestPaths((start)-[*..5]-(end))
RETURN paths
LIMIT 10;

// 4. 경로 길이 필터링
MATCH path = shortestPath((a:Equipment)-[*..5]-(b:Equipment))
WHERE length(path) >= 3
RETURN a.name, b.name, length(path) AS hops
LIMIT 20;`
        },
        callout: {
          type: 'tip',
          text: 'maxHops 제한 필수. 무한 경로 탐색은 성능 문제를 일으킵니다.'
        }
      },
      {
        id: '9-9',
        tag: 'practice',
        title: '경로 기반 추론 — LLM에 증거 사슬 전달',
        script: '경로를 찾았으면, 이를 LLM에 전달해서 추론하게 만듭니다. 경로의 노드와 관계를 텍스트로 변환 후 프롬프트에 포함합니다. 예: "제품X → 부품A → 공급사B → 불량원인Y 경로가 있습니다. 이 연결의 의미는?" LLM은 경로를 기반으로 근거 있는 답변을 생성합니다.',
        code: {
          language: 'python',
          code: `# 경로 추출 및 LLM 프롬프트 구성
from neo4j import GraphDatabase
import openai

def find_path_and_explain(start_name, end_name):
    driver = GraphDatabase.driver("bolt://localhost:7687")

    with driver.session() as session:
        result = session.run("""
            MATCH (start {name: $start}), (end {name: $end})
            MATCH path = shortestPath((start)-[*..5]-(end))
            RETURN [node IN nodes(path) | node.name] AS nodes,
                   [rel IN relationships(path) | type(rel)] AS relations
        """, start=start_name, end=end_name)

        record = result.single()
        if not record:
            return "경로를 찾을 수 없습니다."

        nodes = record["nodes"]
        relations = record["relations"]

        # 경로 텍스트 생성
        path_text = " → ".join([
            f"{nodes[i]} ({relations[i]})"
            for i in range(len(relations))
        ]) + f" → {nodes[-1]}"

        # LLM 프롬프트
        prompt = f"""
        다음 지식 그래프 경로가 발견되었습니다:
        {path_text}

        이 경로의 의미와 시사점을 설명하세요.
        """

        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )

        return response.choices[0].message.content

# 실행 예시
result = find_path_and_explain("제품X", "불량원인Y")
print(result)`
        },
        callout: {
          type: 'key',
          text: '경로 = 증거 사슬. Hallucination 방지의 핵심 패턴입니다.'
        }
      }
    ]
  },

  // Section 4: 알고리즘 → RAG 통합 (30min) - 3 slides
  {
    sectionId: 'sec4',
    slides: [
      {
        id: '9-10',
        tag: 'practice',
        title: 'PageRank 리랭킹 — 벡터 + 그래프 결합',
        script: '벡터 검색만으로는 중요도를 반영하기 어렵습니다. PageRank를 활용하면 "많이 참조되는 중요한 노드"를 상위로 끌어올릴 수 있습니다. 하이브리드 점수 = α × vector_similarity + (1-α) × pagerank_normalized. α=0.7 정도가 적당하며, 도메인에 따라 튜닝하세요.',
        code: {
          language: 'python',
          code: `# PageRank 기반 하이브리드 리랭킹
import numpy as np

def hybrid_search(query_vector, top_k=10, alpha=0.7):
    # 1. 벡터 검색 (상위 50개)
    vector_results = vector_index.search(query_vector, top_k=50)

    # 2. Neo4j에서 PageRank 가져오기
    with driver.session() as session:
        pageranks = {}
        for result in vector_results:
            node_id = result['id']
            pr = session.run("""
                MATCH (n) WHERE id(n) = $id
                RETURN n.pagerank AS pr
            """, id=node_id).single()['pr']
            pageranks[node_id] = pr or 0.0

        # PageRank 정규화 (0~1)
        pr_values = list(pageranks.values())
        pr_min, pr_max = min(pr_values), max(pr_values)
        pr_norm = {
            k: (v - pr_min) / (pr_max - pr_min) if pr_max > pr_min else 0.5
            for k, v in pageranks.items()
        }

    # 3. 하이브리드 점수 계산
    hybrid_scores = []
    for result in vector_results:
        node_id = result['id']
        vec_score = result['score']  # 이미 0~1 정규화됨
        pr_score = pr_norm[node_id]

        final_score = alpha * vec_score + (1 - alpha) * pr_score
        hybrid_scores.append({
            'id': node_id,
            'text': result['text'],
            'vector_score': vec_score,
            'pagerank': pr_score,
            'final_score': final_score
        })

    # 4. 재정렬 및 상위 k개 반환
    hybrid_scores.sort(key=lambda x: x['final_score'], reverse=True)
    return hybrid_scores[:top_k]

# 실행
results = hybrid_search(query_embedding, top_k=5, alpha=0.7)
for r in results:
    print(f"{r['text'][:50]}... (벡터:{r['vector_score']:.3f}, PR:{r['pagerank']:.3f}, 최종:{r['final_score']:.3f})")`
        },
        callout: {
          type: 'tip',
          text: 'α 튜닝 팁: 사실 정확도 중요 → α↑ (벡터 우선), 전문성 중요 → α↓ (PageRank 우선)'
        }
      },
      {
        id: '9-11',
        tag: 'practice',
        title: '커뮤니티 요약 Global Search — Microsoft GraphRAG 방식',
        script: 'Microsoft GraphRAG의 Global Search는 커뮤니티별 요약을 미리 만들어두고 검색합니다. Leiden으로 커뮤니티를 나누고, 각 커뮤니티의 노드들을 LLM으로 요약합니다. 사용자 질문이 들어오면 관련 커뮤니티 요약을 모아서 LLM에 전달합니다. 이 방식은 "전체 데이터셋에서 트렌드를 찾아라" 같은 광범위한 질문에 강합니다.',
        code: {
          language: 'python',
          code: `# 커뮤니티 요약 생성 및 Global Search
import openai

def generate_community_summaries():
    summaries = {}

    with driver.session() as session:
        # 커뮤니티별 노드 조회
        result = session.run("""
            MATCH (n:Equipment)
            WHERE n.community IS NOT NULL
            WITH n.community AS comm, collect(n.name) AS nodes
            RETURN comm, nodes
        """)

        for record in result:
            comm_id = record['comm']
            nodes = record['nodes']

            # LLM으로 요약 생성
            prompt = f"""
            다음은 동일 커뮤니티에 속한 장비들입니다:
            {', '.join(nodes)}

            이 커뮤니티의 특징을 3줄로 요약하세요.
            """

            response = openai.chat.completions.create(
                model="gpt-4o-mini",  # 요약은 저렴한 모델로
                messages=[{"role": "user", "content": prompt}]
            )

            summary = response.choices[0].message.content
            summaries[comm_id] = summary

            # Neo4j에 요약 저장 (선택)
            session.run("""
                MERGE (c:Community {id: $comm_id})
                SET c.summary = $summary
            """, comm_id=comm_id, summary=summary)

    return summaries

def global_search(query):
    # 모든 커뮤니티 요약 조회
    with driver.session() as session:
        result = session.run("""
            MATCH (c:Community)
            RETURN c.id AS id, c.summary AS summary
        """)

        all_summaries = "\\n\\n".join([
            f"[커뮤니티 {r['id']}]\\n{r['summary']}"
            for r in result
        ])

    # LLM에 전체 요약 + 질문 전달
    prompt = f"""
    다음은 데이터셋의 커뮤니티별 요약입니다:

    {all_summaries}

    질문: {query}
    """

    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content

# 실행
summaries = generate_community_summaries()
answer = global_search("전체 공정에서 가장 자주 발생하는 불량 패턴은?")`
        },
        callout: {
          type: 'key',
          text: 'Global Search = 커뮤니티 요약 기반. Local Search는 노드 직접 검색. 둘 다 필요합니다.'
        }
      },
      {
        id: '9-12',
        tag: 'discussion',
        title: '알고리즘 적용 전후 품질 비교',
        script: '그래프 알고리즘을 적용하기 전과 후의 RAG 품질을 측정해봅시다. Accuracy는 정답률, Latency는 응답 시간, Cost는 토큰 사용량입니다. PageRank 리랭킹은 정확도를 높이지만 지연은 약간 증가합니다. 커뮤니티 요약은 Global Search 품질을 크게 개선하지만, 요약 생성 비용이 추가됩니다.',
        table: {
          headers: ['지표', 'Baseline (벡터만)', '+ PageRank 리랭킹', '+ 커뮤니티 요약'],
          rows: [
            {
              cells: [
                { text: 'Accuracy (정답률)' },
                { text: '72%', status: 'warn' },
                { text: '81%', status: 'pass' },
                { text: '89% (Global)', status: 'pass', bold: true }
              ]
            },
            {
              cells: [
                { text: 'Latency (ms)' },
                { text: '120ms', status: 'pass' },
                { text: '180ms', status: 'warn' },
                { text: '200ms', status: 'warn' }
              ]
            },
            {
              cells: [
                { text: 'Cost (토큰/쿼리)' },
                { text: '800', status: 'pass' },
                { text: '900', status: 'warn' },
                { text: '1200 + 요약비용', status: 'fail' }
              ]
            },
            {
              cells: [
                { text: '추천 용도' },
                { text: '프로토타입' },
                { text: 'Local Search', status: 'pass', bold: true },
                { text: 'Global Search', status: 'pass', bold: true }
              ]
            }
          ]
        },
        callout: {
          type: 'key',
          text: '실무 권장: Local Search = PageRank 리랭킹, Global Search = 커뮤니티 요약. 둘 다 구현하세요.'
        }
      }
    ]
  },

  // Section 5: Neo4j GDS 심화 (30min) - 3 slides
  {
    sectionId: 'sec5',
    slides: [
      {
        id: '9-13',
        tag: 'practice',
        title: 'Graph Projection 생성 — Native vs Cypher',
        script: 'Neo4j GDS 알고리즘은 먼저 그래프를 메모리에 프로젝션해야 합니다. Native projection은 전체 그래프를 빠르게 로드하고, Cypher projection은 필터링을 적용합니다. 대용량 그래프에서는 Cypher projection으로 일부만 로드하는 게 효율적입니다. 프로젝션 이름은 알고리즘 실행 시 참조되며, 작업 후 삭제할 수 있습니다.',
        code: {
          language: 'cypher',
          code: `// 1. Native Projection (전체 그래프)
CALL gds.graph.project(
  'fullGraph',
  'Equipment',  // 모든 Equipment 노드
  'CONNECTED_TO'  // 모든 CONNECTED_TO 관계
);

// 2. Cypher Projection (필터링)
CALL gds.graph.project.cypher(
  'filteredGraph',
  'MATCH (n:Equipment) WHERE n.status = "active" RETURN id(n) AS id',
  'MATCH (a:Equipment)-[r:CONNECTED_TO]->(b:Equipment)
   WHERE a.status = "active" AND b.status = "active"
   RETURN id(a) AS source, id(b) AS target'
);

// 3. 프로젝션 정보 확인
CALL gds.graph.list()
YIELD graphName, nodeCount, relationshipCount, memoryUsage;

// 4. 프로젝션 삭제 (작업 완료 후)
CALL gds.graph.drop('fullGraph');`
        },
        callout: {
          type: 'warn',
          text: '대용량 그래프는 Cypher projection으로 필터링 필수. 전체 로드는 메모리 부족 위험.'
        }
      },
      {
        id: '9-14',
        tag: 'practice',
        title: '알고리즘 파이프라인 — Leiden → PageRank → Betweenness',
        script: '여러 알고리즘을 순차적으로 실행해서 종합 분석할 수 있습니다. mutate 모드를 쓰면 인메모리 그래프에만 결과를 저장해서 다음 알고리즘에서 활용합니다. 마지막에 write로 최종 결과를 데이터베이스에 저장합니다. 이 방식은 디스크 I/O를 줄여서 대용량 분석 성능을 크게 향상시킵니다.',
        code: {
          language: 'cypher',
          code: `// 1. 그래프 프로젝션
CALL gds.graph.project('pipeline', 'Equipment', 'CONNECTED_TO');

// 2. Leiden (커뮤니티 탐지, mutate)
CALL gds.leiden.mutate('pipeline', {
  mutateProperty: 'community'
});

// 3. PageRank (mutate)
CALL gds.pageRank.mutate('pipeline', {
  mutateProperty: 'pagerank'
});

// 4. Betweenness Centrality (mutate)
CALL gds.betweenness.mutate('pipeline', {
  mutateProperty: 'betweenness'
});

// 5. 모든 결과를 한 번에 write
CALL gds.graph.writeNodeProperties('pipeline',
  ['community', 'pagerank', 'betweenness']
);

// 6. 종합 조회
MATCH (n:Equipment)
RETURN n.name,
       n.community,
       n.pagerank,
       n.betweenness
ORDER BY n.pagerank DESC
LIMIT 20;

// 7. 프로젝션 삭제
CALL gds.graph.drop('pipeline');`
        },
        callout: {
          type: 'tip',
          text: 'mutate 모드 = 메모리만 사용. 파이프라인 완료 후 write로 일괄 저장하면 I/O 최소화.'
        }
      },
      {
        id: '9-15',
        tag: 'discussion',
        title: '시각화 + Part 9 핵심 정리',
        script: 'Neo4j Bloom과 Graph Data Science Playground로 알고리즘 결과를 시각화할 수 있습니다. Bloom은 비즈니스 사용자용 인터페이스, Playground는 데이터 과학자용 노트북입니다. Python에서는 networkx, pyvis 등으로 커스텀 시각화도 가능합니다. Part 9 핵심: 그래프 알고리즘으로 숨겨진 패턴(커뮤니티, 중심성, 경로)을 찾아 GraphRAG 품질을 높입니다.',
        visual: '왼쪽: 시각화 도구 4가지 (Neo4j Bloom, GDS Playground, Python networkx, pyvis). 오른쪽: Part 9 핵심 정리 (1. 커뮤니티 탐지, 2. 중심성, 3. 경로, 4. 알고리즘 파이프라인, 5. 품질 개선)',
        callout: {
          type: 'key',
          text: 'GraphRAG = 벡터 검색 + 그래프 알고리즘. 둘 다 써야 진정한 성능이 나옵니다.'
        }
      }
    ]
  }
];
