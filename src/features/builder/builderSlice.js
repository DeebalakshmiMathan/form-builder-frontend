import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client, { toApiError } from '../../api/client';
import { DEFAULT_FIELDS, newField } from '../../constants/fieldTypes';
import { toPayload } from '../../utils/builderUtils';

export const loadForm = createAsyncThunk('builder/load', async (id, { rejectWithValue }) => {
  try {
    return (await client.get(`/forms/${id}`)).data;
  } catch (e) {
    return rejectWithValue(toApiError(e));
  }
});

export const saveForm = createAsyncThunk('builder/save', async (status, { getState, rejectWithValue }) => {
  const { form } = getState().builder;
  const payload = { ...toPayload(form), status };
  try {
    const res = form._id ? await client.put(`/forms/${form._id}`, payload) : await client.post('/forms', payload);
    return res.data;
  } catch (e) {
    return rejectWithValue(toApiError(e));
  }
});

const blank = () => ({ _id: null, name: '', description: '', status: 'draft', fields: [] });
const idle = () => ({ status: 'idle', error: null, errors: null });

const slice = createSlice({
  name: 'builder',
  initialState: { form: blank(), load: idle(), save: idle(), dirty: false },
  reducers: {
    resetBuilder: () => ({ form: blank(), load: idle(), save: idle(), dirty: false }),
    setMeta(s, { payload }) { Object.assign(s.form, payload); s.dirty = true; },
    addField(s, { payload }) { s.form.fields.push(newField(payload)); s.dirty = true; },
    updateField(s, { payload: { index, changes } }) { Object.assign(s.form.fields[index], changes); s.dirty = true; },
    removeField(s, { payload }) { s.form.fields.splice(payload, 1); s.dirty = true; },
    moveField(s, { payload: { from, to } }) {
      if (to < 0 || to >= s.form.fields.length) return;
      const [item] = s.form.fields.splice(from, 1);
      s.form.fields.splice(to, 0, item);
      s.dirty = true;
    },
    applyTemplate(s) { s.form.fields = DEFAULT_FIELDS.map((f) => ({ ...f })); s.dirty = true; },
  },
  extraReducers: (b) =>
    b
      .addCase(loadForm.pending, (s) => { s.load = { ...idle(), status: 'loading' }; })
      .addCase(loadForm.fulfilled, (s, { payload }) => { s.load.status = 'succeeded'; s.form = payload; s.dirty = false; })
      .addCase(loadForm.rejected, (s, { payload }) => { s.load.status = 'failed'; s.load.error = payload?.message; })
      .addCase(saveForm.pending, (s) => { s.save = { ...idle(), status: 'loading' }; })
      .addCase(saveForm.fulfilled, (s, { payload }) => { s.save.status = 'succeeded'; s.form = payload; s.dirty = false; })
      .addCase(saveForm.rejected, (s, { payload }) => {
        s.save.status = 'failed';
        s.save.error = payload?.message;
        s.save.errors = payload?.errors;
      }),
});

export const { resetBuilder, setMeta, addField, updateField, removeField, moveField, applyTemplate } = slice.actions;
export default slice.reducer;
