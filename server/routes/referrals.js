const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Referral = require('../models/Referral');
const User = require('../models/User');

// Get all referrals for a user (either as referee, referrer, or job poster)
router.get('/', auth, async (req, res) => {
  try {
    // First, get all referrals
    const referrals = await Referral.find()
      .populate({
        path: 'job',
        populate: {
          path: 'postedBy',
          select: 'firstName lastName email'
        }
      })
      .populate('referee', 'firstName lastName email phone location bio skills experience education projects')
      .populate('referrer', 'firstName lastName email')
      .sort({ createdAt: -1 });

    // Then filter based on permissions
    const filteredReferrals = referrals.filter(ref => {
      const isReferee = ref.referee._id.toString() === req.user.id;
      const isReferrer = ref.referrer._id.toString() === req.user.id;
      const isJobPoster = ref.job.postedBy._id.toString() === req.user.id;
      
      return isReferee || isReferrer || isJobPoster;
    });

    res.json(filteredReferrals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get referral by id
router.get('/:id', auth, async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id)
      .populate('job')
      .populate('referee', '-password')
      .populate('referrer', '-password');
    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }
    res.json(referral);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new referral request
router.post('/', auth, async (req, res) => {
  try {
    const { jobId, referrerId, notes } = req.body;
    
    // Create the referral
    const referral = new Referral({
      job: jobId,
      referee: req.user.id,
      referrer: referrerId,
      notes,
      interactions: [{
        type: 'view',
        initiator: 'referee',
        content: 'Referral request created'
      }]
    });
    await referral.save();

    // Add to user's interacted jobs
    await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: {
          interactedJobs: {
            jobId: jobId,
            status: 'applied',
            interactedAt: new Date()
          }
        }
      }
    );
    
    res.status(201).json(referral);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update referral status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    let referral = await Referral.findById(req.params.id);
    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }
    if (referral.referrer.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    referral.status = status;
    referral.interactions.push({
      type: 'status',
      initiator: 'referrer',
      content: `Status updated to ${status}`
    });
    
    await referral.save();
    
    // Fetch the updated referral with populated fields
    referral = await Referral.findById(req.params.id)
      .populate({
        path: 'job',
        populate: {
          path: 'postedBy',
          select: 'firstName lastName email'
        }
      })
      .populate('referee', 'firstName lastName email phone location bio skills experience education projects')
      .populate('referrer', 'firstName lastName email');
      
    res.json(referral);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add interaction to referral
router.post('/:id/interactions', auth, async (req, res) => {
  try {
    const { type, content } = req.body;
    const referral = await Referral.findById(req.params.id);
    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }
    
    const initiator = referral.referee.toString() === req.user.id ? 'referee' : 'referrer';
    referral.interactions.push({ type, initiator, content });
    await referral.save();
    res.json(referral);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;