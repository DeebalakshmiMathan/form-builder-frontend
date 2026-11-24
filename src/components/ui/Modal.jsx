import { useEffect } from 'react';
import Button from './Button';

export default function Modal({ open, title, onClose, children, footer, size = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <div className={`max-h-[90vh] w-full ${size} overflow-y-auto rounded-lg bg-white shadow-xl`} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <header className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700" aria-label="Close">✕</button>
        </header>
        <div className="p-4">{children}</div>
        {footer && <footer className="flex justify-end gap-2 border-t px-4 py-3">{footer}</footer>}
      </div>
    </div>
  );
}

export function ConfirmModal({ open, title = 'Are you sure?', message, confirmLabel = 'Delete', loading, onConfirm, onClose }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      size="max-w-sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="danger" loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }
    >
      <p className="text-sm text-slate-600">{message}</p>
    </Modal>
  );
}
