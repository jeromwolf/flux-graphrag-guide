'use client';

import { useState } from 'react';

export interface GraphNode {
  id: string;
  label: string;
  type: 'Process' | 'Equipment' | 'Defect' | 'Inspection' | 'Component' | 'Material' | 'Operator';
  x: number;
  y: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
}

interface GraphViewerProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  highlightPath?: string[];
  width?: number;
  height?: number;
}

const nodeColors: Record<GraphNode['type'], string> = {
  Process: '#0ea5e9',
  Equipment: '#3b82f6',
  Defect: '#ef4444',
  Inspection: '#8b5cf6',
  Component: '#f59e0b',
  Material: '#7dc4a5',
  Operator: '#ca8a04',
};

const nodeIcons: Record<GraphNode['type'], string> = {
  Process: '⚙️',
  Equipment: '🔧',
  Defect: '⚠️',
  Inspection: '🔍',
  Component: '📦',
  Material: '🧱',
  Operator: '👷',
};

export function GraphViewer({
  nodes,
  edges,
  highlightPath = [],
  width = 800,
  height = 600,
}: GraphViewerProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const isHighlighted = (nodeId: string) => highlightPath.length === 0 || highlightPath.includes(nodeId);
  const isEdgeHighlighted = (edge: GraphEdge) =>
    highlightPath.length === 0 ||
    (highlightPath.includes(edge.source) && highlightPath.includes(edge.target));

  return (
    <div className="rounded-xl overflow-hidden bg-white ring-card"
    >
      <svg
        role="img"
        aria-label="그래프 시각화"
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: 'block' }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3, 0 6"
              fill="var(--text-dim)"
              style={{ transition: 'fill 0.3s' }}
            />
          </marker>
          <marker
            id="arrowhead-highlight"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3, 0 6"
              fill="var(--accent-cyan)"
              style={{ transition: 'fill 0.3s' }}
            />
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {edges.map((edge, idx) => {
          const sourceNode = nodes.find((n) => n.id === edge.source);
          const targetNode = nodes.find((n) => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;

          const highlighted = isEdgeHighlighted(edge);
          const opacity = highlighted ? 1 : 0.2;

          return (
            <g key={idx} style={{ transition: 'opacity 0.3s' }} opacity={opacity}>
              <line
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke={highlighted ? 'var(--accent-cyan)' : 'var(--text-dim)'}
                strokeWidth={highlighted ? 2 : 1}
                markerEnd={highlighted ? 'url(#arrowhead-highlight)' : 'url(#arrowhead)'}
                style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
              />
              {edge.label && (
                <text
                  x={(sourceNode.x + targetNode.x) / 2}
                  y={(sourceNode.y + targetNode.y) / 2 - 5}
                  textAnchor="middle"
                  className="fill-slate-500"
                  fontSize="11"
                  fontFamily="var(--font-body)"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const highlighted = isHighlighted(node.id);
          const hovered = hoveredNode === node.id;
          const opacity = highlighted ? 1 : 0.3;

          return (
            <g
              key={node.id}
              style={{ transition: 'opacity 0.3s, transform 0.2s', cursor: 'pointer' }}
              opacity={opacity}
              transform={hovered ? `translate(${node.x}, ${node.y}) scale(1.05)` : `translate(${node.x}, ${node.y})`}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              filter={highlighted && hovered ? 'url(#glow)' : undefined}
            >
              <rect
                x={-60}
                y={-25}
                width={120}
                height={50}
                rx={8}
                fill={nodeColors[node.type]}
                fillOpacity={hovered ? 0.25 : 0.15}
                stroke={nodeColors[node.type]}
                strokeWidth={hovered ? 2 : 1.5}
                style={{ transition: 'fill-opacity 0.2s, stroke-width 0.2s' }}
              />
              <text
                y={-5}
                textAnchor="middle"
                fontSize="18"
              >
                {nodeIcons[node.type]}
              </text>
              <text
                y={12}
                textAnchor="middle"
                className="fill-slate-900"
                fontSize="12"
                fontWeight="500"
                fontFamily="var(--font-body)"
              >
                {node.label}
              </text>

              {/* Tooltip */}
              {hovered && (
                <g>
                  <rect
                    x={-70}
                    y={35}
                    width={140}
                    height={40}
                    rx={6}
                    fill="var(--bg-card)"
                    stroke={nodeColors[node.type]}
                    strokeWidth={1}
                  />
                  <text
                    y={50}
                    textAnchor="middle"
                    className="fill-slate-500"
                    fontSize="10"
                    fontFamily="var(--font-body)"
                  >
                    {node.type}
                  </text>
                  <text
                    y={65}
                    textAnchor="middle"
                    fill={nodeColors[node.type]}
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="var(--font-body)"
                  >
                    {node.id}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
