type NodeType = 'entity' | 'relation' | 'fail' | 'dim';

interface DiagramNode {
  type: NodeType;
  text: string;
  sub?: string;
}

interface DiagramRow {
  nodes: (DiagramNode | { type: 'arrow'; text: string })[];
}

interface FlowDiagramProps {
  rows: DiagramRow[];
  label?: string;
}

const nodeClasses: Record<NodeType, string> = {
  entity: 'bg-sky-100 text-sky-700 border-sky-200 rounded-[10px]',
  relation: 'bg-amber-50 text-amber-700 border-amber-200 rounded-[20px]',
  fail: 'bg-red-50 text-red-600 border-red-200 rounded-[10px]',
  dim: 'bg-slate-50 text-slate-400 border-slate-100 rounded-[10px]',
};

export function FlowDiagram({ rows, label }: FlowDiagramProps) {
  return (
    <div className="my-6 p-6 rounded-xl text-center bg-slate-50 ring-card">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="flex items-center justify-center flex-wrap gap-2 mb-3 last:mb-0">
          {row.nodes.map((node, nodeIdx) => {
            if (node.type === 'arrow') {
              return (
                <span key={nodeIdx} className="text-lg text-slate-400">
                  {node.text}
                </span>
              );
            }
            return (
              <div key={nodeIdx} className={`px-4 py-2 text-sm font-semibold whitespace-nowrap border ${nodeClasses[node.type]}`}>
                {node.text}
                {node.sub && (
                  <div className="text-xs font-normal mt-0.5 opacity-80">{node.sub}</div>
                )}
              </div>
            );
          })}
        </div>
      ))}
      {label && (
        <p className="mt-4 text-xs italic text-slate-400">{label}</p>
      )}
    </div>
  );
}
