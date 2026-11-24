/**
 * Controlled primitives. Every control exposes onChange(value) - not the DOM event -
 * so DynamicField, the builder and any other form can reuse them identically.
 */
const base = 'block w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-100';
const tone = (error) => (error ? 'border-red-400 focus:ring-red-300' : 'border-slate-300 focus:ring-brand-500');

export function FieldWrapper({ label, htmlFor, required, error, hint, children }) {
  return (
    <div>
      {label && (
        <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function TextInput({ type = 'text', value, onChange, error, className = '', ...props }) {
  return <input type={type} value={value ?? ''} onChange={(e) => onChange?.(e.target.value)} className={`${base} ${tone(error)} ${className}`} {...props} />;
}

export function TextArea({ value, onChange, error, rows = 3, ...props }) {
  return <textarea rows={rows} value={value ?? ''} onChange={(e) => onChange?.(e.target.value)} className={`${base} ${tone(error)}`} {...props} />;
}

export function SelectInput({ value, onChange, options = [], placeholder = 'Select...', error, ...props }) {
  return (
    <select value={value ?? ''} onChange={(e) => onChange?.(e.target.value)} className={`${base} ${tone(error)}`} {...props}>
      <option value="">{placeholder}</option>
      {options.map((o) => {
        const opt = typeof o === 'string' ? { value: o, label: o } : o;
        return <option key={opt.value} value={opt.value}>{opt.label}</option>;
      })}
    </select>
  );
}

export function RadioGroup({ name, value, onChange, options = [], disabled }) {
  return (
    <div className="flex flex-wrap gap-4">
      {options.map((o) => (
        <label key={o} className="inline-flex items-center gap-2 text-sm">
          <input type="radio" name={name} value={o} checked={value === o} disabled={disabled} onChange={() => onChange?.(o)} className="text-brand-600 focus:ring-brand-500" />
          {o}
        </label>
      ))}
    </div>
  );
}

export function CheckboxGroup({ value = [], onChange, options = [], disabled }) {
  const toggle = (o) => onChange?.(value.includes(o) ? value.filter((v) => v !== o) : [...value, o]);
  return (
    <div className="flex flex-wrap gap-4">
      {options.map((o) => (
        <label key={o} className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={value.includes(o)} disabled={disabled} onChange={() => toggle(o)} className="rounded text-brand-600 focus:ring-brand-500" />
          {o}
        </label>
      ))}
    </div>
  );
}

export function Checkbox({ label, checked, onChange, disabled }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input type="checkbox" checked={!!checked} disabled={disabled} onChange={(e) => onChange?.(e.target.checked)} className="rounded text-brand-600 focus:ring-brand-500" />
      {label}
    </label>
  );
}
