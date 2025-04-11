import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobReducer from './slices/jobSlice';
import referralReducer from './slices/referralSlice';
import notificationReducer from './slices/notificationSlice';
import applicantReducer from './slices/applicantSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    referrals: referralReducer,
    notifications: notificationReducer,
    applicants: applicantReducer,
  },
}); 