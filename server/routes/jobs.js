const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Job = require('../models/Job');
const Referral = require('../models/Referral');

// Get all jobs
router.get('/', auth, async (req, res) => {
  try {
    // Get the user ID from the auth token
    const userId = req.user.id;
    
    // Build the query
    const query = { isActive: true };
    
    // Exclude user's own jobs
    query.postedBy = { $ne: userId };
    
    const jobs = await Job.find(query).sort({ createdAt: -1 });
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
      type: 'message',
      initiator: 'referrer',
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

module.exports = router;