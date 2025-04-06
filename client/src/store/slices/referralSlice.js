import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with auth token
const axiosAuth = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
axiosAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchReferrals = createAsyncThunk(
  'referrals/fetchReferrals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosAuth.get('/referrals');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createReferral = createAsyncThunk(
  'referrals/createReferral',
  async (referralData, { rejectWithValue }) => {
    try {
      const response = await axiosAuth.post('/referrals', referralData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateReferralStatus = createAsyncThunk(
  'referrals/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosAuth.put(`/referrals/${id}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'referrals/sendMessage',
  async ({ referralId, content }, { rejectWithValue }) => {
    try {
      const response = await axiosAuth.post(`/referrals/${referralId}/messages`, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  referrals: [],
  currentReferral: null,
  loading: false,
  error: null,
  filters: {
    status: '',
    jobId: '',
    refereeId: '',
    referrerId: ''
  }
};

const referralSlice = createSlice({
  name: 'referrals',
  initialState,
  reducers: {
    setCurrentReferral: (state, action) => {
      state.currentReferral = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearReferralError: (state) => {
      state.error = null;
    },
    addMessage: (state, action) => {
      if (state.currentReferral) {
        state.currentReferral.messages = state.currentReferral.messages || [];
        state.currentReferral.messages.push(action.payload);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Referrals
      .addCase(fetchReferrals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReferrals.fulfilled, (state, action) => {
        state.loading = false;
        state.referrals = action.payload;
      })
      .addCase(fetchReferrals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Referral
      .addCase(createReferral.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReferral.fulfilled, (state, action) => {
        state.loading = false;
        state.referrals.push(action.payload);
      })
      .addCase(createReferral.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Referral Status
      .addCase(updateReferralStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReferralStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.referrals.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.referrals[index] = action.payload;
        }
        if (state.currentReferral?._id === action.payload._id) {
          state.currentReferral = action.payload;
        }
      })
      .addCase(updateReferralStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentReferral) {
          state.currentReferral.messages = state.currentReferral.messages || [];
          state.currentReferral.messages.push(action.payload);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setCurrentReferral,
  setFilters,
  clearFilters,
  clearReferralError,
  addMessage
} = referralSlice.actions;

export default referralSlice.reducer; 