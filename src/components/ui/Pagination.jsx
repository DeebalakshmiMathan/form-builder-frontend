import Button from './Button';

export default function Pagination({ page, totalPages, total, limit, onPageChange }) {
  if (!total) return null;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-600">
      <span>{from}-{to} of {total}</span>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</Button>
        <span>Page {page} / {totalPages}</span>
        <Button size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</Button>
      </div>
    </div>
  );
}
