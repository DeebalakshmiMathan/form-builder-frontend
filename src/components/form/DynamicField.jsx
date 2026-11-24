import { Checkbox, CheckboxGroup, FieldWrapper, RadioGroup, SelectInput, TextArea, TextInput } from '../ui';

/**
 * Field-type registry. To support a new type, add ONE entry here
 * (plus its validator) - no form-specific code anywhere.
 */
const registry = {
  text: ({ field, ...p }) => <TextInput placeholder={field.placeholder} {...p} />,
  email: ({ field, ...p }) => <TextInput type="email" placeholder={field.placeholder} {...p} />,
  number: ({ field, ...p }) => <TextInput type="number" placeholder={field.placeholder} min={field.validation?.min} max={field.validation?.max} {...p} />,
  phone: ({ field, ...p }) => <TextInput type="tel" placeholder={field.placeholder} {...p} />,
  date: ({ field, ...p }) => <TextInput type="date" {...p} />,
  textarea: ({ field, ...p }) => <TextArea placeholder={field.placeholder} {...p} />,
  select: ({ field, ...p }) => <SelectInput options={field.options} placeholder={field.placeholder || 'Select...'} {...p} />,
  radio: ({ field, id, error, ...p }) => <RadioGroup name={id} options={field.options} {...p} />,
  checkbox: ({ field, id, error, ...p }) =>
    field.options?.length ? <CheckboxGroup options={field.options} {...p} /> : <Checkbox label={field.label} checked={p.value} onChange={p.onChange} disabled={p.disabled} />,
};

export default function DynamicField({ field, value, onChange, error, disabled }) {
  const Control = registry[field.type];
  if (!Control) return null;
  const id = `field-${field.key}`;
  const singleCheckbox = field.type === 'checkbox' && !field.options?.length;

  return (
    <FieldWrapper label={singleCheckbox ? null : field.label} htmlFor={id} required={field.required} error={error}>
      <Control field={field} id={id} value={value} onChange={onChange} error={error} disabled={disabled} />
    </FieldWrapper>
  );
}
