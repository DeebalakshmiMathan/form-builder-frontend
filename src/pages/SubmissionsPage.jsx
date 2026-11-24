import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Card, ConfirmModal, DataTable, Modal, PageHeader, PageLoader, Pagination } from '../components/ui';
import { clearSelected, deleteSubmission, fetchSubmission, fetchSubmissions } from '../features/submissions/submissionsSlice';
import { loadForm } from '../features/builder/builderSlice';
import { formatDate, formatValue } from '../utils/format';

const MAX_COLUMNS = 4;

export default function SubmissionsPage() {
  const { id: formId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const form = useSelector((s) => s.builder.form);
  const { items, pagination, status, error } = useSelector((s) => s.submissions.list);
  const selected = useSelector((s) => s.submissions.selected);
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => { dispatch(loadForm(formId)); }, [dispatch, formId]);
  useEffect(() => { dispatch(fetchSubmissions({ formId, page, limit: 10 })); }, [dispatch, formId, page]);

  const fields = form._id === formId ? form.fields : [];

  // Columns are derived from the form definition - nothing hard-coded per form
  const columns = useMemo(
    () => [
      ...fields.slice(0, MAX_COLUMNS).map((f) => ({ key: f.key, header: f.label, render: (r) => formatValue(r.data?.[f.key]) })),
      { key: 'createdAt', header: 'Submitted', render: (r) => formatDate(r.createdAt) },
      {
        key: 'actions',
        header: '',
        render: (r) => (
          <div className="flex justify-end gap-1">
            <Button size="sm" variant="ghost" onClick={() => dispatch(fetchSubmission({ formId, id: r._id }))}>View</Button>
            <Button size="sm" variant="ghost" className="text-red-600" onClick={() => setToDelete(r)}>Delete</Button>
          </div>
        ),
      },
    ],
    [fields, dispatch, formId]
  );

  const confirmDelete = async () => {
    await dispatch(deleteSubmission({ formId, id: toDelete._id }));
    setToDelete(null);
    dispatch(fetchSubmissions({ formId, page, limit: 10 })); // refresh counts / page
  };

  return (
    <>
      <PageHeader title={`Submissions${form.name ? ` · ${form.name}` : ''}`} actions={<Button variant="secondary" onClick={() => navigate('/admin')}>Back</Button>} />
      <Card>
        <Alert type="error" className="mb-3">{error}</Alert>
        <DataTable columns={columns} rows={items} loading={status === 'loading' && !items.length} emptyText="No submissions yet" />
        <Pagination {...pagination} onPageChange={setPage} />
      </Card>

      <Modal open={selected.status !== 'idle'} title="Submission details" onClose={() => dispatch(clearSelected())}>
        {selected.status === 'loading' && <PageLoader />}
        <Alert type="error">{selected.error}</Alert>
        {selected.data && (
          <dl className="space-y-3 text-sm">
            {fields.map((f) => (
              <div key={f.key}>
                <dt className="text-xs font-medium uppercase text-slate-500">{f.label}</dt>
                <dd className="whitespace-pre-wrap">{formatValue(selected.data.data?.[f.key])}</dd>
              </div>
            ))}
            <div className="border-t pt-3 text-xs text-slate-500">Submitted {formatDate(selected.data.createdAt)} · IP {selected.data.meta?.ip || '-'}</div>
          </dl>
        )}
      </Modal>

      <ConfirmModal open={!!toDelete} message="Delete this submission permanently?" onClose={() => setToDelete(null)} onConfirm={confirmDelete} />
    </>
  );
}
