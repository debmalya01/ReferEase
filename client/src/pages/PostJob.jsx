import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import JobPost from '../components/jobs/JobPost';
import { createJob } from '../store/slices/jobSlice';

const PostJob = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector(state => state.jobs);

  const handleSubmit = async (jobData) => {
    setLoading(true);
    try {
      await dispatch(createJob(jobData)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to post job:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Post a Job</h1>
        <p className="text-muted-foreground">Create a new job posting to find the perfect candidate</p>
      </div>
      
      <JobPost 
        onSubmit={handleSubmit} 
        loading={loading} 
        error={error}
        onClose={() => navigate('/dashboard')}
      />
    </div>
  );
};

export default PostJob; 