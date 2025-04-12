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

// Fetch applicants for a specific job
export const fetchApplicants = createAsyncThunk(
  'applicants/fetchApplicants',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await axiosAuth.get(`/jobs/${jobId}/applicants`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update applicant status
export const updateApplicantStatus = createAsyncThunk(
  'applicants/updateApplicantStatus',
  async ({ jobId, referralId, status }, { rejectWithValue }) => {
    try {
      const response = await axiosAuth.put(`/jobs/${jobId}/applicants/${referralId}`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  applicants: [],
  loading: false,
  error: null,
  currentIndex: 0
};

const applicantSlice = createSlice({
  name: 'applicants',
  initialState,
  reducers: {
    setCurrentIndex: (state, action) => {
      state.currentIndex = action.payload;
    },
    clearApplicants: (state) => {
      state.applicants = [];
      state.currentIndex = 0;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Applicants
      .addCase(fetchApplicants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicants.fulfilled, (state, action) => {
        state.loading = false;
        state.applicants = action.payload;
        state.currentIndex = 0;
      })
      .addCase(fetchApplicants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch applicants';
      })
      // Update Applicant Status
      .addCase(updateApplicantStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicantStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the updated applicant from the list
        state.applicants = state.applicants.filter(
          applicant => applicant._id !== action.payload._id
        );
        // Reset index if we're at the end of the list
        if (state.currentIndex >= state.applicants.length) {
          state.currentIndex = Math.max(0, state.applicants.length - 1);
        }
      })
      .addCase(updateApplicantStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update applicant status';
      });
  }
});

export const { setCurrentIndex, clearApplicants } = applicantSlice.actions;
export default applicantSlice.reducer; 