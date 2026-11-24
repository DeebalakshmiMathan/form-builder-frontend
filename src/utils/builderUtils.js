import { OPTION_TYPES } from '../constants/fieldTypes';

const numOrUndef = (v) => (v === '' || v === null || v === undefined || Number.isNaN(Number(v)) ? undefined : Number(v));

// Shapes builder state into the API payload (drops empties so the backend schema stays happy)
export function toPayload(form) {
  return {
    name: form.name,
    description: form.description || '',
    fields: form.fields.map((f) => {
      const v = f.validation || {};
      const validation = Object.fromEntries(
        Object.entries({ minLength: numOrUndef(v.minLength), maxLength: numOrUndef(v.maxLength), min: numOrUndef(v.min), max: numOrUndef(v.max) }).filter(([, x]) => x !== undefined)
      );
      return {
        key: f.key,
        label: f.label,
        type: f.type,
        placeholder: f.placeholder || '',
        required: !!f.required,
        options: OPTION_TYPES.includes(f.type) ? f.options.filter(Boolean) : [],
        validation,
        ...(f.defaultValue !== '' && f.defaultValue != null && { defaultValue: f.defaultValue }),
      };
    }),
  };
}

// Returns a list of human-readable problems found before hitting the API
export function checkBuilder(form) {
  const issues = [];
  if (!form.name.trim()) issues.push('Form name is required');
  if (!form.fields.length) issues.push('Add at least one field');
  const keys = new Set();
  form.fields.forEach((f, i) => {
    const n = i + 1;
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(f.key)) issues.push(`Field ${n}: key must start with a letter and use only letters, numbers or _`);
    if (keys.has(f.key)) issues.push(`Field ${n}: duplicate key "${f.key}"`);
    keys.add(f.key);
    if (!f.label.trim()) issues.push(`Field ${n}: label is required`);
    if ((f.type === 'select' || f.type === 'radio') && !f.options.filter(Boolean).length) issues.push(`Field ${n}: add at least one option`);
  });
  return issues;
}
