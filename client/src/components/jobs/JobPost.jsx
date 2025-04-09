import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Briefcase, Building2, MapPin, CreditCard, Award } from 'lucide-react';

const JobPost = ({ onSubmit, loading: externalLoading, error, onClose }) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: 'full-time',
    experienceLevel: 'entry',
    salary: {
      min: '',
      max: '',
      currency: 'USD'
    },
    skills: [],
    description: '',
    requirements: ['']
  });

  // Use external loading state if provided, otherwise use internal
  const loading = externalLoading !== undefined ? externalLoading : internalLoading;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setJobData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setJobData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (value, name) => {
    setJobData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setJobData(prev => ({
      ...prev,
      skills
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!jobData.title || !jobData.company || !jobData.location || !jobData.description) {
      console.error('Missing required fields');
      return;
    }

    // Convert salary strings to numbers
    const formattedData = {
      ...jobData,
      salary: {
        ...jobData.salary,
        min: Number(jobData.salary.min),
        max: Number(jobData.salary.max)
      }
    };
    
    if (onSubmit) {
      onSubmit(formattedData);
    } else {
      setInternalLoading(true);
      try {
        setInternalLoading(false);
        if (onClose) onClose();
      } catch (error) {
        setInternalLoading(false);
        console.error('Failed to post job:', error);
      }
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto border-border shadow-md bg-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Post a Job Opportunity</CardTitle>
        <CardDescription>Fill out the details to create a new job posting</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-destructive/20 border border-destructive text-destructive-foreground rounded-md">
            {error.message || 'An error occurred while posting the job.'}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g. Frontend Developer"
                    value={jobData.title}
                    onChange={handleChange}
                    className="pl-10 border-border bg-secondary"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="company"
                    name="company"
                    placeholder="e.g. Acme Inc."
                    value={jobData.company}
                    onChange={handleChange}
                    className="pl-10 border-border bg-secondary"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g. Remote, New York, etc."
                    value={jobData.location}
                    onChange={handleChange}
                    className="pl-10 border-border bg-secondary"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salary.min">Minimum Salary</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="salary.min"
                    name="salary.min"
                    type="number"
                    placeholder="e.g. 80000"
                    value={jobData.salary.min}
                    onChange={handleChange}
                    className="pl-10 border-border bg-secondary"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary.max">Maximum Salary</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="salary.max"
                    name="salary.max"
                    type="number"
                    placeholder="e.g. 100000"
                    value={jobData.salary.max}
                    onChange={handleChange}
                    className="pl-10 border-border bg-secondary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type</Label>
                <Select
                  value={jobData.jobType}
                  onValueChange={(value) => handleSelectChange(value, 'jobType')}
                >
                  <SelectTrigger className="border-border bg-secondary">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Select
                  value={jobData.experienceLevel}
                  onValueChange={(value) => handleSelectChange(value, 'experienceLevel')}
                >
                  <SelectTrigger className="border-border bg-secondary">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Required Skills</Label>
                <div className="relative">
                  <Award className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="skills"
                    name="skills"
                    placeholder="e.g. React, Node.js, MongoDB (comma separated)"
                    value={jobData.skills.join(', ')}
                    onChange={handleSkillsChange}
                    className="pl-10 border-border bg-secondary"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter detailed job description, responsibilities, and requirements..."
                value={jobData.description}
                onChange={handleChange}
                className="min-h-[150px] border-border bg-secondary"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Posting...' : 'Post Job'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobPost; 