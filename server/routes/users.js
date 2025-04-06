const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    console.log('Updating profile with data:', JSON.stringify(req.body, null, 2));
    
    // Find the user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update all fields from the request body
    // This allows us to add new fields without changing this route
    Object.keys(req.body).forEach(key => {
      // Skip empty or undefined values
      if (req.body[key] !== undefined && req.body[key] !== null) {
        user[key] = req.body[key];
      }
    });

    console.log('Saving user with modified data:', JSON.stringify({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      experience: user.experience,
      education: user.education,
      projects: user.projects,
      // other fields omitted for brevity
    }, null, 2));

    await user.save();
    res.json(user);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

module.exports = router;