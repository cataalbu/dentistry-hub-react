import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getMriImages = createAsyncThunk('mriImage/getMriImages', async (data, thunkAPI) => {
  const state = thunkAPI.getState();
  const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/mri-images?populate=deep`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${state.user.user.jwt}`,
    },
    credentials: 'include',
  });
  const mriImages = await response.json();
  if (response.ok) {
    return mriImages;
  }
  return thunkAPI.rejectWithValue(mriImages.message);
});

export const getMriImage = createAsyncThunk('mriImage/getMriImage', async (data, thunkAPI) => {
  const state = thunkAPI.getState();
  const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/mri-images/${data.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${state.user.user.jwt}`,
    },
    credentials: 'include',
  });
  const mriImage = await response.json();
  console.log(mriImage);
  if (response.ok) {
    return mriImage;
  }
  return thunkAPI.rejectWithValue(mriImage.message);
});

export const createMriImage = createAsyncThunk(
  'mriImage/createMriImage',
  async (data, thunkAPI) => {
    const state = thunkAPI.getState();
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/mri-images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.user.user.jwt}`,
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    const mriImage = await response.json();
    if (response.ok) {
      return mriImage;
    }
    return thunkAPI.rejectWithValue(mriImage.message);
  }
);

export const updateMriImage = createAsyncThunk(
  'mriImage/updateMriImage',
  async (data, thunkAPI) => {
    const state = thunkAPI.getState();
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/mri-images/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.user.user.jwt}`,
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    const mriImage = await response.json();
    if (response.ok) {
      return mriImage;
    }
    return thunkAPI.rejectWithValue(mriImage.message);
  }
);

export const deleteMriImage = createAsyncThunk(
  'mriImage/deleteMriImage',
  async (data, thunkAPI) => {
    const state = thunkAPI.getState();
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/mri-images/${data.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.user.user.jwt}`,
      },
      credentials: 'include',
    });
    const mriImage = await response.json();
    if (response.ok) {
      return mriImage;
    }
    return thunkAPI.rejectWithValue(mriImage.message);
  }
);

const mriImageSlice = createSlice({
  name: 'mriImage',
  initialState: {
    mriImages: [],
    mriImage: {},
    status: null,
    error: null,
  },
  reducers: {
    clearMriImage: (state) => {
      state.mriImage = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMriImages.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(getMriImages.fulfilled, (state, { payload }) => {
      state.status = 'success';
      state.mriImages = payload;
    });
    builder.addCase(getMriImages.rejected, (state, { payload }) => {
      state.status = 'failed';
      state.error = payload;
    });
    builder.addCase(getMriImage.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(getMriImage.fulfilled, (state, { payload }) => {
      state.status = 'success';
      state.mriImage = payload;
    });
    builder.addCase(getMriImage.rejected, (state, { payload }) => {
      state.status = 'failed';
      state.error = payload;
    });
    builder.addCase(createMriImage.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(createMriImage.fulfilled, (state, { payload }) => {
      state.status = 'success';
      state.mriImage = payload;
    });
    builder.addCase(createMriImage.rejected, (state, { payload }) => {
      state.status = 'failed';
      state.error = payload;
    });
    builder.addCase(updateMriImage.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(updateMriImage.fulfilled, (state, { payload }) => {
      state.status = 'success';
      state.mriImage = payload;
    });
    builder.addCase(updateMriImage.rejected, (state, { payload }) => {
      state.status = 'failed';
      state.error = payload;
    });
    builder.addCase(deleteMriImage.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(deleteMriImage.fulfilled, (state, { payload }) => {
      state.status = 'success';
      state.mriImage = payload;
    });
    builder.addCase(deleteMriImage.rejected, (state, { payload }) => {
      state.status = 'failed';
      state.error = payload;
    });
  },
});

export default mriImageSlice.reducer;
