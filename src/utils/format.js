export const formatDate = (d) => (d ? new Date(d).toLocaleString() : '-');
export const formatValue = (v) => (Array.isArray(v) ? v.join(', ') : typeof v === 'boolean' ? (v ? 'Yes' : 'No') : v ?? '-');
