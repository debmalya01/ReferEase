import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { fetchJobs } from '../../store/slices/jobSlice';
import { createReferral } from '../../store/slices/referralSlice';
import { CheckCircle, XCircle, MapPin, Clock, Building2, Award, CreditCard, Briefcase, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const JobBrowser = () => {
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((state) => state.jobs);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  // No need to filter jobs here as the server handles it
  const filteredJobs = jobs;

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleAccept = async (jobId) => {
    setActionLoading(true);
    try {
      const job = filteredJobs.find(j => j._id === jobId);
      if (!job) {
        throw new Error('Job not found');
      }

      await dispatch(createReferral({ 
        jobId, 
        referrerId: job.postedBy,
        status: 'pending' 
      })).unwrap();
      setDirection('right');
      setTimeout(() => {
        setCurrentIndex(prevIndex => prevIndex + 1);
        setDirection(null);
        setActionLoading(false);
      }, 300);
    } catch (error) {
      console.error('Error accepting job:', error);
      setActionLoading(false);
    }
  };

  const handleReject = () => {
    setDirection('left');
    setTimeout(() => {
      setCurrentIndex(prevIndex => prevIndex + 1);
      setDirection(null);
    }, 300);
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
          <Button 
            className="mt-6" 
            onClick={() => setCurrentIndex(0)}
          >
            Start Over
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentJob = filteredJobs[currentIndex];

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Find Your Next Opportunity</h2>
      
      <AnimatePresence>
        <motion.div
          key={currentIndex}
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