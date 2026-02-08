interface TableRow {
  cells: {
    text: string;
    status?: 'pass' | 'fail' | 'warn' | 'normal';
    bold?: boolean;
  }[];
}

interface ComparisonTableProps {
  headers: string[];
  rows: TableRow[];
}

const statusColors = {
  pass: 'var(--accent-cyan)',
  fail: 'var(--accent-red)',
  warn: 'var(--accent-yellow)',
  normal: 'var(--text-secondary)',
};

export function ComparisonTable({ headers, rows }: ComparisonTableProps) {
  return (
    <div className="my-6 rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th key={i} className="px-4 py-3 text-left text-xs font-semibold tracking-wide" style={{
                background: 'rgba(14,165,233,0.08)',
                color: 'var(--accent-cyan)',
                borderBottom: '1px solid var(--border)',
              }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.cells.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className="px-4 py-3 text-sm align-top"
                  style={{
                    borderBottom: rowIdx < rows.length - 1 ? '1px solid rgba(0,0,0,0.02)' : 'none',
                    color: statusColors[cell.status || 'normal'],
                    fontWeight: cell.bold || cellIdx === 0 ? 500 : 400,
                  }}
                >
                  {cell.text}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
