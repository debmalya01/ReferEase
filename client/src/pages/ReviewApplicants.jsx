import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobById } from '../store/slices/jobSlice';
import ApplicantReview from '../components/jobs/ApplicantReview';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Building2, MapPin, Briefcase, Crown } from 'lucide-react';
import { Badge } from '../components/ui/badge';

const ReviewApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentJob, loading } = useSelector(state => state.jobs);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobById(jobId));
    }
  }, [dispatch, jobId]);

  if (loading) {
    return (
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="inline-block p-4 bg-primary/10 rounded-full text-primary animate-pulse mb-4">
            <Crown className="h-10 w-10" />
          </div>
          <p className="text-lg text-muted-foreground ml-4">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Card className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 shadow-md overflow-hidden">
            <CardContent className="p-12 text-center">
              <Building2 className="h-16 w-16 mx-auto text-primary/30 mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-primary/90">Job Not Found</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                The job you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button 
                onClick={() => navigate('/applications')} 
                className="bg-primary hover:bg-primary/90 transition-colors"
              >
                Back to Applications
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header with gradient background */}
      <div className="relative rounded-xl bg-gradient-to-r from-primary/20 via-background to-card/80 p-6 shadow-md mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4 hover:bg-primary/10" 
          onClick={() => navigate('/applications')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Applications
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">{currentJob.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-primary/80 mb-4">
              <div className="flex items-center">
                <Building2 className="h-4 w-4 mr-1" />
                <span>{currentJob.company}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{currentJob.location}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-1" />
                <span>{currentJob.jobType}</span>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Review applicants and choose the best fit by swiping right to accept or left to reject.
            </p>
          </div>
          <Badge variant="outline" className="bg-secondary/80 border border-primary/20 flex items-center p-2">
            <Crown className="h-4 w-4 mr-1 text-primary" />
            <span>Review Mode</span>
          </Badge>
        </div>
      </div>
      
      <div className="mb-6">
        <Card className="border-border bg-card/60 backdrop-blur-sm transition-all duration-300 shadow-md overflow-hidden">
          <CardHeader className="border-b border-border/30 bg-card/70 pb-4">
            <CardTitle className="text-xl font-medium flex items-center">
              <Crown className="h-5 w-5 mr-2 text-primary" />
              Applicant Review
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ApplicantReview jobId={jobId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReviewApplicants; 