import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyJobs, updateApplicationStatus } from '../../features/jobs/jobSlice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Briefcase, Users, CheckCircle2, XCircle } from 'lucide-react';
import ApplicantCard from '../../components/jobs/ApplicantCard';

const ManageJobs = () => {
  const dispatch = useDispatch();
  const { myJobs, loading, error } = useSelector((state) => state.jobs);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    dispatch(getMyJobs());
  }, [dispatch]);

  const handleUpdateStatus = async (jobId, applicantId, status) => {
    await dispatch(updateApplicationStatus({ jobId, applicantId, status }));
    dispatch(getMyJobs()); // Refresh the list
  };

  const getApplicantCount = (job) => {
    return job.applicants.length;
  };

  const getPendingCount = (job) => {
    return job.applicants.filter(app => app.status === 'pending').length;
  };

  const getSelectedCount = (job) => {
    return job.applicants.filter(app => app.status === 'selected').length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Manage Job Postings</h1>
        <p className="text-muted-foreground">
          Review and manage your job postings and applicants
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading your jobs...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : (
        <Tabs defaultValue={myJobs[0]?._id} className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myJobs.map((job) => (
              <TabsTrigger
                key={job._id}
                value={job._id}
                className="flex flex-col items-start p-4"
                onClick={() => setSelectedJob(job)}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <h3 className="font-semibold">{job.title}</h3>
                  <Badge variant={job.status === 'active' ? 'success' : 'secondary'}>
                    {job.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{getApplicantCount(job)} applicants</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    <span>{getSelectedCount(job)} selected</span>
                  </div>
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 mr-1" />
                    <span>{getPendingCount(job)} pending</span>
                  </div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {myJobs.map((job) => (
            <TabsContent key={job._id} value={job._id} className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{job.title}</h2>
                    <p className="text-muted-foreground">{job.company}</p>
                  </div>
                  <Button variant="outline">
                    Edit Job
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p>{job.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p>{job.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p>{job.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Salary</p>
r                    <p>{job.salary?.min && job.salary?.max ? `${job.salary.currency} ${job.salary.min} - ${job.salary.max}` : 'Salary not specified'}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{job.description}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Applicants</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {job.applicants.map((applicant) => (
                    <ApplicantCard
                      key={applicant._id}
                      applicant={applicant.user}
                      status={applicant.status}
                      onAccept={() => handleUpdateStatus(job._id, applicant._id, 'selected')}
                      onReject={() => handleUpdateStatus(job._id, applicant._id, 'rejected')}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default ManageJobs; 