import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Card, PageLoader } from '../components/ui';
import DynamicForm from '../components/form/DynamicForm';
import { fetchPublicForm } from '../features/forms/formsSlice';
import { resetSubmit, submitForm } from '../features/submissions/submissionsSlice';

export default function PublicFormPage() {
  const { formId } = useParams();
  const dispatch = useDispatch();
  const { data: form, status, error } = useSelector((s) => s.forms.current);
  const submit = useSelector((s) => s.submissions.submit);

  useEffect(() => {
    dispatch(resetSubmit());
    dispatch(fetchPublicForm(formId));
  }, [dispatch, formId]);

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      {status === 'loading' && <PageLoader />}
      {status === 'failed' && <Alert type="error">{error || 'Form not found'}</Alert>}

      {form && (
        <Card>
          {submit.status === 'succeeded' ? (
            <div className="space-y-3 py-6 text-center">
              <div className="text-4xl">✅</div>
              <h2 className="text-lg font-semibold">Thank you!</h2>
              <p className="text-sm text-slate-500">Your response has been recorded.</p>
              <Button variant="secondary" onClick={() => dispatch(resetSubmit())}>Submit another response</Button>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-semibold">{form.name}</h1>
              {form.description && <p className="mb-4 mt-1 text-sm text-slate-500">{form.description}</p>}
              <div className="mt-4">
                <DynamicForm
                  fields={form.fields}
                  submitting={submit.status === 'loading'}
                  serverErrors={submit.errors}
                  formError={!submit.errors ? submit.error : null}
                  onSubmit={(data) => dispatch(submitForm({ formId, data }))}
                />
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
