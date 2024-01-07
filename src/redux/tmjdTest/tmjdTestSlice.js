import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getTmjdTests = createAsyncThunk('tmjdTest/getTmjdTests', async (data, thunkAPI) => {
  const state = thunkAPI.getState();
  const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/tmjd-tests?populate=deep`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${state.user.user.jwt}`,
    },
    credentials: 'include',
  });
  const tmjdTests = await response.json();
  if (response.ok) {
    return tmjdTests;
  }
  return thunkAPI.rejectWithValue(tmjdTests.message);
});

export const getTmjdTest = createAsyncThunk('tmjdTest/getTmjdTest', async (data, thunkAPI) => {
  const state = thunkAPI.getState();
  const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/tmjd-tests/${data.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${state.user.user.jwt}`,
    },
    credentials: 'include',
  });
  const tmjdTest = await response.json();
  console.log(tmjdTest);
  if (response.ok) {
    return tmjdTest;
  }
  return thunkAPI.rejectWithValue(tmjdTest.message);
});

export const createTmjdTest = createAsyncThunk(
  'tmjdTest/createTmjdTest',
  async (data, thunkAPI) => {
    const state = thunkAPI.getState();
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/tmjd-tests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.user.user.jwt}`,
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    const tmjdTest = await response.json();
    if (response.ok) {
      return tmjdTest;
    }
    return thunkAPI.rejectWithValue(tmjdTest.message);
  }
);

export const updateTmjdTest = createAsyncThunk(
  'tmjdTest/updateTmjdTest',
  async (data, thunkAPI) => {
    const state = thunkAPI.getState();
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/tmjd-tests/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.user.user.jwt}`,
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    const tmjdTest = await response.json();
    if (response.ok) {
      return tmjdTest;
    }
    return thunkAPI.rejectWithValue(tmjdTest.message);
  }
);

export const deleteTmjdTest = createAsyncThunk(
  'tmjdTest/deleteTmjdTest',
  async (data, thunkAPI) => {
    const state = thunkAPI.getState();
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/tmjd-tests/${data.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.user.user.jwt}`,
      },
      credentials: 'include',
    });
    const tmjdTest = await response.json();
    if (response.ok) {
      return tmjdTest;
    }
    return thunkAPI.rejectWithValue(tmjdTest.message);
  }
);

export const tmjdTestSlice = createSlice({
  name: 'tmjdTest',
  initialState: {
    tmjdTests: [],
    tmjdTest: {},
    status: null,
    error: null,
  },
  reducers: {
    resetTmjdTest: (state) => {
      state.tmjdTest = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTmjdTests.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTmjdTests.fulfilled, (state, action) => {
        state.success = true;
        state.loading = false;
        state.tmjdTests = action.payload;
      })
      .addCase(getTmjdTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTmjdTest.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTmjdTest.fulfilled, (state, action) => {
        state.success = true;
        state.loading = false;
        state.tmjdTest = action.payload;
      })
      .addCase(getTmjdTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTmjdTest.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTmjdTest.fulfilled, (state, action) => {
        state.success = true;
        state.tmjdTest = action.payload;
      })
      .addCase(createTmjdTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTmjdTest.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTmjdTest.fulfilled, (state, action) => {
        state.success = true;
        state.loading = false;
        state.tmjdTest = action.payload;
      })
      .addCase(updateTmjdTest.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      })
      .addCase(deleteTmjdTest.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTmjdTest.fulfilled, (state, action) => {
        state.success = true;
        state.loading = false;
        state.tmjdTest = action.payload;
      })
      .addCase(deleteTmjdTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default tmjdTestSlice.reducer;
