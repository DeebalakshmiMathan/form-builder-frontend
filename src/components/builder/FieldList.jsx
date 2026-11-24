import { useDispatch, useSelector } from 'react-redux';
import FieldEditor from './FieldEditor';
import { moveField, removeField, updateField } from '../../features/builder/builderSlice';

export default function FieldList() {
  const dispatch = useDispatch();
  const fields = useSelector((s) => s.builder.form.fields);

  if (!fields.length) return <p className="rounded-lg border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">No fields yet. Add one or use the starter template.</p>;

  return (
    <div className="space-y-3">
      {fields.map((f, i) => (
        <FieldEditor
          key={f.id}
          field={f}
          index={i}
          total={fields.length}
          onChange={(index, changes) => dispatch(updateField({ index, changes }))}
          onMove={(from, to) => dispatch(moveField({ from, to }))}
          onRemove={(index) => dispatch(removeField(index))}
        />
      ))}
    </div>
  );
}
