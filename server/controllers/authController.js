const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendOTPEmail, sendWelcomeEmail } = require('../utils/emailService');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const Joi = require('joi');

const generateToken = (res, userId) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '30d' }
  );

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });

  return token;
};

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const register = asyncHandler(async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      success: false, 
      error: error.details[0].message 
    });
  }

  const { name, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ 
      success: false, 
      error: 'User already exists' 
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password // Password will be hashed in the User model pre-save middleware
  });

  if (user) {
    // Generate token
    const token = generateToken(res, user._id);

    // Send welcome email
    try {
      await sendWelcomeEmail(email, name);
      console.log('Welcome email sent successfully to:', email);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't block registration if welcome email fails
    }

    return res.status(201).json({
      success: true,
      userInfo: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token
    });
  }

  return res.status(400).json({ 
    success: false, 
    error: 'Invalid user data' 
  });
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const login = asyncHandler(async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      success: false, 
      error: error.details[0].message 
    });
  }

  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid credentials' 
    });
  }

  // Compare hashed passwords
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid credentials' 
    });
  }

  // Generate token
  const token = generateToken(res, user._id);

  return res.json({
    success: true,
    userInfo: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token
  });
});

const logout = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  return res.status(200).json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { error } = forgotPasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      success: false, 
      error: error.details[0].message 
    });
  }

  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save();

  try {
    await sendOTPEmail(email, resetToken);
    res.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return res.status(500).json({ success: false, error: 'Email could not be sent' });
  }
});

const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required()
});

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        error: error.details[0].message 
      });
    }

    // Get token from params and hash it
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // Find user with token and check if token is expired
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Generate JWT token
    const token = generateToken(res, user._id);

    res.json({
      success: true,
      userInfo: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during password reset'
    });
  }
});

const verifyOTPSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required()
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { error } = verifyOTPSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      success: false, 
      error: error.details[0].message 
    });
  }

  const { email, otp } = req.body;

  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');

  const user = await User.findOne({
    email,
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      error: 'Invalid or expired OTP'
    });
  }

  res.json({
    success: true,
    message: 'OTP verified successfully',
    token: otp
  });
});

const getUserProfileSchema = Joi.object({
  _id: Joi.string().required()
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { error } = getUserProfileSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ 
      success: false, 
      error: error.details[0].message 
    });
  }

  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    return res.json({
      success: true,
      userInfo: user
    });
  } else {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
});

const updateUserProfileSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  password: Joi.string().min(6)
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { error } = updateUserProfileSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      success: false, 
      error: error.details[0].message 
    });
  }

  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    // Generate new token
    const token = generateToken(res, updatedUser._id);

    return res.json({
      success: true,
      userInfo: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
      token
    });
  } else {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
});

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  verifyOTP
};
