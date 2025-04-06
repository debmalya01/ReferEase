import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyApplications } from '../../features/jobs/jobSlice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Briefcase, Clock, CheckCircle2, XCircle } from 'lucide-react';
import JobCard from '../../components/jobs/JobCard';

const MyApplications = () => {
  const dispatch = useDispatch();
  const { myApplications, loading, error } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(getMyApplications());
  }, [dispatch]);

  const getApplicationsByStatus = (status) => {
    return myApplications.filter(job => {
      const application = job.applicants.find(app => app.user === job._id);
      return application?.status === status;
    });
  };

  const pendingApplications = getApplicationsByStatus('pending');
  const acceptedApplications = getApplicationsByStatus('selected');
  const rejectedApplications = getApplicationsByStatus('rejected');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">My Applications</h1>
        <p className="text-muted-foreground">
          Track the status of your job applications
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading your applications...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : (
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Pending</span>
              <Badge variant="secondary" className="ml-2">
                {pendingApplications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="accepted" className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Selected</span>
              <Badge variant="secondary" className="ml-2">
                {acceptedApplications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center space-x-2">
              <XCircle className="h-4 w-4" />
              <span>Not Selected</span>
              <Badge variant="secondary" className="ml-2">
                {rejectedApplications.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingApplications.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  status="pending"
                />
              ))}
            </div>
            {pendingApplications.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No pending applications</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {acceptedApplications.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  status="selected"
                />
              ))}
            </div>
            {acceptedApplications.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No selected applications</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rejectedApplications.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  status="rejected"
                />
              ))}
            </div>
            {rejectedApplications.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No rejected applications</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default MyApplications; 