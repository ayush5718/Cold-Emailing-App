const express = require('express');
const router = express.Router();
const { sendEmails, validateEmail } = require('../controllers/emailController');
const {protect} = require('../middleware/authMiddleware');

// Route for validating email configuration
router.post('/validate', protect, validateEmail);

// Route for sending bulk emails
router.post('/send', protect, sendEmails);

module.exports = router;
