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

const statusClasses = {
  pass: 'text-sky-600',
  fail: 'text-red-500',
  warn: 'text-amber-600',
  normal: 'text-slate-600',
};

export function ComparisonTable({ headers, rows }: ComparisonTableProps) {
  return (
    <div className="my-6 rounded-xl overflow-hidden ring-card">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th key={i} className="px-4 py-3 text-left text-xs font-semibold tracking-wide bg-sky-50 text-sky-600 border-b border-slate-200">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} className="border-b border-slate-50 last:border-b-0">
              {row.cells.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className={`px-4 py-3 text-sm align-top ${statusClasses[cell.status || 'normal']} ${cell.bold || cellIdx === 0 ? 'font-medium' : ''}`}
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
