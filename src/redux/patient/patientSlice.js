import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getPatients = createAsyncThunk('patient/getPatients', async (data, thunkAPI) => {
  const state = thunkAPI.getState();
  const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/patients`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${state.user.user.jwt}`,
    },
    credentials: 'include',
  });
  const patients = await response.json();
  console.log(patients);
  if (response.ok) {
    return patients;
  }
  return thunkAPI.rejectWithValue(patients.message);
});

export const createPatient = createAsyncThunk('patient/createPatient', async (data, thunkAPI) => {
  const state = thunkAPI.getState();
  const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/patients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${state.user.user.jwt}`,
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  const patient = await response.json();
  if (response.ok) {
    return patient;
  }
  return thunkAPI.rejectWithValue(patient.message);
});

export const updatePatient = createAsyncThunk('patient/updatePatient', async (data, thunkAPI) => {
  const state = thunkAPI.getState();
  const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/patients/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${state.user.user.jwt}`,
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  const patient = await response.json();
  if (response.ok) {
    return patient;
  }
  return thunkAPI.rejectWithValue(patient.message);
});

export const patientSlice = createSlice({
  name: 'patient',
  initialState: {
    patients: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPatients.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getPatients.fulfilled, (state, action) => {
        state.patients = action.payload;
        state.loading = false;
      })
      .addCase(getPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// export const {} = patientSlice.actions;
export default patientSlice.reducer;
