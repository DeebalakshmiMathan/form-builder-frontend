import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client, { TOKEN_KEY, toApiError } from "../../api/client";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await client.post("/auth/login", credentials);
      const { token, user } = res.data;
      localStorage.setItem(TOKEN_KEY, token);
      return { token, user };
    } catch (e) {
      return rejectWithValue(toApiError(e));
    }
  },
);

const slice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem(TOKEN_KEY),
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout(state) {
      localStorage.removeItem(TOKEN_KEY);
      state.token = null;
      state.user = null;
    },
  },
  extraReducers: (b) =>
    b
      .addCase(login.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(login.fulfilled, (s, { payload }) => {
        s.status = "succeeded";
        s.token = payload.token;
        s.user = payload.user;
      })
      .addCase(login.rejected, (s, { payload }) => {
        s.status = "failed";
        s.error = payload?.message;
      }),
});

export const { logout } = slice.actions;
export default slice.reducer;
