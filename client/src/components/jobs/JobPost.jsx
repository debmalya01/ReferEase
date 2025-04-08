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
    type: 'full-time',
    experience: 'entry',
    salary: '',
    skills: '',
    description: ''
  });

  // Use external loading state if provided, otherwise use internal
  const loading = externalLoading !== undefined ? externalLoading : internalLoading;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value, name) => {
    setJobData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert skills string to array
    const formattedData = {
      ...jobData,
      skills: jobData.skills.split(',').map(skill => skill.trim())
    };
    
    if (onSubmit) {
      // Use the external onSubmit function if provided
      onSubmit(formattedData);
    } else {
      // Otherwise use the internal logic
      setInternalLoading(true);
      try {
        // Your internal submit logic here if needed
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
                <Label htmlFor="salary">Salary Range</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="salary"
                    name="salary"
                    placeholder="e.g. $80,000 - $100,000"
                    value={jobData.salary}
                    onChange={handleChange}
                    className="pl-10 border-border bg-secondary"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Job Type</Label>
                <Select
                  value={jobData.type}
                  onValueChange={(value) => handleSelectChange(value, 'type')}
                >
                  <SelectTrigger className="border-border bg-secondary">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <Select
                  value={jobData.experience}
                  onValueChange={(value) => handleSelectChange(value, 'experience')}
                >
                  <SelectTrigger className="border-border bg-secondary">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                    <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                    <SelectItem value="senior">Senior Level (5+ years)</SelectItem>
                    <SelectItem value="lead">Lead/Manager</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills</Label>
              <div className="relative">
                <Award className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="skills"
                  name="skills"
                  placeholder="e.g. React, Node.js, MongoDB (comma separated)"
                  value={jobData.skills}
                  onChange={handleChange}
                  className="pl-10 border-border bg-secondary"
                />
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