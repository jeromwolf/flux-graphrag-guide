import { Callout } from '@/components/ui/Callout';

export default function GraphragDecisionGuide() {
  return (
    <div className="border-t border-slate-200 p-6 space-y-6 bg-slate-50">
      <Callout type="key">
        <strong>핵심 원칙:</strong> "1-hop 관계로 해결되면 벡터 검색으로 충분합니다."
        <br />
        GraphRAG는 Multi-hop 추론이 필요할 때만 진가를 발휘합니다.
      </Callout>

      <section>
        <h4 className="text-xl font-bold mb-4 text-sky-600">
          도입 결정 5단계 프로세스
        </h4>
        <div className="space-y-4">
          {[
            {
              step: '1',
              title: 'Multi-hop 필요성 확인',
              description:
                '질문이 "A → B → C" 형태의 추론을 요구하는가? 예: "부품 X를 사용하는 공정에서 발생한 불량의 원인은?"',
            },
            {
              step: '2',
              title: '데이터 구조화 가능성',
              description:
                '엔티티와 관계를 명확히 정의할 수 있는가? 비정형 텍스트 자체가 답이라면 벡터 검색이 적합.',
            },
            {
              step: '3',
              title: '온톨로지 설계 리소스',
              description:
                '도메인 전문가와 협업해 온톨로지를 설계할 수 있는가? 최소 2주~1개월 소요.',
            },
            {
              step: '4',
              title: '유지보수 체계',
              description:
                '그래프 스키마 변경, 노드/관계 업데이트를 지속적으로 관리할 수 있는가?',
            },
            {
              step: '5',
              title: 'ROI 계산',
              description:
                '복잡한 질문에 대한 정확도 향상이 초기 구축 비용 + 운영 비용을 상쇄하는가?',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex gap-4 p-4 rounded-lg bg-white ring-card"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 bg-sky-600 text-white"
              >
                {item.step}
              </div>
              <div>
                <div className="font-semibold mb-1">{item.title}</div>
                <div className="text-sm text-slate-500">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h4 className="text-xl font-bold mb-4 text-sky-600">
          사용 vs 미사용 판단 매트릭스
        </h4>
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm"
            style={{ borderCollapse: 'separate', borderSpacing: 0 }}
          >
            <thead>
              <tr>
                <th className="text-left px-4 py-3 font-semibold bg-sky-50 border-b-2 border-b-sky-600 text-sky-600">
                  상황
                </th>
                <th className="text-left px-4 py-3 font-semibold bg-sky-50 border-b-2 border-b-sky-600 text-sky-600">
                  GraphRAG 필요
                </th>
                <th className="text-left px-4 py-3 font-semibold bg-red-50 border-b-2 border-b-red-500 text-red-500">
                  벡터 검색 충분
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  situation: '질문 유형',
                  graphrag: 'Multi-hop 추론 (A→B→C)',
                  vector: '단일 문서 검색',
                },
                {
                  situation: '관계 복잡도',
                  graphrag: '엔티티 간 관계가 핵심',
                  vector: '문서 내용 자체가 답',
                },
                {
                  situation: '데이터 구조',
                  graphrag: '구조화 가능한 도메인',
                  vector: '비정형 텍스트 중심',
                },
                {
                  situation: '정확도 요구',
                  graphrag: '높은 정확도 필수',
                  vector: '적당한 정확도면 충분',
                },
                {
                  situation: '초기 비용',
                  graphrag: '온톨로지 설계 가능',
                  vector: '빠른 프로토타입 필요',
                },
              ].map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-200"
                >
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {row.situation}
                  </td>
                  <td className="px-4 py-3 text-sky-600">
                    {row.graphrag}
                  </td>
                  <td className="px-4 py-3 text-red-500">
                    {row.vector}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h4 className="text-xl font-bold mb-4 text-sky-600">
          Quick Assessment 체크리스트
        </h4>
        <div className="p-4 rounded-lg space-y-2 text-sm bg-white ring-card">
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <label>사용자 질문이 2단계 이상의 관계 탐색을 요구한다</label>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <label>엔티티와 관계를 명확히 정의할 수 있다</label>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <label>도메인 전문가의 협조를 받을 수 있다</label>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <label>초기 온톨로지 설계에 2주 이상 투자할 수 있다</label>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <label>그래프 스키마를 지속적으로 업데이트할 수 있다</label>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <label>Neo4j 운영 경험이 있거나 학습할 의지가 있다</label>
          </div>
        </div>
        <Callout type="tip">
          <strong>결과 해석:</strong> 4개 이상 체크 시 GraphRAG 도입 고려, 3개 이하면 벡터
          검색으로 시작하고 필요 시 점진적 전환을 권장합니다.
        </Callout>
      </section>

      <section>
        <h4 className="text-xl font-bold mb-4 text-sky-600">
          GraphRAG가 필요 없는 케이스
        </h4>
        <div className="space-y-3">
          {[
            {
              icon: '❌',
              title: 'FAQ 스타일 질문',
              description: '단순 정보 검색 (예: "회사 위치는?" "제품 가격은?")',
            },
            {
              icon: '❌',
              title: '문서 요약',
              description: '긴 텍스트를 요약하는 작업 (LLM + 벡터 검색으로 충분)',
            },
            {
              icon: '❌',
              title: '엔티티 관계가 없는 데이터',
              description: '순수 텍스트 기반 Q&A (블로그, 매뉴얼)',
            },
            {
              icon: '❌',
              title: '프로토타입 단계',
              description: '빠른 검증이 필요한 초기 PoC (벡터 검색으로 시작)',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex gap-3 p-3 rounded-lg bg-red-50 border border-red-200"
            >
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="font-semibold text-red-500">
                  {item.title}
                </div>
                <div className="text-sm text-slate-500">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Callout type="warn">
        <strong>주의:</strong> GraphRAG는 은총알이 아닙니다. 벡터 검색으로 해결되는
        문제에 과도한 엔지니어링을 투입하지 마세요. 1-hop으로 충분한지 먼저 검증하세요.
      </Callout>
    </div>
  );
}
