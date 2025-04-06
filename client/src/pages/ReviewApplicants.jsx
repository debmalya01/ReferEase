import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobs } from '../store/slices/jobSlice';
import ApplicantReview from '../components/jobs/ApplicantReview';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Building2, MapPin, Briefcase } from 'lucide-react';

const ReviewApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector(state => state.jobs);
  const [job, setJob] = useState(null);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  useEffect(() => {
    if (jobs.length > 0 && jobId) {
      const foundJob = jobs.find(j => j._id === jobId);
      if (foundJob) {
        setJob(foundJob);
      }
    }
  }, [jobs, jobId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <Card className="border-0 shadow-md p-6">
            <CardContent className="flex flex-col items-center text-center">
              <h2 className="text-xl font-semibold mb-2">Job Not Found</h2>
              <p className="text-muted-foreground mb-4">The job you're looking for doesn't exist or you don't have permission to view it.</p>
              <Button onClick={() => navigate('/applications')}>Back to Applications</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/applications')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Applications
        </Button>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-100 mb-6">
          <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center">
              <Building2 className="h-4 w-4 mr-1" />
              <span>{job.company}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 mr-1" />
              <span>{job.type}</span>
            </div>
          </div>
          <p className="text-muted-foreground text-base">
            Find the perfect match for your job opening. Review applicants and choose the best fit by using the accept/reject buttons!
          </p>
        </div>
      </div>
      
      <ApplicantReview jobId={jobId} />
    </div>
  );
};

export default ReviewApplicants; 