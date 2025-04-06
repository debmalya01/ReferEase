import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const switchRole = createAsyncThunk(
  'user/switchRole',
  async (role, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/users/switch-role', { role });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addRole = createAsyncThunk(
  'user/addRole',
  async (role, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/users/add-role', { role });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/users/profile', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getProfile = createAsyncThunk(
  'user/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/users/profile');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
  success: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Switch Role
      .addCase(switchRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(switchRole.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.data;
      })
      .addCase(switchRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to switch role';
      })
      // Add Role
      .addCase(addRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRole.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.data;
      })
      .addCase(addRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add role';
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.data;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update profile';
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch profile';
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer; 