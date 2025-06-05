const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const dotenv = require('dotenv');
dotenv.config();  // Ensure dotenv is loaded for environment variables

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    // Check if token is provided
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  // The client ID you got from Google Cloud Console
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name, picture, sub: googleId } = payload;

    // Check if the user already exists
    let user = await User.findOne({ 
      $or: [
        { email },
        { googleId }
      ]
    });

    if (!user) {
      // User doesn't exist, return data for registration
      return res.status(200).json({
        requiresRegistration: true,
        googleData: {
          email,
          firstName: given_name,
          lastName: family_name,
          profilePicture: picture,
          googleId
        }
      });
    }

    // If user exists but doesn't have a role, they need to complete registration
    if (!user.role) {
      return res.status(200).json({
        requiresRegistration: true,
        googleData: {
          email,
          firstName: given_name,
          lastName: family_name,
          profilePicture: picture,
          googleId
        }
      });
    }

    // Update user's Google information if needed
    if (!user.googleId) {
      user.googleId = googleId;
      user.authProvider = 'google';
      user.profilePicture = picture;
      await user.save();
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Respond with the generated JWT and user info
    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
});

// Complete Google registration
router.post('/google/complete', async (req, res) => {
  try {
    const { googleData, role } = req.body;

    if (!googleData || !role) {
      return res.status(400).json({ message: 'Google data and role are required' });
    }

    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { email: googleData.email },
        { googleId: googleData.googleId }
      ]
    });

    if (user) {
      // Update existing user
      user.role = role;
      user.authProvider = 'google';
      user.googleId = googleData.googleId;
      user.profilePicture = googleData.profilePicture;
      await user.save();
    } else {
      // Create new user
      user = new User({
        email: googleData.email,
        firstName: googleData.firstName,
        lastName: googleData.lastName,
        profilePicture: googleData.profilePicture,
        googleId: googleData.googleId,
        role,
        authProvider: 'google',
        isVerified: true
      });

      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Google registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

module.exports = router;
