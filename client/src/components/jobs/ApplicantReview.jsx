import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplicants, updateApplicantStatus, setCurrentIndex } from '../../store/slices/applicantSlice';
import Profile from '../profile/Profile';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { X, Check, ChevronLeft, ChevronRight, User, ThumbsUp, ThumbsDown, Star, Award } from 'lucide-react';
import { Badge } from '../ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="max-w-lg mx-auto mt-8 border-border bg-card shadow-md">
          <CardContent className="flex flex-col items-center justify-center p-10">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <X className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-red-500">Something went wrong</h3>
            <p className="text-muted-foreground text-center">
              There was an error loading the applicant review interface.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="mt-4"
              variant="outline"
            >
              Reload Page
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

const ApplicantReview = ({ jobId }) => {
  const dispatch = useDispatch();
  const { applicants = [], loading = false, error = null, currentIndex = 0 } = useSelector(state => state.applicants || {});
  const pendingApplicants = applicants.filter(app => app.status === 'pending');
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    if (jobId) {
      dispatch(fetchApplicants(jobId));
    }
  }, [dispatch, jobId]);

  const handleAccept = async () => {
    setIsAccepting(true);
    const currentApplicant = pendingApplicants[currentIndex];
    if (currentApplicant) {
      await dispatch(updateApplicantStatus({
        jobId,
        referralId: currentApplicant._id,
        status: 'accepted'
      }));
      dispatch(setCurrentIndex(Math.min(currentIndex + 1, pendingApplicants.length - 1)));
    }
    setIsAccepting(false);
  };

  const handleReject = async () => {
    setIsRejecting(true);
    const currentApplicant = pendingApplicants[currentIndex];
    if (currentApplicant) {
      await dispatch(updateApplicantStatus({
        jobId,
        referralId: currentApplicant._id,
        status: 'rejected'
      }));
      dispatch(setCurrentIndex(Math.min(currentIndex + 1, pendingApplicants.length - 1)));
    }
    setIsRejecting(false);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-lg mx-auto mt-8 mb-32"
      >
        <Card className="border-border bg-card shadow-md">
          <CardContent className="flex flex-col items-center justify-center p-10">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-pulse">
              <User className="h-8 w-8 text-primary/50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Loading Applicants...</h3>
            <p className="text-muted-foreground text-center">
              Please wait while we fetch the applicants.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-lg mx-auto mt-8 mb-32"
      >
        <Card className="border-border bg-card shadow-md">
          <CardContent className="flex flex-col items-center justify-center p-10">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <X className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-red-500">Error Loading Applicants</h3>
            <p className="text-muted-foreground text-center mb-4">
              {error === 'No applicants found' 
                ? 'There are no applicants to review for this job posting.'
                : 'There was an error loading the applicants. Please try again later.'}
            </p>
            <Button 
              variant="outline" 
              onClick={() => dispatch(fetchApplicants(jobId))}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!Array.isArray(applicants) || pendingApplicants.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-lg mx-auto mt-8 mb-32"
      >
        <Card className="border-border bg-card shadow-md">
          <CardContent className="flex flex-col items-center justify-center p-10">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-primary/50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Pending Applicants</h3>
            <p className="text-muted-foreground text-center">
              There are no pending applicants for this job at the moment.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const currentApplicant = pendingApplicants[currentIndex];
  if (!currentApplicant || !currentApplicant.referee) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-lg mx-auto mt-8"
      >
        <Card className="border-border bg-card shadow-md">
          <CardContent className="flex flex-col items-center justify-center p-10">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <X className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-red-500">Invalid Applicant Data</h3>
            <p className="text-muted-foreground text-center">
              The applicant data appears to be invalid or incomplete.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const applicant = currentApplicant.referee;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-4 pb-32"
    >
      {/* Header Section with Progress and Quick Info */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold flex items-center">
              <Award className="h-6 w-6 mr-2 text-primary" />
              Review Applicants
            </h2>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => dispatch(setCurrentIndex(Math.max(0, currentIndex - 1)))}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => dispatch(setCurrentIndex(Math.min(pendingApplicants.length - 1, currentIndex + 1)))}
                disabled={currentIndex === pendingApplicants.length - 1}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} of {pendingApplicants.length}
            </span>
            <div className="flex space-x-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleReject}
                disabled={isRejecting}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                {isRejecting ? 'Rejecting...' : 'Reject'}
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleAccept}
                disabled={isAccepting}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                {isAccepting ? 'Accepting...' : 'Accept'}
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-secondary rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / pendingApplicants.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Quick Applicant Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground bg-secondary/30 p-3 rounded-lg">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-primary" />
            <span className="font-medium">{applicant.firstName} {applicant.lastName}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">Email:</span>
            <span className="ml-2">{applicant.email}</span>
          </div>
          {applicant.phone && (
            <div className="flex items-center">
              <span className="font-medium">Phone:</span>
              <span className="ml-2">{applicant.phone}</span>
            </div>
          )}
          {applicant.location && (
            <div className="flex items-center">
              <span className="font-medium">Location:</span>
              <span className="ml-2">{applicant.location}</span>
            </div>
          )}
          {applicant.skills && applicant.skills.length > 0 && (
            <div className="flex items-center">
              <span className="font-medium">Skills:</span>
              <div className="flex flex-wrap gap-1 ml-2">
                {applicant.skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="font-normal">
                    {skill}
                  </Badge>
                ))}
                {applicant.skills.length > 3 && (
                  <Badge variant="secondary" className="font-normal">
                    +{applicant.skills.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Profile View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-border bg-card shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Star className="h-5 w-5 mr-2 text-primary" />
              Full Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Profile 
              viewOnly={true}
              user={applicant}
              isSwipeable={true}
              referralId={currentApplicant._id}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

const WrappedApplicantReview = (props) => (
  <ErrorBoundary>
    <ApplicantReview {...props} />
  </ErrorBoundary>
);

export default WrappedApplicantReview; 