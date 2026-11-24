import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Card, FieldWrapper, PageHeader, PageLoader, SelectInput, TextArea, TextInput } from '../components/ui';
import FieldList from '../components/builder/FieldList';
import DynamicForm from '../components/form/DynamicForm';
import { FIELD_TYPES } from '../constants/fieldTypes';
import { addField, applyTemplate, loadForm, resetBuilder, saveForm, setMeta } from '../features/builder/builderSlice';
import { checkBuilder, toPayload } from '../utils/builderUtils';

export default function FormBuilderPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { form, load, save, dirty } = useSelector((s) => s.builder);
  const [newType, setNewType] = useState('text');
  const [showIssues, setShowIssues] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (id) dispatch(loadForm(id));
    else dispatch(resetBuilder());
    return () => { dispatch(resetBuilder()); };
  }, [id, dispatch]);

  const issues = useMemo(() => checkBuilder(form), [form]);
  const previewFields = useMemo(() => toPayload(form).fields, [form]);

  const persist = async (status) => {
    setShowIssues(true);
    setSaved(false);
    if (issues.length) return;
    const res = await dispatch(saveForm(status));
    if (saveForm.fulfilled.match(res)) {
      setSaved(true);
      if (!id) navigate(`/admin/forms/${res.payload._id}/edit`, { replace: true });
    }
  };

  if (id && load.status === 'loading') return <PageLoader />;
  if (id && load.status === 'failed') return <Alert type="error">{load.error}</Alert>;

  const saving = save.status === 'loading';
  const serverErrors = save.errors ? Object.entries(save.errors).map(([k, v]) => `${k}: ${v}`) : [];

  return (
    <>
      <PageHeader
        title={id ? 'Edit form' : 'New form'}
        subtitle={form.status === 'published' ? 'Published' : 'Draft'}
        actions={
          <>
            <Button variant="secondary" onClick={() => navigate('/admin')}>Back</Button>
            <Button variant="secondary" loading={saving} onClick={() => persist('draft')}>Save draft</Button>
            <Button loading={saving} onClick={() => persist('published')}>{form.status === 'published' ? 'Update & publish' : 'Publish'}</Button>
          </>
        }
      />

      {showIssues && issues.length > 0 && <Alert type="warning" className="mb-4">{issues.map((i) => <div key={i}>• {i}</div>)}</Alert>}
      {(save.error || serverErrors.length > 0) && (
  <Alert type="error" className="mb-4">
    {save.error}
    {serverErrors.map((e) => (
      <div key={e}>• {e}</div>
    ))}
  </Alert>
)}
      {saved && !dirty && <Alert type="success" className="mb-4">Form saved successfully.</Alert>}

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <Card title="Form details">
            <div className="space-y-3">
              <FieldWrapper label="Form name" required><TextInput value={form.name} onChange={(v) => dispatch(setMeta({ name: v }))} placeholder="Customer Registration" /></FieldWrapper>
              <FieldWrapper label="Description"><TextArea value={form.description} onChange={(v) => dispatch(setMeta({ description: v }))} /></FieldWrapper>
            </div>
          </Card>

          <Card
            title={`Fields (${form.fields.length})`}
            actions={<Button size="sm" variant="secondary" onClick={() => dispatch(applyTemplate())}>Use starter template</Button>}
          >
            <FieldList />
            <div className="mt-4 flex items-end gap-2">
              <div className="w-44"><SelectInput placeholder="Field type" value={newType} onChange={(v) => setNewType(v || 'text')} options={FIELD_TYPES} /></div>
              <Button variant="secondary" onClick={() => dispatch(addField(newType))}>+ Add field</Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card title="Live preview" className="sticky top-4">
            <h3 className="mb-1 text-lg font-semibold">{form.name || 'Untitled form'}</h3>
            {form.description && <p className="mb-4 text-sm text-slate-500">{form.description}</p>}
            {previewFields.length ? <DynamicForm fields={previewFields} onSubmit={() => {}} submitLabel="Submit (preview)" /> : <p className="text-sm text-slate-400">Fields will appear here.</p>}
          </Card>
        </div>
      </div>
    </>
  );
}
