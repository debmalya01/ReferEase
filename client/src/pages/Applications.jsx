import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { fetchJobs, fetchReferrals } from '../store/slices/jobSlice';
import { Building2, Users, CheckCircle, XCircle, Eye, Heart } from 'lucide-react';

const Applications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { jobs, referrals, loading } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchReferrals());
  }, [dispatch]);

  // Get the jobs posted by the current user
  const postedJobs = jobs?.filter(job => job.postedBy === user?._id) || [];
  
  // Get the jobs applied to by the current user
  const appliedJobs = referrals?.filter(ref => ref.applicant === user?._id) || [];
  
  // Count applicants for each job
  const getApplicantCounts = (jobId) => {
    const applicants = referrals?.filter(ref => ref.job._id === jobId) || [];
    return {
      total: applicants.length,
      pending: applicants.filter(app => app.status === 'pending').length,
      accepted: applicants.filter(app => app.status === 'accepted').length,
      rejected: applicants.filter(app => app.status === 'rejected').length,
    };
  };

  const navigateToReviewApplicants = (jobId) => {
    navigate(`/review-applicants/${jobId}`);
  };

  // Format the status to display it properly
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'accepted':
        return <Badge variant="success">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Applications</h1>
      
      <Tabs defaultValue="posted">
        <TabsList className="mb-6">
          <TabsTrigger value="posted">My Job Postings</TabsTrigger>
          <TabsTrigger value="applied">My Applications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posted">
          {postedJobs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Jobs Posted</h2>
                <p className="text-muted-foreground mb-4">
                  You haven't posted any job opportunities yet.
                </p>
                <Button onClick={() => navigate('/post-job')}>
                  Post a Job
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {postedJobs.map((job) => {
                const counts = getApplicantCounts(job._id);
                return (
                  <Card key={job._id} className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
                    <CardHeader>
                      <CardTitle>{job.title}</CardTitle>
                      <CardDescription>{job.company}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">Total Applicants</span>
                            <span className="font-semibold">{counts.total}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">Pending</span>
                            <span className="font-semibold">{counts.pending}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">Accepted</span>
                            <span className="font-semibold">{counts.accepted}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">Rejected</span>
                            <span className="font-semibold">{counts.rejected}</span>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => navigateToReviewApplicants(job._id)} 
                          className="w-full" 
                          disabled={counts.total === 0}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Review Applicants 
                          {counts.pending > 0 && ` (${counts.pending} pending)`}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="applied">
          {appliedJobs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Applications Yet</h2>
                <p className="text-muted-foreground mb-4">
                  You haven't applied to any jobs yet. Browse available opportunities.
                </p>
                <Button onClick={() => navigate('/browse-jobs')}>
                  Browse Jobs
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {appliedJobs.map((application) => (
                <Card key={application._id} className="border-0 shadow-md">
                  <div className="flex flex-col md:flex-row md:items-center p-6">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{application.job.title}</h3>
                      <p className="text-muted-foreground">{application.job.company}</p>
                      <div className="flex items-center mt-2">
                        {getStatusBadge(application.status)}
                        <span className="text-xs text-muted-foreground ml-2">
                          Applied on {new Date(application.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex items-center space-x-3">
                      {application.status === 'accepted' && (
                        <div className="flex items-center text-success text-sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>Accepted</span>
                        </div>
                      )}
                      {application.status === 'rejected' && (
                        <div className="flex items-center text-destructive text-sm">
                          <XCircle className="h-4 w-4 mr-1" />
                          <span>Rejected</span>
                        </div>
                      )}
                      <Button variant="outline" size="sm" onClick={() => navigate(`/job/${application.job._id}`)}>
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Applications; 