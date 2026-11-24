// Client-side mirror of backend/src/services/submissionValidator.js (UX only - the server is the source of truth)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9][0-9\s-]{6,14}$/;

export const isEmpty = (v) => v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);

export function validateField(f, value) {
  if (isEmpty(value) && !(f.type === 'checkbox' && !f.options?.length && f.required)) {
    return f.required ? `${f.label} is required` : null;
  }
  const { minLength, maxLength, min, max } = f.validation || {};
  switch (f.type) {
    case 'email':
      return EMAIL_RE.test(value) ? null : `${f.label} must be a valid email`;
    case 'phone':
      return PHONE_RE.test(value) ? null : `${f.label} must be a valid phone number`;
    case 'number': {
      const n = Number(value);
      if (!Number.isFinite(n)) return `${f.label} must be a number`;
      if (min != null && n < min) return `${f.label} must be at least ${min}`;
      if (max != null && n > max) return `${f.label} must be at most ${max}`;
      return null;
    }
    case 'text':
    case 'textarea':
      if (minLength != null && value.length < minLength) return `${f.label} must be at least ${minLength} characters`;
      if (maxLength != null && value.length > maxLength) return `${f.label} must be at most ${maxLength} characters`;
      return null;
    case 'select':
    case 'radio':
      return f.options.includes(value) ? null : `${f.label} has an invalid option`;
    case 'checkbox':
      if (!f.options?.length) return f.required && !value ? `${f.label} is required` : null;
      return value.every((v) => f.options.includes(v)) ? null : `${f.label} has an invalid option`;
    default:
      return null;
  }
}

export function validateForm(fields, values) {
  const errors = {};
  for (const f of fields) {
    const msg = validateField(f, values[f.key]);
    if (msg) errors[f.key] = msg;
  }
  return errors;
}

export const initialValues = (fields) =>
  Object.fromEntries(fields.map((f) => [f.key, initialValue(f)]));

export function initialValue(f) {
  if (f.defaultValue !== undefined && f.defaultValue !== null && f.defaultValue !== '') return f.defaultValue;
  if (f.type === 'checkbox') return f.options?.length ? [] : false;
  return '';
}
