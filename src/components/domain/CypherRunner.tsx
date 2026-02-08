'use client';

import React, { useState } from 'react';

export interface QueryResult {
  columns: string[];
  rows: string[][];
}

export interface CypherQuery {
  id: string;
  title: string;
  description: string;
  cypher: string;
  result: QueryResult;
  learningPoint?: string;
}

interface CypherRunnerProps {
  queries: CypherQuery[];
  activeQueryId?: string;
}

export function CypherRunner({ queries, activeQueryId }: CypherRunnerProps) {
  const [activeId, setActiveId] = useState(activeQueryId || queries[0]?.id);
  const [copied, setCopied] = useState(false);

  const activeQuery = queries.find((q) => q.id === activeId) || queries[0];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(activeQuery.cypher);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cypherKeywords = new Set(['MATCH', 'WHERE', 'RETURN', 'CREATE', 'MERGE', 'WITH', 'ORDER BY', 'LIMIT', 'AS', 'AND', 'OR', 'NOT']);

  const renderCypherTokens = (cypher: string) => {
    const elements: React.ReactNode[] = [];
    // Split by keywords, strings, node patterns, relationship patterns
    const tokenRegex = /(\b(?:MATCH|WHERE|RETURN|CREATE|MERGE|WITH|ORDER BY|LIMIT|AS|AND|OR|NOT)\b)|('(?:[^']*)')|(\(\w+:\w+\))|(\[\w+:\w+\])/g;
    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(cypher)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        elements.push(cypher.slice(lastIndex, match.index));
      }

      if (match[1]) {
        // Keyword
        elements.push(
          <span key={`kw-${match.index}`} style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>
            {match[1]}
          </span>
        );
      } else if (match[2]) {
        // String literal
        elements.push(
          <span key={`str-${match.index}`} style={{ color: 'var(--accent-yellow)' }}>
            {match[2]}
          </span>
        );
      } else if (match[3]) {
        // Node pattern (var:Label)
        const inner = match[3].slice(1, -1);
        const [varName, label] = inner.split(':');
        elements.push(
          <span key={`node-${match.index}`}>
            (<span style={{ color: 'var(--accent-cyan)' }}>{varName}</span>:
            <span style={{ color: 'var(--accent-orange)' }}>{label}</span>)
          </span>
        );
      } else if (match[4]) {
        // Relationship pattern [var:TYPE]
        const inner = match[4].slice(1, -1);
        const [varName, relType] = inner.split(':');
        elements.push(
          <span key={`rel-${match.index}`}>
            [<span style={{ color: 'var(--accent-cyan)' }}>{varName}</span>:
            <span style={{ color: 'var(--accent-orange)' }}>{relType}</span>]
          </span>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < cypher.length) {
      elements.push(cypher.slice(lastIndex));
    }

    return elements;
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}
    >
      <div className="flex" style={{ minHeight: '500px' }}>
        {/* Sidebar */}
        <div
          className="w-64 border-r p-4 space-y-2"
          style={{
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="text-xs font-semibold mb-3" style={{ color: 'var(--text-dim)' }}>
            QUERIES
          </div>
          {queries.map((query) => {
            const isActive = query.id === activeId;
            return (
              <button
                key={query.id}
                onClick={() => setActiveId(query.id)}
                className="w-full text-left p-3 rounded-lg transition-all text-sm"
                style={{
                  background: isActive ? 'rgba(14,165,233,0.1)' : 'transparent',
                  border: isActive ? '1px solid rgba(14,165,233,0.3)' : '1px solid transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                }}
              >
                <div className="font-semibold">{query.title}</div>
                <div className="text-xs mt-1 opacity-70">{query.description}</div>
              </button>
            );
          })}
        </div>

        {/* Main area */}
        <div className="flex-1 flex flex-col">
          {/* Query code */}
          <div
            className="p-6 border-b"
            style={{
              background: 'var(--bg-code)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {activeQuery.title}
              </div>
              <button
                onClick={handleCopy}
                className="px-3 py-1 text-xs rounded transition-all"
                style={{
                  background: copied ? 'rgba(14,165,233,0.15)' : 'rgba(0,0,0,0.02)',
                  border: copied ? '1px solid rgba(14,165,233,0.3)' : '1px solid var(--border)',
                  color: copied ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                }}
              >
                {copied ? '✓ Copied' : 'Copy Cypher'}
              </button>
            </div>
            <pre
              className="text-sm leading-relaxed overflow-x-auto"
              style={{
                fontFamily: 'var(--font-code)',
                color: 'var(--text-primary)',
              }}
            >
              <code>{renderCypherTokens(activeQuery.cypher)}</code>
            </pre>
          </div>

          {/* Results */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="text-xs font-semibold mb-3" style={{ color: 'var(--text-dim)' }}>
              RESULTS ({activeQuery.result.rows.length} rows)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr>
                    {activeQuery.result.columns.map((col, idx) => (
                      <th
                        key={idx}
                        className="text-left px-4 py-2 font-semibold"
                        style={{
                          background: 'rgba(14,165,233,0.08)',
                          borderBottom: '2px solid var(--accent-cyan)',
                          color: 'var(--accent-cyan)',
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeQuery.result.rows.map((row, rowIdx) => (
                    <tr
                      key={rowIdx}
                      style={{
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      {row.map((cell, cellIdx) => (
                        <td
                          key={cellIdx}
                          className="px-4 py-2"
                          style={{
                            color: 'var(--text-primary)',
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Learning point */}
            {activeQuery.learningPoint && (
              <div
                className="mt-6 p-4 rounded-lg text-sm"
                style={{
                  background: 'rgba(234,179,8,0.08)',
                  border: '1px solid rgba(234,179,8,0.2)',
                  color: 'var(--accent-yellow)',
                }}
              >
                <div className="font-semibold mb-2">💡 Learning Point</div>
                <div style={{ color: 'var(--text-primary)' }}>{activeQuery.learningPoint}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
