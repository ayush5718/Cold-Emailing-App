const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in cookies first
  token = req.cookies.jwt;

  // If no cookie token, check Authorization header
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token found in either place
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Not authorized, no token' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.userId).select('-password');

    // If user not found
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Not authorized, user not found' 
      });
    }

    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);

    // If token is expired
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized, token expired'
      });
    }

    // If token is invalid
    return res.status(401).json({
      success: false,
      error: 'Not authorized, token failed'
    });
  }
});

module.exports = { protect };
