export const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  { value: 'phone', label: 'Phone' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'date', label: 'Date' },
  { value: 'select', label: 'Select' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
];

export const OPTION_TYPES = ['select', 'radio', 'checkbox'];
export const LENGTH_TYPES = ['text', 'textarea'];

let counter = 0;
export const newField = (type = 'text') => ({
  key: `field_${Date.now().toString(36)}${counter++}`,
  label: 'New field',
  type,
  placeholder: '',
  defaultValue: '',
  required: false,
  options: OPTION_TYPES.includes(type) && type !== 'checkbox' ? ['Option 1', 'Option 2'] : [],
  validation: {},
});

export const DEFAULT_FIELDS = [
  { key: 'name', label: 'Name', type: 'text', placeholder: 'Full name', required: true, options: [], validation: { minLength: 2, maxLength: 100 } },
  { key: 'email', label: 'Email', type: 'email', placeholder: 'you@company.com', required: true, options: [], validation: {} },
  { key: 'gender', label: 'Gender', type: 'radio', placeholder: '', required: true, options: ['Male', 'Female', 'Other'], validation: {} },
  { key: 'mobile', label: 'Mobile', type: 'phone', placeholder: '+91 98765 43210', required: true, options: [], validation: {} },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Tell us about yourself', required: false, options: [], validation: { maxLength: 500 } },
  { key: 'department', label: 'Department', type: 'select', placeholder: '', required: true, options: ['Engineering', 'HR', 'Finance', 'Sales'], validation: {} },
  { key: 'designation', label: 'Designation', type: 'select', placeholder: '', required: true, options: ['Intern', 'Developer', 'Team Lead', 'Manager'], validation: {} },
  { key: 'role', label: 'Role', type: 'select', placeholder: '', required: true, options: ['Admin', 'Manager', 'Employee'], validation: {} },
];
