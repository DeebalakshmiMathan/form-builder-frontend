import { Button, Checkbox, FieldWrapper, SelectInput, TextInput } from '../ui';
import OptionsEditor from './OptionsEditor';
import { FIELD_TYPES, LENGTH_TYPES, OPTION_TYPES } from '../../constants/fieldTypes';

export default function FieldEditor({ field, index, total, onChange, onMove, onRemove }) {
  const set = (changes) => onChange(index, changes);
  const setValidation = (k, v) => set({ validation: { ...field.validation, [k]: v } });
  const hasOptions = OPTION_TYPES.includes(field.type);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">#{index + 1} · {field.type}</span>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" disabled={index === 0} onClick={() => onMove(index, index - 1)} title="Move up">↑</Button>
          <Button size="sm" variant="ghost" disabled={index === total - 1} onClick={() => onMove(index, index + 1)} title="Move down">↓</Button>
          <Button size="sm" variant="ghost" className="text-red-600" onClick={() => onRemove(index)}>Delete</Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <FieldWrapper label="Label"><TextInput value={field.label} onChange={(v) => set({ label: v })} /></FieldWrapper>
        <FieldWrapper label="Field key" hint="Used as the key in submissions"><TextInput value={field.key} onChange={(v) => set({ key: v.replace(/\s/g, '') })} /></FieldWrapper>
        <FieldWrapper label="Type">
          <SelectInput
            value={field.type}
            options={FIELD_TYPES}
            placeholder="Type"
            onChange={(type) => set({ type, defaultValue: '', options: OPTION_TYPES.includes(type) && !field.options.length && type !== 'checkbox' ? ['Option 1', 'Option 2'] : field.options })}
          />
        </FieldWrapper>
        <FieldWrapper label="Placeholder"><TextInput value={field.placeholder} onChange={(v) => set({ placeholder: v })} /></FieldWrapper>

        {!hasOptions && field.type !== 'date' && (
          <FieldWrapper label="Default value">
            <TextInput type={field.type === 'number' ? 'number' : 'text'} value={field.defaultValue} onChange={(v) => set({ defaultValue: v })} />
          </FieldWrapper>
        )}
        {hasOptions && field.type !== 'checkbox' && (
          <FieldWrapper label="Default value">
            <SelectInput value={field.defaultValue} options={field.options.filter(Boolean)} placeholder="None" onChange={(v) => set({ defaultValue: v })} />
          </FieldWrapper>
        )}

        {LENGTH_TYPES.includes(field.type) && (
          <>
            <FieldWrapper label="Min length"><TextInput type="number" value={field.validation?.minLength} onChange={(v) => setValidation('minLength', v)} /></FieldWrapper>
            <FieldWrapper label="Max length"><TextInput type="number" value={field.validation?.maxLength} onChange={(v) => setValidation('maxLength', v)} /></FieldWrapper>
          </>
        )}
        {field.type === 'number' && (
          <>
            <FieldWrapper label="Min value"><TextInput type="number" value={field.validation?.min} onChange={(v) => setValidation('min', v)} /></FieldWrapper>
            <FieldWrapper label="Max value"><TextInput type="number" value={field.validation?.max} onChange={(v) => setValidation('max', v)} /></FieldWrapper>
          </>
        )}
      </div>

      {hasOptions && <div className="mt-3"><OptionsEditor options={field.options} onChange={(options) => set({ options })} /></div>}
      <div className="mt-3"><Checkbox label="Required" checked={field.required} onChange={(v) => set({ required: v })} /></div>
    </div>
  );
}
