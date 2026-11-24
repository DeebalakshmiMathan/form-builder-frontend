import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Badge, Button, Card, ConfirmModal, DataTable, PageHeader, Pagination, SelectInput, TextInput } from '../components/ui';
import { deleteForm, fetchForms } from '../features/forms/formsSlice';
import useDebounce from '../hooks/useDebounce';
import { formatDate } from '../utils/format';

export default function FormsListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, pagination, status, error } = useSelector((s) => s.forms.list);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [copied, setCopied] = useState(null);
  const debouncedSearch = useDebounce(search);

  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter]);
  useEffect(() => {
    dispatch(fetchForms({ page, limit: 10, search: debouncedSearch || undefined, status: statusFilter || undefined }));
  }, [dispatch, page, debouncedSearch, statusFilter]);

  const copyLink = async (id) => {
    await navigator.clipboard.writeText(`${window.location.origin}/forms/${id}`);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const columns = [
    { key: 'name', header: 'Name', render: (f) => <span className="font-medium">{f.name}</span> },
    { key: 'status', header: 'Status', render: (f) => <Badge tone={f.status === 'published' ? 'green' : 'amber'}>{f.status}</Badge> },
    { key: 'fieldCount', header: 'Fields' },
    { key: 'updatedAt', header: 'Updated', render: (f) => formatDate(f.updatedAt) },
    {
      key: 'actions',
      header: '',
      render: (f) => (
        <div className="flex justify-end gap-1">
          <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/forms/${f._id}/edit`)}>Edit</Button>
          <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/forms/${f._id}/submissions`)}>Submissions</Button>
          {f.status === 'published' && <Button size="sm" variant="ghost" onClick={() => copyLink(f._id)}>{copied === f._id ? 'Copied!' : 'Copy link'}</Button>}
          <Button size="sm" variant="ghost" className="text-red-600" onClick={() => setToDelete(f)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Forms" subtitle="Create, publish and manage dynamic forms" actions={<Link to="/admin/forms/new"><Button>+ New form</Button></Link>} />
      <Card>
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="w-64"><TextInput placeholder="Search by name..." value={search} onChange={setSearch} /></div>
          <div className="w-40"><SelectInput placeholder="All statuses" value={statusFilter} onChange={setStatusFilter} options={['draft', 'published']} /></div>
        </div>
        <Alert type="error" className="mb-3">{error}</Alert>
        <DataTable columns={columns} rows={items} loading={status === 'loading' && !items.length} emptyText="No forms yet" />
        <Pagination {...pagination} onPageChange={setPage} />
      </Card>

      <ConfirmModal
        open={!!toDelete}
        message={`Delete "${toDelete?.name}" and all its submissions? This cannot be undone.`}
        onClose={() => setToDelete(null)}
        onConfirm={async () => { await dispatch(deleteForm(toDelete._id)); setToDelete(null); }}
      />
    </>
  );
}
