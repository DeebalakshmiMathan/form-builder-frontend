export default function Spinner({ className = 'h-6 w-6' }) {
  return <span className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`} role="status" aria-label="Loading" />;
}

export function PageLoader() {
  return (
    <div className="flex justify-center py-16 text-brand-600">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
