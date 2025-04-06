import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThumbsDown, ThumbsUp, Plus, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { fetchJobs } from '../store/slices/jobSlice';
import { createReferral } from '../store/slices/referralSlice';
import JobForm from '../components/JobForm';

const JobExplorer = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { jobs, loading } = useSelector((state) => state.jobs);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    experienceLevel: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);

  useEffect(() => {
    dispatch(fetchJobs(filters));
  }, [dispatch, filters]);

  const handleSwipe = async (direction) => {
    if (currentJobIndex >= jobs.length) return;

    const currentJob = jobs[currentJobIndex];
    if (direction === 'right' && user.role === 'referee') {
      await dispatch(createReferral({
        jobId: currentJob._id,
        refereeId: user._id,
      }));
    }

    setCurrentJobIndex(currentJobIndex + 1);
  };

  const currentJob = jobs[currentJobIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Job Explorer</h1>
        {user.role === 'referrer' && (
          <Button onClick={() => setShowJobForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="mb-4"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full px-4 py-2 rounded-md border border-input bg-background"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <input
              type="text"
              placeholder="Location"
              className="w-full px-4 py-2 rounded-md border border-input bg-background"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
            <select
              className="w-full px-4 py-2 rounded-md border border-input bg-background"
              value={filters.jobType}
              onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
            >
              <option value="">All Job Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
            </select>
            <select
              className="w-full px-4 py-2 rounded-md border border-input bg-background"
              value={filters.experienceLevel}
              onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
            >
              <option value="">All Experience Levels</option>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
            </select>
          </div>
        )}
      </div>

      {/* Job Card */}
      {currentJob ? (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{currentJob.title}</CardTitle>
            <CardDescription>
              {currentJob.company} • {currentJob.location}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{currentJob.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {currentJob.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Salary: ${currentJob.salary.min} - ${currentJob.salary.max} {currentJob.salary.currency}
            </p>
          </CardContent>
          <CardFooter className="justify-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleSwipe('left')}
              disabled={loading}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
            {user.role === 'referee' && (
              <Button
                variant="default"
                size="icon"
                onClick={() => handleSwipe('right')}
                disabled={loading}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-muted-foreground">
            No more jobs to show
          </h2>
        </div>
      )}

      {/* Job Form Dialog */}
      <JobForm isOpen={showJobForm} onClose={() => setShowJobForm(false)} />
    </div>
  );
};

export default JobExplorer; 