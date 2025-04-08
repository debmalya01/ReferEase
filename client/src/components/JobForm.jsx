import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { createJob } from '../store/slices/jobSlice';

const JobForm = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: [''],
    salary: {
      min: '',
      max: '',
      currency: 'USD',
    },
    jobType: '',
    experienceLevel: '',
    skills: [''],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleArrayChange = (type, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleAddItem = (type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], ''],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createJob(formData));
    if (!result.error) {
      setFormData({
        title: '',
        company: '',
        location: '',
        description: '',
        requirements: [''],
        salary: {
          min: '',
          max: '',
          currency: 'USD',
        },
        jobType: '',
        experienceLevel: '',
        skills: [''],
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Post New Job</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-secondary"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-secondary"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border border-input bg-secondary"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 rounded-md border border-input bg-secondary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Salary</label>
              <input
                type="number"
                name="salary.min"
                value={formData.salary.min}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-secondary"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Maximum Salary</label>
              <input
                type="number"
                name="salary.max"
                value={formData.salary.max}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-secondary"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Type</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-secondary"
                required
              >
                <option value="">Select Job Type</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Experience Level</label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-secondary"
                required
              >
                <option value="">Select Experience Level</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Requirements</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddItem('requirements')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Requirement
              </Button>
            </div>
            {formData.requirements.map((req, index) => (
              <input
                key={index}
                type="text"
                value={req}
                onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-secondary"
                placeholder={`Requirement ${index + 1}`}
                required
              />
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Skills</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddItem('skills')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Skill
              </Button>
            </div>
            {formData.skills.map((skill, index) => (
              <input
                key={index}
                type="text"
                value={skill}
                onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-secondary"
                placeholder={`Skill ${index + 1}`}
                required
              />
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Post Job</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobForm; 