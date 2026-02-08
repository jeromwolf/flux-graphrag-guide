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

const nodeStyles: Record<NodeType, { bg: string; color: string; border: string; radius: string }> = {
  entity: { bg: 'rgba(14,165,233,0.15)', color: 'var(--accent-cyan)', border: 'rgba(14,165,233,0.3)', radius: '10px' },
  relation: { bg: 'rgba(234,179,8,0.12)', color: 'var(--accent-yellow)', border: 'rgba(234,179,8,0.3)', radius: '20px' },
  fail: { bg: 'rgba(239,68,68,0.12)', color: 'var(--accent-red)', border: 'rgba(239,68,68,0.3)', radius: '10px' },
  dim: { bg: 'rgba(0,0,0,0.02)', color: 'var(--text-dim)', border: 'rgba(0,0,0,0.04)', radius: '10px' },
};

export function FlowDiagram({ rows, label }: FlowDiagramProps) {
  return (
    <div className="my-6 p-6 rounded-xl text-center" style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
    }}>
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="flex items-center justify-center flex-wrap gap-2 mb-3 last:mb-0">
          {row.nodes.map((node, nodeIdx) => {
            if (node.type === 'arrow') {
              return (
                <span key={nodeIdx} className="text-lg" style={{ color: 'var(--text-dim)' }}>
                  {node.text}
                </span>
              );
            }
            const style = nodeStyles[node.type];
            return (
              <div key={nodeIdx} className="px-4 py-2 text-sm font-semibold whitespace-nowrap" style={{
                background: style.bg,
                color: style.color,
                border: `1px solid ${style.border}`,
                borderRadius: style.radius,
              }}>
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
        <p className="mt-4 text-xs italic" style={{ color: 'var(--text-dim)' }}>{label}</p>
      )}
    </div>
  );
}
