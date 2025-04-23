const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Job = require('../models/Job');
const Referral = require('../models/Referral');
const User = require('../models/User');
const mongoose = require('mongoose');

// Helper function to safely create ObjectId
const toObjectId = (id) => {
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return new mongoose.Types.ObjectId(id.toString());
    }
    return null;
  } catch (error) {
    console.error(`Error converting to ObjectId: ${id}`, error);
    return null;
  }
};

// Get all jobs
router.get('/', auth, async (req, res) => {
  try {
    // Get the user ID from the auth token
    const userId = req.user.id;
    
    // Get the user to check for interacted jobs
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User:', userId);
    console.log('Interacted jobs:', user.interactedJobs);
    
    // Get IDs of jobs the user has already interacted with
    const interactedJobIds = user.interactedJobs.map(job => job.jobId.toString());
    console.log('Interacted job IDs:', interactedJobIds);
    
    // Build the query
    const query = { isActive: true };
    
    // Exclude user's own jobs
    query.postedBy = { $ne: userId };
    
    // Exclude jobs the user has already interacted with
    if (interactedJobIds.length > 0) {
      // Convert strings back to ObjectIds for the query
      const objectIdArray = interactedJobIds
        .map(id => toObjectId(id))
        .filter(id => id !== null);
        
      if (objectIdArray.length > 0) {
        query._id = { $nin: objectIdArray };
      }
    }
    
    console.log('Query:', JSON.stringify(query));
    
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    console.log(`Found ${jobs.length} jobs that match criteria`);
    
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get jobs posted by the current user
router.get('/my-jobs', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get job by id
router.get('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'firstName lastName email');
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get applicants for a specific job
router.get('/:id/applicants', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if the current user is the job poster
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Get all referrals for this job
    const referrals = await Referral.find({ job: req.params.id })
      .populate('referee', 'firstName lastName email phone location bio skills experience education projects')
      .populate('referrer', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json(referrals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update applicant status
router.put('/:jobId/applicants/:referralId', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if the current user is the job poster
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const referral = await Referral.findById(req.params.referralId);
    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }

    referral.status = status;
    referral.interactions.push({
      type: 'status',
      initiator: 'job_poster',
      content: `Status updated to ${status}`
    });

    await referral.save();

    // Return the updated referral with populated fields
    const updatedReferral = await Referral.findById(referral._id)
      .populate('referee', 'firstName lastName email phone location bio skills experience education projects')
      .populate('referrer', 'firstName lastName email');

    res.json(updatedReferral);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new job
router.post('/', auth, async (req, res) => {
  try {
    const { title, company, location, description, requirements, salary, jobType, experienceLevel, skills } = req.body;
    const job = new Job({
      title,
      company,
      location,
      description,
      requirements,
      salary,
      jobType,
      experienceLevel,
      skills,
      postedBy: req.user.id
    });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a job
router.put('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedJob);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a job
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await job.remove();
    res.json({ message: 'Job removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject a job (mark as not interested)
router.post('/:id/reject', auth, async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    console.log(`Rejecting job ${jobId} for user ${userId}`);

    // Ensure the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      console.log(`Job ${jobId} not found`);
      return res.status(404).json({ message: 'Job not found' });
    }

    console.log(`Found job: ${job.title}`);

    // Convert to valid ObjectId
    const jobObjectId = toObjectId(jobId);
    if (!jobObjectId) {
      console.log(`Invalid job ID format: ${jobId}`);
      return res.status(400).json({ message: 'Invalid job ID format' });
    }

    // Check if the job is already in interactedJobs
    const user = await User.findById(userId);
    const alreadyInteracted = user.interactedJobs.some(
      (item) => item.jobId.toString() === jobId.toString()
    );

    if (alreadyInteracted) {
      console.log(`Job ${jobId} already in user's interacted jobs`);
      return res.json({ 
        message: 'Job already rejected',
        user: user
      });
    }

    // Add to user's interacted jobs
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          interactedJobs: {
            jobId: jobObjectId,
            status: 'rejected',
            interactedAt: new Date()
          }
        }
      },
      { new: true }
    );

    console.log(`Updated user's interacted jobs:`, updatedUser.interactedJobs);

    res.json({ 
      message: 'Job rejected successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('Error rejecting job:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;