import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getJobs, applyForJob } from '../../features/jobs/jobSlice';
import JobCard from '../../components/jobs/JobCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Search, Filter, Crown, Building2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

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
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header with gradient background */}
      <div className="relative rounded-xl bg-gradient-to-r from-primary/20 via-background to-card/80 p-6 shadow-md">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-primary mb-2">Browse Opportunities</h1>
          <p className="text-muted-foreground">
            Find and apply for jobs that match your skills and experience
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 shadow-md overflow-hidden">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-primary" />
                <Input
                  placeholder="Search jobs, companies, or skills"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-9 border-border bg-secondary/70 focus:bg-secondary"
                />
              </div>
            </div>
            <div>
              <Select
                value={filters.type}
                onValueChange={(value) => setFilters({ ...filters, type: value })}
              >
                <SelectTrigger className="border-border bg-secondary/70 hover:bg-secondary focus:bg-secondary">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
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
                <SelectTrigger className="border-border bg-secondary/70 hover:bg-secondary focus:bg-secondary">
                  <SelectValue placeholder="Experience Level" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="">All Levels</SelectItem>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                  <SelectItem value="lead">Lead/Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="p-12 text-center">
          <div className="inline-block p-4 bg-primary/10 rounded-full text-primary animate-pulse mb-4">
            <Crown className="h-10 w-10" />
          </div>
          <p className="text-lg text-muted-foreground">Loading opportunities...</p>
        </div>
      ) : error ? (
        <div className="p-12 text-center text-destructive bg-destructive/10 rounded-xl border border-destructive/20">
          <p className="font-medium">{error}</p>
        </div>
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
        <Card className="border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 shadow-md overflow-hidden">
          <CardContent className="p-12 text-center">
            <Building2 className="h-16 w-16 mx-auto text-primary/30 mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-primary/90">No Jobs Found</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't find any jobs matching your filters. Try adjusting your search criteria.
            </p>
            <Button
              variant="outline"
              className="border-primary/30 hover:bg-primary/10 hover:text-primary"
              onClick={() => setFilters({ search: '', type: '', experience: '' })}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BrowseJobs; 