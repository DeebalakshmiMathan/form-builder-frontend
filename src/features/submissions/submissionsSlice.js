import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client, { toApiError } from '../../api/client';

export const fetchSubmissions = createAsyncThunk('submissions/fetchAll', async ({ formId, ...params }, { rejectWithValue }) => {
  try {
    return await client.get(`/forms/${formId}/submissions`, { params });
  } catch (e) {
    return rejectWithValue(toApiError(e));
  }
});

export const fetchSubmission = createAsyncThunk('submissions/fetchOne', async ({ formId, id }, { rejectWithValue }) => {
  try {
    return (await client.get(`/forms/${formId}/submissions/${id}`)).data;
  } catch (e) {
    return rejectWithValue(toApiError(e));
  }
});

export const deleteSubmission = createAsyncThunk('submissions/delete', async ({ formId, id }, { rejectWithValue }) => {
  try {
    await client.delete(`/forms/${formId}/submissions/${id}`);
    return id;
  } catch (e) {
    return rejectWithValue(toApiError(e));
  }
});

// Public submit
export const submitForm = createAsyncThunk('submissions/submit', async ({ formId, data }, { rejectWithValue }) => {
  try {
    return (await client.post(`/forms/${formId}/submissions`, { data })).data;
  } catch (e) {
    return rejectWithValue(toApiError(e));
  }
});

const a = () => ({ status: 'idle', error: null });

const slice = createSlice({
  name: 'submissions',
  initialState: {
    list: { ...a(), items: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } },
    selected: { ...a(), data: null },
    submit: { ...a(), errors: null },
  },
  reducers: {
    clearSelected(s) { s.selected = { ...a(), data: null }; },
    resetSubmit(s) { s.submit = { ...a(), errors: null }; },
  },
  extraReducers: (b) =>
    b
      .addCase(fetchSubmissions.pending, (s) => { s.list.status = 'loading'; s.list.error = null; })
      .addCase(fetchSubmissions.fulfilled, (s, { payload }) => {
        s.list.status = 'succeeded';
        s.list.items = payload.data;
        s.list.pagination = payload.pagination;
      })
      .addCase(fetchSubmissions.rejected, (s, { payload }) => { s.list.status = 'failed'; s.list.error = payload?.message; })
      .addCase(fetchSubmission.pending, (s) => { s.selected = { ...a(), status: 'loading', data: null }; })
      .addCase(fetchSubmission.fulfilled, (s, { payload }) => { s.selected.status = 'succeeded'; s.selected.data = payload; })
      .addCase(fetchSubmission.rejected, (s, { payload }) => { s.selected.status = 'failed'; s.selected.error = payload?.message; })
      .addCase(deleteSubmission.fulfilled, (s, { payload }) => { s.list.items = s.list.items.filter((i) => i._id !== payload); })
      .addCase(submitForm.pending, (s) => { s.submit = { ...a(), status: 'loading', errors: null }; })
      .addCase(submitForm.fulfilled, (s) => { s.submit.status = 'succeeded'; })
      .addCase(submitForm.rejected, (s, { payload }) => {
        s.submit.status = 'failed';
        s.submit.error = payload?.message;
        s.submit.errors = payload?.errors;
      }),
});

export const { clearSelected, resetSubmit } = slice.actions;
export default slice.reducer;
