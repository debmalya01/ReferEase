import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getJobs, applyForJob } from '../../features/jobs/jobSlice';
import JobCard from '../../components/jobs/JobCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Search, Filter } from 'lucide-react';

const BrowseJobs = () => {
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    experience: '',
  });

  useEffect(() => {
    dispatch(getJobs());
  }, [dispatch]);

  const handleApply = async (jobId) => {
    await dispatch(applyForJob(jobId));
  };

  const handleReject = (jobId) => {
    // Handle job rejection (optional)
    console.log('Job rejected:', jobId);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(filters.search.toLowerCase()));

    const matchesType = !filters.type || job.type === filters.type;
    const matchesExperience = !filters.experience || job.experience === filters.experience;

    return matchesSearch && matchesType && matchesExperience;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Browse Job Opportunities</h1>
        <p className="text-muted-foreground">
          Find and apply for jobs that match your skills and experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs, companies, or skills"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-9"
            />
          </div>
        </div>
        <div>
          <Select
            value={filters.type}
            onValueChange={(value) => setFilters({ ...filters, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={filters.experience}
            onValueChange={(value) => setFilters({ ...filters, experience: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Experience Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Levels</SelectItem>
              <SelectItem value="entry">Entry Level</SelectItem>
              <SelectItem value="mid">Mid Level</SelectItem>
              <SelectItem value="senior">Senior Level</SelectItem>
              <SelectItem value="lead">Lead/Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading jobs...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onAccept={() => handleApply(job._id)}
              onReject={() => handleReject(job._id)}
              status={job.applicants?.find(app => app.user === user?._id)?.status}
            />
          ))}
        </div>
      )}

      {!loading && !error && filteredJobs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No jobs found matching your criteria</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setFilters({ search: '', type: '', experience: '' })}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default BrowseJobs; 