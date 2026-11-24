import { useEffect, useState } from 'react';
import { Alert, Button } from '../ui';
import DynamicField from './DynamicField';
import { initialValue, initialValues, validateField, validateForm } from '../../utils/validateForm';

/**
 * Renders any form definition. Value state is intentionally LOCAL (transient, per keystroke);
 * only the submit lifecycle lives in Redux and is passed in via props.
 */
export default function DynamicForm({ fields, onSubmit, submitting = false, serverErrors = null, formError = null, submitLabel = 'Submit', disabled = false }) {
  const [values, setValues] = useState(() => initialValues(fields));
  const [errors, setErrors] = useState({});

  // Keep existing answers when the field list changes (builder live-preview)
  useEffect(() => {
    setValues((prev) => Object.fromEntries(fields.map((f) => [f.key, f.key in prev ? prev[f.key] : initialValue(f)])));
  }, [fields]);

  useEffect(() => { if (serverErrors) setErrors(serverErrors); }, [serverErrors]);

  const handleChange = (field, value) => {
    setValues((v) => ({ ...v, [field.key]: value }));
    if (errors[field.key]) setErrors((e) => ({ ...e, [field.key]: validateField(field, value) || undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const found = validateForm(fields, values);
    setErrors(found);
    if (!Object.keys(found).length) onSubmit(values);
    console.log("check");
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {fields.map((f) => (
        <DynamicField key={f.key} field={f} value={values[f.key]} error={errors[f.key]} disabled={disabled || submitting} onChange={(v) => handleChange(f, v)} />
      ))}
      <Alert type="error">{formError}</Alert>
      <Button type="submit" loading={submitting} disabled={disabled}>{submitLabel}</Button>
    </form>
  );
}
