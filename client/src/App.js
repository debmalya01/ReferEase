import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Toaster } from 'sonner';
import { Provider } from 'react-redux';
// import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from './store';
import { getCurrentUser } from './store/slices/authSlice';

// Layout components
import Layout from './components/layout/Layout';
import PrivateRoute from './components/routing/PrivateRoute';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
// import ForgotPassword from './pages/auth/ForgotPassword';
// import ResetPassword from './pages/auth/ResetPassword';

// Main pages
import Dashboard from './pages/Dashboard.jsx';
import PostJob from './pages/PostJob.jsx';
import BrowseJobs from './pages/BrowseJobs.jsx';
import Applications from './pages/Applications';
import Notifications from './pages/Notifications.jsx';
import Profile from './pages/Profile.jsx';
import ReviewApplicants from './pages/ReviewApplicants.jsx';
import MyJobs from './components/jobs/MyJobs';
// import Messages from './pages/Messages';
// import Settings from './pages/Settings';

function AppContent() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, token } = useSelector((state) => state.auth);

  useEffect(() => {
    // If there's a token in localStorage, try to get the current user
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token]);

  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={!isAuthenticated ? <Home /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        {/* <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/" />} />
        <Route path="/reset-password/:token" element={!isAuthenticated ? <ResetPassword /> : <Navigate to="/" />} /> */}

        {/* Protected routes */}
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/browse-jobs" element={<BrowseJobs />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/review-applicants/:jobId" element={<ReviewApplicants />} />
          <Route path="/my-jobs" element={<MyJobs />} />
          {/* <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<Settings />} /> */}
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
