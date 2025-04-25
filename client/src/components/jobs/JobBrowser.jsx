import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { fetchJobs, rejectJob } from '../../store/slices/jobSlice';
import { createReferral } from '../../store/slices/referralSlice';
import { CheckCircle, XCircle, MapPin, Clock, Building2, Award, CreditCard, Briefcase, DollarSign, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const JobBrowser = () => {
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((state) => state.jobs);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [jobsCache, setJobsCache] = useState([]);
  const { user } = useSelector((state) => state.auth);

  // Use a local cache of jobs to prevent UI flicker during transitions
  const filteredJobs = jobsCache.length > 0 ? jobsCache : jobs;

  // Fetch jobs on component mount
  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // Update cache when jobs change, but only if not in the middle of an action
  useEffect(() => {
    if (!actionLoading && !refreshing) {
      setJobsCache(jobs);
    }
  }, [jobs, actionLoading, refreshing]);

  // Function to force refresh jobs - but do not update UI immediately to avoid flicker
  const handleRefreshJobs = (skipUIUpdate = false) => {
    setRefreshing(true);
    setErrorMsg(null);
    
    return new Promise((resolve) => {
      // Fetch new jobs data
      dispatch(fetchJobs())
        .then(() => {
          setTimeout(() => {
            // Only update UI immediately if not skipping
            if (!skipUIUpdate) {
              setJobsCache([]); // Clear cache to force update
              setCurrentIndex(0);
            }
            setRefreshing(false);
            resolve();
          }, 300);
        })
        .catch((error) => {
          setRefreshing(false);
          setErrorMsg("Could not refresh jobs. Try again later.");
          console.error('Error refreshing jobs:', error);
          resolve();
        });
    });
  };

  const handleAccept = async (jobId) => {
    if (actionLoading) return;
    
    setActionLoading(true);
    setErrorMsg(null);
    
    try {
      const job = filteredJobs.find(j => j._id === jobId);
      if (!job) {
        throw new Error('Job not found');
      }

      setDirection('right');
      
      // Remove job from local cache immediately for smooth transition
      const updatedJobs = filteredJobs.filter(j => j._id !== jobId);
      setJobsCache(updatedJobs);
      
      // Process the API call in the background
      dispatch(createReferral({ 
        jobId, 
        referrerId: job.postedBy,
        status: 'pending' 
      })).unwrap()
      .then(() => {
        toast.success("Application sent successfully!");
      })
      .catch((error) => {
        console.error('Error accepting job:', error);
        setErrorMsg("Failed to apply for this job. Please try again.");
        toast.error("Failed to apply for job");
        // Restore the cache if there was an error
        setJobsCache(filteredJobs);
      });
      
      // Move to next card with animation
      setTimeout(() => {
        const nextIndex = Math.min(currentIndex, updatedJobs.length - 1);
        setCurrentIndex(nextIndex);
        setDirection(null);
        
        // Only refresh job list after a sufficient delay
        setTimeout(() => {
          setActionLoading(false);
          // Refresh in background without affecting UI
          handleRefreshJobs(true);
        }, 500);
      }, 300);
    } catch (error) {
      console.error('Error accepting job:', error);
      setActionLoading(false);
      setErrorMsg("Failed to apply for this job. Please try again.");
      toast.error("Failed to apply for job");
    }
  };

  const handleReject = async () => {
    if (actionLoading) return;
    
    if (!filteredJobs || filteredJobs.length === 0 || currentIndex >= filteredJobs.length) {
      console.error('No valid job to reject');
      return;
    }
    
    setActionLoading(true);
    setDirection('left');
    setErrorMsg(null);
    
    try {
      // Get the current job ID
      const currentJob = filteredJobs[currentIndex];
      
      if (!currentJob || !currentJob._id) {
        throw new Error('Current job not found or has no ID');
      }
      
      // Remove job from local cache immediately for smooth transition
      const jobId = currentJob._id;
      const updatedJobs = filteredJobs.filter(job => job._id !== jobId);
      setJobsCache(updatedJobs);
      
      console.log('Rejecting job:', jobId);
      
      // Process the API call in the background
      dispatch(rejectJob(jobId)).unwrap()
      .then(() => {
        toast.success("Job removed from your list");
      })
      .catch((error) => {
        console.error('Error rejecting job:', error);
        setErrorMsg("Failed to reject this job. Please try again.");
        toast.error("Failed to skip job");
        // Restore the cache if there was an error
        setJobsCache(filteredJobs);
      });
      
      // Move to next card with animation
      setTimeout(() => {
        const nextIndex = Math.min(currentIndex, updatedJobs.length - 1);
        setCurrentIndex(nextIndex);
        setDirection(null);
        
        // Only refresh job list after a sufficient delay
        setTimeout(() => {
          setActionLoading(false);
          // Refresh in background without affecting UI
          handleRefreshJobs(true);
        }, 500);
      }, 300);
    } catch (error) {
      console.error('Error rejecting job:', error);
      setActionLoading(false);
      setDirection(null);
      setErrorMsg("Failed to reject this job. Please try again.");
      toast.error("Failed to skip job");
    }
  };

  // Reset UI completely and refresh jobs
  const handleCompleteRefresh = () => {
    setCurrentIndex(0);
    setJobsCache([]);
    handleRefreshJobs(false);
  };

  // Format experience level for display
  const formatExperience = (experience) => {
    switch (experience) {
      case 'entry': return 'Entry Level (0-2 years)';
      case 'mid': return 'Mid Level (3-5 years)';
      case 'senior': return 'Senior Level (5+ years)';
      case 'lead': return 'Lead/Manager';
      case 'executive': return 'Executive';
      default: return experience;
    }
  };

  // No jobs case
  if (filteredJobs.length === 0) {
    return (
      <Card className="max-w-lg mx-auto mt-8 border-border bg-card shadow-md">
        <CardContent className="flex flex-col items-center justify-center p-10">
          <Briefcase className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Jobs Found</h3>
          <p className="text-muted-foreground text-center">
            There are no job opportunities available at the moment. Please check back later.
          </p>
          {errorMsg && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {errorMsg}
            </div>
          )}
          <Button 
            onClick={handleCompleteRefresh}
            className="mt-4"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Jobs'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // All jobs viewed case
  if (currentIndex >= filteredJobs.length) {
    return (
      <Card className="max-w-lg mx-auto mt-8 border-border bg-card shadow-md">
        <CardContent className="flex flex-col items-center justify-center p-10">
          <CheckCircle className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
          <p className="text-muted-foreground text-center">
            You've viewed all available job opportunities. Check back soon for new postings.
          </p>
          {errorMsg && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {errorMsg}
            </div>
          )}
          <div className="flex gap-3 mt-6">
            <Button 
              onClick={() => setCurrentIndex(0)}
              variant="outline"
            >
              Start Over
            </Button>
            <Button 
              onClick={handleCompleteRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Jobs'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const currentJob = filteredJobs[currentIndex];

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Find Your Next Opportunity</h2>
      
      {errorMsg && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          {errorMsg}
        </div>
      )}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentJob?._id || currentIndex}
          initial={{ x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ 
            x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0, 
            opacity: 0,
            transition: { duration: 0.3 }
          }}
          transition={{ type: 'spring', damping: 15 }}
          className="relative"
        >
          <Card className="border-border shadow-lg bg-card">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold">{currentJob.title}</CardTitle>
                  <div className="flex items-center mt-1 text-muted-foreground">
                    <Building2 className="h-4 w-4 mr-1" />
                    <span>{currentJob.company}</span>
                  </div>
                </div>
                <Badge variant={
                  currentJob.type === 'full-time' ? 'default' :
                  currentJob.type === 'part-time' ? 'secondary' :
                  currentJob.type === 'contract' ? 'outline' : 'default'
                }>{currentJob.type}</Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{currentJob.location}</span>
                </div>
                
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{formatExperience(currentJob.experience)}</span>
                </div>
                
                {currentJob.salary && (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span>{currentJob.salary?.min && currentJob.salary?.max ? `${currentJob.salary.currency} ${currentJob.salary.min} - ${currentJob.salary.max}` : 'Salary not specified'}</span>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {currentJob.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="font-normal">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Job Description</h4>
                <p className="text-sm text-muted-foreground">
                  {currentJob.description}
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between p-4 pt-2">
              <Button 
                onClick={handleReject} 
                variant="outline" 
                size="lg" 
                className="rounded-full w-14 h-14 p-0"
                disabled={actionLoading}
              >
                <XCircle className="h-8 w-8 text-destructive" />
              </Button>
              
              <Button 
                onClick={() => handleAccept(currentJob._id)} 
                variant="outline" 
                size="lg" 
                className="rounded-full w-14 h-14 p-0"
                disabled={actionLoading}
              >
                <CheckCircle className="h-8 w-8 text-success" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
      
      <div className="mt-6 text-center text-sm text-muted-foreground">
        {currentIndex + 1} of {filteredJobs.length} jobs
      </div>
    </div>
  );
};

export default JobBrowser; 