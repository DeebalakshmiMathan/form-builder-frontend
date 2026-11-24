const styles = {
  error: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-green-200 bg-green-50 text-green-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  info: 'border-blue-200 bg-blue-50 text-blue-700',
};

export default function Alert({ type = 'info', children, className = '' }) {
  if (!children || (Array.isArray(children) && !children.length)) return null;
  return <div role="alert" className={`rounded-md border px-3 py-2 text-sm ${styles[type]} ${className}`}>{children}</div>;
}
