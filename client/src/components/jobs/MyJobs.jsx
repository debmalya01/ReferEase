import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyJobs } from '../../store/slices/jobSlice';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Briefcase, MapPin, Building2, Users, ChevronRight } from 'lucide-react';

const MyJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myJobs, loading } = useSelector(state => state.jobs);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchMyJobs());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="inline-block p-4 bg-primary/10 rounded-full text-primary animate-pulse mb-4">
            <Briefcase className="h-10 w-10" />
          </div>
          <p className="text-lg text-muted-foreground ml-4">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  if (myJobs.length === 0) {
    return (
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Card className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 shadow-md overflow-hidden">
            <CardContent className="p-12 text-center">
              <Briefcase className="h-16 w-16 mx-auto text-primary/30 mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-primary/90">No Jobs Posted Yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You haven't posted any jobs yet. Create your first job posting to start receiving applications.
              </p>
              <Button 
                onClick={() => navigate('/post-job')} 
                className="bg-primary hover:bg-primary/90 transition-colors"
              >
                Post a Job
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Job Postings</h1>
        <Button onClick={() => navigate('/post-job')}>
          Post New Job
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myJobs.map((job) => (
          <Card key={job._id} className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 shadow-md overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold">{job.title}</CardTitle>
                  <div className="flex items-center mt-1 text-muted-foreground">
                    <Building2 className="h-4 w-4 mr-1" />
                    <span>{job.company}</span>
                  </div>
                </div>
                <Badge variant={
                  job.type === 'full-time' ? 'default' :
                  job.type === 'part-time' ? 'secondary' :
                  job.type === 'contract' ? 'outline' : 'default'
                }>{job.type}</Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{job.location}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/review-applicants/${job._id}`)}
                  className="flex items-center"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Review Applicants
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyJobs; 