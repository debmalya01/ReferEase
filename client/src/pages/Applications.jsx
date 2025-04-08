import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { fetchJobs, fetchReferrals } from '../store/slices/jobSlice';
import { Building2, Users, CheckCircle, XCircle, Eye, Heart, Plus, Search } from 'lucide-react';

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
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header with gradient background */}
      <div className="relative rounded-xl bg-gradient-to-r from-primary/20 via-background to-card/80 p-6 shadow-md mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Applications</h1>
            <p className="text-muted-foreground">
              Manage your job posts and track your applications
            </p>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="posted" className="w-full">
        <TabsList className="mb-6 bg-card/70 border border-border/40 p-1">
          <TabsTrigger value="posted" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Building2 className="h-4 w-4 mr-2" />
            My Job Postings
          </TabsTrigger>
          <TabsTrigger value="applied" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Users className="h-4 w-4 mr-2" />
            My Applications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="posted">
          {postedJobs.length === 0 ? (
            <Card className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 shadow-md overflow-hidden">
              <CardContent className="p-8 text-center">
                <Building2 className="h-16 w-16 mx-auto text-primary/30 mb-4" />
                <h2 className="text-xl font-semibold mb-2 text-primary/90">No Jobs Posted</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  You haven't posted any job opportunities yet. Create your first job listing to find the perfect candidate.
                </p>
                <Button onClick={() => navigate('/post-job')} className="bg-primary hover:bg-primary/90 transition-colors">
                  <Plus className="h-4 w-4 mr-2" />
                  Post a Job
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {postedJobs.map((job) => {
                const counts = getApplicantCounts(job._id);
                return (
                  <Card key={job._id} className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 shadow-md overflow-hidden group">
                    <CardHeader className="border-b border-border/30 bg-card/70 pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl font-medium">{job.title}</CardTitle>
                          <CardDescription>{job.company}</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-secondary/80 border border-primary/20">{job.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-secondary/30 rounded-lg p-3 text-center transition-colors group-hover:bg-secondary/40">
                            <span className="text-sm text-muted-foreground block">Total</span>
                            <span className="text-xl font-bold text-primary">{counts.total}</span>
                          </div>
                          <div className="bg-secondary/30 rounded-lg p-3 text-center transition-colors group-hover:bg-secondary/40">
                            <span className="text-sm text-muted-foreground block">Pending</span>
                            <span className="text-xl font-bold text-primary">{counts.pending}</span>
                          </div>
                          <div className="bg-secondary/30 rounded-lg p-3 text-center transition-colors group-hover:bg-secondary/40">
                            <span className="text-sm text-muted-foreground block">Accepted</span>
                            <span className="text-xl font-bold text-green-500">{counts.accepted}</span>
                          </div>
                          <div className="bg-secondary/30 rounded-lg p-3 text-center transition-colors group-hover:bg-secondary/40">
                            <span className="text-sm text-muted-foreground block">Rejected</span>
                            <span className="text-xl font-bold text-destructive">{counts.rejected}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Button 
                            onClick={() => navigateToReviewApplicants(job._id)} 
                            className="w-full bg-primary/80 hover:bg-primary text-primary-foreground" 
                            disabled={counts.total === 0}
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Swipe Applicants 
                            {counts.pending > 0 && <Badge variant="secondary" className="ml-2 bg-secondary/80 border border-primary/20">{counts.pending}</Badge>}
                          </Button>
                          
                          <Button
                            variant="outline"
                            className="w-full border-primary/30 hover:bg-primary/10 hover:text-primary"
                            onClick={() => navigate(`/job/${job._id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Job Post
                          </Button>
                        </div>
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
            <Card className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 shadow-md overflow-hidden">
              <CardContent className="p-8 text-center">
                <Users className="h-16 w-16 mx-auto text-primary/30 mb-4" />
                <h2 className="text-xl font-semibold mb-2 text-primary/90">No Applications Yet</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  You haven't applied to any jobs yet. Browse available opportunities to find your next career move.
                </p>
                <Button onClick={() => navigate('/browse-jobs')} className="bg-primary hover:bg-primary/90 transition-colors">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Jobs
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {appliedJobs.map((application) => (
                <Card key={application._id} className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 shadow-md overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center p-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{application.job.title}</h3>
                          <p className="text-primary/80">{application.job.company}</p>
                          <div className="flex items-center mt-2">
                            {getStatusBadge(application.status)}
                            <span className="text-xs text-muted-foreground ml-2">
                              Applied on {new Date(application.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex items-center space-x-3">
                      {application.status === 'accepted' && (
                        <div className="flex items-center text-green-500 text-sm">
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/job/${application.job._id}`)}
                        className="border-primary/30 hover:bg-primary/10 hover:text-primary"
                      >
                        <Eye className="h-4 w-4 mr-1" /> View Job
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