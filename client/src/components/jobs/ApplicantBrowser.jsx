import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { fetchReferrals, updateReferralStatus } from '../../store/slices/referralSlice';
import { CheckCircle, XCircle, Briefcase, Mail, Award, GraduationCap, Github, Linkedin, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ApplicantBrowser = ({ jobId }) => {
  const dispatch = useDispatch();
  const { referrals, loading } = useSelector((state) => state.jobs);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const filteredReferrals = referrals
    ? referrals.filter(ref => ref.job._id === jobId && ref.status === 'pending')
    : [];

  useEffect(() => {
    dispatch(fetchReferrals());
  }, [dispatch]);

  const handleAccept = async (referralId) => {
    setActionLoading(true);
    try {
      await dispatch(updateReferralStatus({ id: referralId, status: 'accepted' })).unwrap();
      setDirection('right');
      setTimeout(() => {
        setCurrentIndex(prevIndex => prevIndex + 1);
        setDirection(null);
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
      setDirection('left');
      setTimeout(() => {
        setCurrentIndex(prevIndex => prevIndex + 1);
        setDirection(null);
        setActionLoading(false);
      }, 300);
    } catch (error) {
      console.error('Error rejecting applicant:', error);
      setActionLoading(false);
    }
  };

  // No applicants case
  if (filteredReferrals.length === 0) {
    return (
      <Card className="max-w-lg mx-auto mt-8 border-0 shadow-md">
        <CardContent className="flex flex-col items-center justify-center p-10">
          <Briefcase className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Applicants Yet</h3>
          <p className="text-muted-foreground text-center">
            There are no applicants for this job posting yet. Check back later.
          </p>
        </CardContent>
      </Card>
    );
  }

  // All applicants reviewed case
  if (currentIndex >= filteredReferrals.length) {
    return (
      <Card className="max-w-lg mx-auto mt-8 border-0 shadow-md">
        <CardContent className="flex flex-col items-center justify-center p-10">
          <CheckCircle className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
          <p className="text-muted-foreground text-center">
            You've reviewed all applicants for this job. Check back soon for new applications.
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

  const currentReferral = filteredReferrals[currentIndex];
  const applicant = currentReferral.applicant;

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Review Job Applicants</h2>
      
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
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold">
                    {applicant.firstName} {applicant.lastName}
                  </CardTitle>
                  <div className="flex items-center mt-1 text-muted-foreground">
                    <Mail className="h-4 w-4 mr-1" />
                    <span>{applicant.email}</span>
                  </div>
                </div>
                <Badge variant="secondary">Applicant</Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Experience */}
              <div>
                <h4 className="font-medium mb-2">Experience</h4>
                <div className="space-y-2">
                  {applicant.experience?.map((exp, index) => (
                    <div key={index} className="bg-slate-50 p-3 rounded-md">
                      <div className="font-medium">{exp.role}</div>
                      <div className="text-sm">{exp.company}</div>
                      <div className="text-xs text-muted-foreground">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </div>
                      <p className="text-sm mt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Education */}
              <div>
                <h4 className="font-medium mb-2">Education</h4>
                <div className="space-y-2">
                  {applicant.education?.map((edu, index) => (
                    <div key={index} className="bg-slate-50 p-3 rounded-md flex items-start">
                      <GraduationCap className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{edu.degree}</div>
                        <div className="text-sm">{edu.institution}</div>
                        <div className="text-xs text-muted-foreground">{edu.year}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Skills */}
              <div>
                <h4 className="font-medium mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {applicant.skills?.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="font-normal">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Projects */}
              {applicant.projects && applicant.projects.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Notable Projects</h4>
                  <div className="space-y-2">
                    {applicant.projects.map((project, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium">{project.name}</div>
                        <p className="text-muted-foreground">{project.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Social Links */}
              <div className="flex space-x-4 pt-2">
                {applicant.githubUrl && (
                  <a href={applicant.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {applicant.linkedinUrl && (
                  <a href={applicant.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {applicant.portfolioUrl && (
                  <a href={applicant.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                    <Globe className="h-5 w-5" />
                  </a>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between p-4 pt-2">
              <Button 
                onClick={() => handleReject(currentReferral._id)} 
                variant="outline" 
                size="lg" 
                className="rounded-full w-14 h-14 p-0"
                disabled={actionLoading}
              >
                <XCircle className="h-8 w-8 text-destructive" />
              </Button>
              
              <Button 
                onClick={() => handleAccept(currentReferral._id)} 
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
        {currentIndex + 1} of {filteredReferrals.length} applicants
      </div>
    </div>
  );
};

export default ApplicantBrowser; 