import { TextArea } from '../ui';

// One option per line - fast to edit and trivially convertible to string[]
export default function OptionsEditor({ options, onChange, error }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600">Options (one per line)</label>
      <TextArea rows={4} value={options.join('\n')} error={error} onChange={(v) => onChange(v.split('\n').map((s) => s.trim()))} />
    </div>
  );
}
