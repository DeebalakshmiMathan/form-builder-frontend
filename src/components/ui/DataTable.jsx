import { PageLoader } from './Spinner';

/**
 * columns: [{ key, header, render?(row), className? }]
 */
export default function DataTable({ columns, rows, loading, emptyText = 'No data found', rowKey = '_id' }) {
  if (loading) return <PageLoader />;
  if (!rows.length) return <p className="py-12 text-center text-sm text-slate-500">{emptyText}</p>;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>{columns.map((c) => <th key={c.key} className={`px-4 py-2 font-medium ${c.className || ''}`}>{c.header}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row[rowKey]} className="hover:bg-slate-50">
              {columns.map((c) => <td key={c.key} className={`px-4 py-2 ${c.className || ''}`}>{c.render ? c.render(row) : row[c.key] ?? '-'}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
