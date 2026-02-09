import { Callout } from '@/components/ui/Callout';

export default function RagasEvaluationGuide() {
  return (
    <div className="border-t border-slate-200 p-6 space-y-6 bg-slate-50">
      <Callout type="key">
        <strong>핵심 원칙:</strong> 평가 없는 RAG는 블랙박스입니다.
        <br />
        RAGAS 메트릭으로 검색과 생성의 품질을 정량적으로 측정하세요.
      </Callout>

      <section>
        <h4 className="text-xl font-bold mb-4 text-sky-600">
          RAGAS 메트릭 이해
        </h4>
        <div className="space-y-4">
          {[
            {
              metric: 'Faithfulness',
              description: '생성된 답변이 컨텍스트에 기반하는 정도',
              detail: 'LLM이 컨텍스트에 없는 정보를 "환각"으로 생성하지 않는지 측정합니다.',
              color: 'var(--accent-cyan)',
            },
            {
              metric: 'Answer Relevancy',
              description: '답변이 질문에 적합한 정도',
              detail: '질문의 의도에 맞는 답변을 생성하는지 측정합니다. 관련 없는 정보가 포함되면 점수가 낮아집니다.',
              color: 'var(--accent-yellow)',
            },
            {
              metric: 'Context Precision',
              description: '검색된 컨텍스트의 정밀도',
              detail: '검색된 컨텍스트 중 실제로 답변에 도움이 되는 비율입니다. 불필요한 컨텍스트가 많으면 점수가 낮아집니다.',
              color: 'var(--accent-green, #4ade80)',
            },
            {
              metric: 'Context Recall',
              description: '필요한 정보를 얼마나 검색했는가',
              detail: '정답을 도출하는 데 필요한 모든 정보를 검색했는지 측정합니다. 누락된 정보가 있으면 점수가 낮아집니다.',
              color: 'var(--accent-red)',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-white ring-card border-l-[3px]"
              style={{ borderLeftColor: item.color }}
            >
              <div className="font-bold mb-1" style={{ color: item.color }}>
                {item.metric}
              </div>
              <div className="text-sm font-medium mb-1">{item.description}</div>
              <div className="text-xs text-slate-500">
                {item.detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h4 className="text-xl font-bold mb-4 text-sky-600">
          Multi-hop 질문 생성
        </h4>
        <p className="text-sm mb-4 text-slate-500">
          GraphRAG 평가에서는 hop 수에 따른 질문 난이도를 체계적으로 구성해야 합니다.
        </p>
        <div className="space-y-3">
          {[
            {
              hop: '1-hop',
              question: '접착 박리 결함의 원인 공정은?',
              path: 'Defect → Process',
              difficulty: '쉬움',
              diffColor: 'var(--accent-green, #4ade80)',
            },
            {
              hop: '2-hop',
              question: '접착 박리를 유발한 공정에서 사용하는 설비는?',
              path: 'Defect → Process → Equipment',
              difficulty: '보통',
              diffColor: 'var(--accent-yellow)',
            },
            {
              hop: '3-hop',
              question: 'HP-01 설비의 열압착 공정 불량으로 인한 검사 실패 항목은?',
              path: 'Equipment → Process → Defect → Inspection',
              difficulty: '어려움',
              diffColor: 'var(--accent-red)',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-white ring-card"
            >
              <div className="flex items-center gap-3 mb-2">
                <code className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-sky-50 text-sky-600">
                  {item.hop}
                </code>
                <span
                  className="text-xs px-2 py-0.5 rounded bg-slate-50"
                  style={{ color: item.diffColor }}
                >
                  {item.difficulty}
                </span>
              </div>
              <div className="text-sm font-medium mb-1">{item.question}</div>
              <div className="text-xs font-mono text-slate-400">
                경로: {item.path}
              </div>
            </div>
          ))}
        </div>
        <Callout type="tip">
          <strong>팁:</strong> 평가 데이터셋은 1-hop 40%, 2-hop 40%, 3-hop 20% 비율로 구성하는 것이 좋습니다.
          실제 사용자 질문의 분포를 반영하세요.
        </Callout>
      </section>

      <section>
        <h4 className="text-xl font-bold mb-4 text-sky-600">
          Common Knowledge 필터링
        </h4>
        <p className="text-sm mb-4 text-slate-500">
          그래프에서 직접 답할 수 있는 질문과 LLM 일반 지식으로 답하는 질문을 구분해야 합니다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-sky-50 border border-sky-200">
            <div className="font-semibold mb-2 text-sky-600">
              그래프 기반 질문 (유효)
            </div>
            <ul className="text-sm space-y-2 text-slate-500">
              <li>- &quot;PRC-001 공정의 불량률은?&quot;</li>
              <li>- &quot;EQP-HP01에서 발생한 결함 목록&quot;</li>
              <li>- &quot;최근 검사 실패 이력&quot;</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="font-semibold mb-2 text-red-500">
              일반 지식 질문 (필터링 대상)
            </div>
            <ul className="text-sm space-y-2 text-slate-500">
              <li>- &quot;열압착이란 무엇인가?&quot;</li>
              <li>- &quot;ISO 9001 인증 절차&quot;</li>
              <li>- &quot;품질 관리의 일반 원칙&quot;</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 text-sm space-y-2 text-slate-500">
          <p><strong className="text-slate-900">필터링 기준:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>질문에 특정 ID, 코드, 고유명사가 포함되면 그래프 기반 질문</li>
            <li>일반적인 정의, 개념 설명 요청은 Common Knowledge</li>
            <li>LLM에게 컨텍스트 없이 동일 질문을 던져 답변 가능하면 필터링 대상</li>
          </ul>
        </div>
      </section>

      <section>
        <h4 className="text-xl font-bold mb-4 text-sky-600">
          평가 결과 해석과 개선
        </h4>
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm"
            style={{ borderCollapse: 'separate', borderSpacing: 0 }}
          >
            <thead>
              <tr>
                {['메트릭', '목표치', '미달 시 개선 전략'].map((header) => (
                  <th
                    key={header}
                    className="text-left px-4 py-3 font-semibold bg-sky-50 border-b-2 border-b-sky-600 text-sky-600"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  metric: 'Faithfulness',
                  target: '>= 0.8',
                  strategy: '컨텍스트 품질 개선 - 검색 결과에 정확한 근거 포함 확인',
                },
                {
                  metric: 'Answer Relevancy',
                  target: '>= 0.8',
                  strategy: '프롬프트 개선 - 답변 형식과 범위를 명확히 지시',
                },
                {
                  metric: 'Context Precision',
                  target: '>= 0.7',
                  strategy: '검색 전략 개선 - 불필요한 노드/관계 필터링 강화',
                },
                {
                  metric: 'Context Recall',
                  target: '>= 0.7',
                  strategy: '인덱싱 개선 - 누락된 관계 추가, 검색 범위 확대',
                },
              ].map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-200"
                >
                  <td className="px-4 py-3 font-bold text-sky-600">
                    {row.metric}
                  </td>
                  <td className="px-4 py-3">
                    <code className="px-2 py-0.5 rounded text-xs font-mono bg-sky-50 text-sky-600">
                      {row.target}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {row.strategy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout type="warn">
        <strong>주의:</strong> RAGAS 점수가 높아도 실제 사용자 만족도와 다를 수 있습니다.
        정량 평가와 함께 반드시 정성 평가(사용자 피드백)도 병행하세요.
      </Callout>
    </div>
  );
}
