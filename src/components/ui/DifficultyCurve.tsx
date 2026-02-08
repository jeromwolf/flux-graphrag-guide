'use client';

import { curriculumMeta } from '@/data/curriculum-meta';
import { useState } from 'react';

export default function DifficultyCurve() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const width = 800;
  const height = 300;
  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxDifficulty = 4;
  const points = curriculumMeta.map((part, index) => ({
    x: padding.left + (chartWidth / (curriculumMeta.length - 1)) * index,
    y: padding.top + chartHeight - (chartHeight / maxDifficulty) * part.difficulty,
    part: part.part,
    title: part.title,
    difficulty: part.difficulty,
    milestone: part.milestone,
  }));

  const pathD = points.reduce((acc, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = points[i - 1];
    const cx1 = prev.x + (point.x - prev.x) / 3;
    const cy1 = prev.y;
    const cx2 = prev.x + (2 * (point.x - prev.x)) / 3;
    const cy2 = point.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

  const totalHours = curriculumMeta.reduce((sum, part) => {
    const hours = parseFloat(part.duration.replace('시간', ''));
    return sum + hours;
  }, 0);

  const totalSlides = curriculumMeta.reduce((sum, part) => sum + part.totalSlides, 0);

  return (
    <div className="w-full p-8 rounded-2xl" style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
    }}>
      <h3 className="text-xl font-bold mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
        학습 난이도 곡선
      </h3>
      <p className="text-sm text-center mb-6" style={{ color: 'var(--text-secondary)' }}>
        7개 Part의 난이도 진행 과정
      </p>

      <div className="flex justify-center mb-6">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-3xl"
          style={{ maxHeight: '300px' }}
        >
          <defs>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: 'var(--accent-cyan)', stopOpacity: 0.6 }} />
              <stop offset="100%" style={{ stopColor: 'var(--accent-purple)', stopOpacity: 0.6 }} />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'var(--accent-cyan)', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: 'var(--accent-purple)', stopOpacity: 0.05 }} />
            </linearGradient>
          </defs>

          <path
            d={areaD}
            fill="url(#areaGradient)"
          />

          <path
            d={pathD}
            fill="none"
            stroke="url(#curveGradient)"
            strokeWidth="3"
          />

          {points.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r={hoveredIndex === i ? 8 : 6}
                fill="var(--accent-cyan)"
                stroke="var(--bg-card)"
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />

              <text
                x={point.x}
                y={height - padding.bottom + 20}
                textAnchor="middle"
                style={{ fill: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500 }}
              >
                Part {point.part}
              </text>

              <text
                x={point.x}
                y={height - padding.bottom + 35}
                textAnchor="middle"
                style={{ fill: 'var(--text-dim)', fontSize: '10px' }}
              >
                {'⭐'.repeat(point.difficulty)}
              </text>

              {hoveredIndex === i && (
                <g>
                  <rect
                    x={point.x - 120}
                    y={point.y - 60}
                    width="240"
                    height="50"
                    rx="6"
                    fill="var(--bg-secondary)"
                    stroke="var(--border)"
                  />
                  <text
                    x={point.x}
                    y={point.y - 40}
                    textAnchor="middle"
                    style={{ fill: 'var(--accent-cyan)', fontSize: '11px', fontWeight: 600 }}
                  >
                    {point.title}
                  </text>
                  <text
                    x={point.x}
                    y={point.y - 25}
                    textAnchor="middle"
                    style={{ fill: 'var(--text-secondary)', fontSize: '9px' }}
                  >
                    {point.milestone.slice(0, 40)}...
                  </text>
                </g>
              )}
            </g>
          ))}

          <text
            x={padding.left - 10}
            y={padding.top - 15}
            style={{ fill: 'var(--text-dim)', fontSize: '11px' }}
          >
            난이도
          </text>
        </svg>
      </div>

      <div className="flex justify-center gap-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
        <span>총 <strong style={{ color: 'var(--accent-cyan)' }}>{totalHours}시간</strong></span>
        <span className="opacity-50">·</span>
        <span><strong style={{ color: 'var(--accent-cyan)' }}>{totalSlides}</strong> 슬라이드</span>
        <span className="opacity-50">·</span>
        <span><strong style={{ color: 'var(--accent-cyan)' }}>{curriculumMeta.length}</strong> Milestones</span>
      </div>
    </div>
  );
}
