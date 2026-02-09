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
          <span key={`kw-${match.index}`} className="text-violet-500 font-semibold">
            {match[1]}
          </span>
        );
      } else if (match[2]) {
        // String literal
        elements.push(
          <span key={`str-${match.index}`} className="text-yellow-500">
            {match[2]}
          </span>
        );
      } else if (match[3]) {
        // Node pattern (var:Label)
        const inner = match[3].slice(1, -1);
        const [varName, label] = inner.split(':');
        elements.push(
          <span key={`node-${match.index}`}>
            (<span className="text-sky-600">{varName}</span>:
            <span className="text-amber-600">{label}</span>)
          </span>
        );
      } else if (match[4]) {
        // Relationship pattern [var:TYPE]
        const inner = match[4].slice(1, -1);
        const [varName, relType] = inner.split(':');
        elements.push(
          <span key={`rel-${match.index}`}>
            [<span className="text-sky-600">{varName}</span>:
            <span className="text-amber-600">{relType}</span>]
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
    <div className="rounded-xl overflow-hidden bg-white ring-card"
    >
      <div className="flex" style={{ minHeight: '500px' }}>
        {/* Sidebar */}
        <div className="w-64 border-r p-4 space-y-2 bg-slate-50 border-slate-200">
          <div className="text-xs font-semibold mb-3 text-slate-500">
            QUERIES
          </div>
          {queries.map((query) => {
            const isActive = query.id === activeId;
            return (
              <button
                key={query.id}
                onClick={() => setActiveId(query.id)}
                className={`w-full text-left p-3 rounded-lg transition-all text-sm ${
                  isActive
                    ? 'bg-sky-50 border border-sky-200 text-sky-600'
                    : 'bg-transparent border border-transparent text-slate-700'
                }`}
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
          <div className="p-6 border-b bg-slate-100 border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-slate-900">
                {activeQuery.title}
              </div>
              <button
                onClick={handleCopy}
                className={`px-3 py-1 text-xs rounded transition-all ${
                  copied
                    ? 'bg-sky-50 border border-sky-200 text-sky-600'
                    : 'bg-slate-50 border border-slate-200 text-slate-700'
                }`}
              >
                {copied ? '✓ Copied' : 'Copy Cypher'}
              </button>
            </div>
            <pre className="text-sm leading-relaxed overflow-x-auto font-mono text-slate-900">
              <code>{renderCypherTokens(activeQuery.cypher)}</code>
            </pre>
          </div>

          {/* Results */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="text-xs font-semibold mb-3 text-slate-500">
              RESULTS ({activeQuery.result.rows.length} rows)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr>
                    {activeQuery.result.columns.map((col, idx) => (
                      <th
                        key={idx}
                        className="text-left px-4 py-2 font-semibold bg-sky-50 border-b-2 border-sky-600 text-sky-600"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeQuery.result.rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="border-b border-slate-200">
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="px-4 py-2 text-slate-900">
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
              <div className="mt-6 p-4 rounded-lg text-sm bg-yellow-50 border border-yellow-200 text-yellow-600">
                <div className="font-semibold mb-2">💡 Learning Point</div>
                <div className="text-slate-900">{activeQuery.learningPoint}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
