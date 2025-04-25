import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../lib/api';

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        return rejectWithValue({ message: error.response.data.message });
      }
      return rejectWithValue({ message: 'Registration failed. Please try again.' });
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const googleAuth = createAsyncThunk(
  'auth/googleAuth',
  async (credential, { rejectWithValue }) => {
    try {
      const response = await authAPI.googleAuth(credential);
      if (response.data.requiresRegistration) {
        return rejectWithValue({
          requiresRegistration: true,
          googleData: response.data.googleData
        });
      }
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        return rejectWithValue({ message: error.response.data.message });
      }
      return rejectWithValue({ message: 'Google authentication failed. Please try again.' });
    }
  }
);

export const completeGoogleRegistration = createAsyncThunk(
  'auth/completeGoogleRegistration',
  async ({ googleData, role }, { rejectWithValue }) => {
    try {
      const response = await authAPI.completeGoogleRegistration(googleData, role);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getProfile();
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to get user data';
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
      return rejectWithValue({ message: errorMessage });
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Google Auth
      .addCase(googleAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Complete Google Registration
      .addCase(completeGoogleRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeGoogleRegistration.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(completeGoogleRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        localStorage.removeItem('token');
        state.token = null;
        state.isAuthenticated = false;
        state.user = null;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  }
});

export const { logout, clearError, loginSuccess } = authSlice.actions;
export default authSlice.reducer; 