import React from 'react';
import JobBrowser from '../components/jobs/JobBrowser';

const BrowseJobs = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Browse Job Opportunities</h1>
        <p className="text-muted-foreground">
          Swipe through available job opportunities. Swipe right to apply or left to skip.
          Find your perfect match!
        </p>
      </div>
      
      <JobBrowser />
    </div>
  );
};

export default BrowseJobs; 