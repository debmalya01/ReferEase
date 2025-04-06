import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReferrals, updateReferralStatus } from '../../store/slices/referralSlice';
import Profile from '../profile/Profile';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const ApplicantReview = ({ jobId }) => {
  const dispatch = useDispatch();
  const { referrals, loading } = useSelector(state => state.referrals);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchReferrals());
  }, [dispatch]);

  // Filter referrals for the specific job with pending status
  const pendingApplicants = referrals.filter(
    ref => ref.job._id === jobId && ref.status === 'pending'
  );

  const handleAccept = async (referralId) => {
    setActionLoading(true);
    try {
      await dispatch(updateReferralStatus({ id: referralId, status: 'accepted' })).unwrap();
      // Simply advance to the next applicant without animations
      setTimeout(() => {
        setCurrentIndex(prevIndex => prevIndex + 1);
        setActionLoading(false);
      }, 300);
    } catch (error) {
      console.error('Error accepting applicant:', error);
      setActionLoading(false);
    }
  };

  const handleReject = async (referralId) => {
    setActionLoading(true);
    try {
      await dispatch(updateReferralStatus({ id: referralId, status: 'rejected' })).unwrap();
      // Simply advance to the next applicant without animations
      setTimeout(() => {
        setCurrentIndex(prevIndex => prevIndex + 1);
        setActionLoading(false);
      }, 300);
    } catch (error) {
      console.error('Error rejecting applicant:', error);
      setActionLoading(false);
    }
  };

  // No applicants case
  if (pendingApplicants.length === 0) {
    return (
      <Card className="max-w-lg mx-auto mt-8 border-0 shadow-md">
        <CardContent className="flex flex-col items-center justify-center p-10">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-primary/50" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Pending Applicants</h3>
          <p className="text-muted-foreground text-center">
            You've reviewed all applicants for this job. Check back later for new applicants.
          </p>
        </CardContent>
      </Card>
    );
  }

  // All applicants reviewed case
  if (currentIndex >= pendingApplicants.length) {
    return (
      <Card className="max-w-lg mx-auto mt-8 border-0 shadow-md">
        <CardContent className="flex flex-col items-center justify-center p-10">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-primary/50" />
          </div>
          <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
          <p className="text-muted-foreground text-center">
            You've reviewed all applicants for this job. Check back later for new applicants.
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

  const currentApplicant = pendingApplicants[currentIndex];

  return (
    <div className="max-w-4xl mx-auto p-4 pb-32">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Review Applicants</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentIndex(prev => Math.min(pendingApplicants.length - 1, prev + 1))}
            disabled={currentIndex === pendingApplicants.length - 1}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
      
      <div className="mb-2 text-center text-sm text-muted-foreground">
        Applicant {currentIndex + 1} of {pendingApplicants.length}
      </div>
      
      <div className="relative">
        <Profile 
          viewOnly={true}
          user={currentApplicant.applicant}
          isSwipeable={true}
          referralId={currentApplicant._id}
          onAccept={() => handleAccept(currentApplicant._id)}
          onReject={() => handleReject(currentApplicant._id)}
        />
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Click the check button to accept or the X button to reject this applicant
        </p>
      </div>
    </div>
  );
};

export default ApplicantReview; 