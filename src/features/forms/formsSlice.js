import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client, { toApiError } from '../../api/client';

export const fetchForms = createAsyncThunk('forms/fetchAll', async (params, { rejectWithValue }) => {
  try {
    return await client.get('/forms', { params });
  } catch (e) {
    return rejectWithValue(toApiError(e));
  }
});

export const deleteForm = createAsyncThunk('forms/delete', async (id, { rejectWithValue }) => {
  try {
    await client.delete(`/forms/${id}`);
    return id;
  } catch (e) {
    return rejectWithValue(toApiError(e));
  }
});

// Public: used by /forms/:formId to render the dynamic form
export const fetchPublicForm = createAsyncThunk('forms/fetchPublic', async (id, { rejectWithValue }) => {
  try {
    return (await client.get(`/forms/${id}`)).data;
  } catch (e) {
    return rejectWithValue(toApiError(e));
  }
});

const asyncState = { status: 'idle', error: null };

const slice = createSlice({
  name: 'forms',
  initialState: {
    list: { ...asyncState, items: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } },
    current: { ...asyncState, data: null },
  },
  reducers: {},
  extraReducers: (b) =>
    b
      .addCase(fetchForms.pending, (s) => { s.list.status = 'loading'; s.list.error = null; })
      .addCase(fetchForms.fulfilled, (s, { payload }) => {
        s.list.status = 'succeeded';
        s.list.items = payload.data;
        s.list.pagination = payload.pagination;
      })
      .addCase(fetchForms.rejected, (s, { payload }) => { s.list.status = 'failed'; s.list.error = payload?.message; })
      .addCase(deleteForm.fulfilled, (s, { payload }) => { s.list.items = s.list.items.filter((f) => f._id !== payload); })
      .addCase(fetchPublicForm.pending, (s) => { s.current = { ...asyncState, status: 'loading', data: null }; })
      .addCase(fetchPublicForm.fulfilled, (s, { payload }) => { s.current.status = 'succeeded'; s.current.data = payload; })
      .addCase(fetchPublicForm.rejected, (s, { payload }) => { s.current.status = 'failed'; s.current.error = payload?.message; }),
});

export default slice.reducer;
