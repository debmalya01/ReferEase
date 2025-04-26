const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // First check if user is authenticated via session
    if (req.session && req.session.userId) {
      const user = await User.findById(req.session.userId).select('-password');
      
      if (user) {
        req.user = user;
        return next();
      }
    }
    
    // If no session, fall back to JWT token authentication
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      throw new Error();
    }

    // Store user in session for future requests
    req.session.userId = user._id;

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate.' });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    next();
  };
};

module.exports = { auth, checkRole }; 