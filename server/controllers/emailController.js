const { sendBulkEmails, validateEmailConfig } = require('../utils/emailService');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).array('attachments', 5);

const validateEmail = async (req, res) => {
  try {
    const { senderEmail, appPassword } = req.body;
    
    if (!senderEmail || !appPassword) {
      return res.status(400).json({ 
        message: 'Sender email and app password are required' 
      });
    }

    const result = await validateEmailConfig(senderEmail, appPassword);
    res.json(result);
  } catch (error) {
    console.error('Error in validateEmail:', error);
    res.status(500).json({
      message: 'Email validation failed',
      error: error.message
    });
  }
};

const sendEmails = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ 
          message: 'File upload error', 
          error: err.message 
        });
      } else if (err) {
        return res.status(500).json({ 
          message: 'Unknown error', 
          error: err.message 
        });
      }

      // Log the received form data
      console.log('Received form data:', {
        body: req.body,
        files: req.files
      });

      const { senderEmail, appPassword, recipients: recipientsJson, subject, content } = req.body;

      // Parse recipients from JSON string
      let recipients;
      try {
        recipients = JSON.parse(recipientsJson);
      } catch (error) {
        console.error('Error parsing recipients:', error);
        return res.status(400).json({ 
          message: 'Invalid recipients format' 
        });
      }

      // Validate inputs
      if (!senderEmail || !appPassword) {
        return res.status(400).json({ 
          message: 'Sender email and app password are required' 
        });
      }

      if (!Array.isArray(recipients)) {
        return res.status(400).json({ 
          message: 'Recipients must be an array' 
        });
      }

      // Filter out empty recipients
      recipients = recipients.filter(email => email && email.trim());

      if (recipients.length === 0 || recipients.length > 20) {
        return res.status(400).json({ 
          message: 'Please provide between 1 and 20 recipient email addresses' 
        });
      }

      if (!subject || !content) {
        return res.status(400).json({ 
          message: 'Subject and content are required' 
        });
      }

      // Send emails
      const result = await sendBulkEmails({
        senderEmail,
        appPassword,
        recipients,
        subject,
        content,
        attachments: req.files || []
      });

      res.json({
        message: 'Bulk email sending completed',
        result
      });
    } catch (error) {
      console.error('Error in sendEmails:', error);
      res.status(500).json({
        message: 'Failed to send emails',
        error: error.message
      });
    }
  });
};

module.exports = {
  validateEmail,
  sendEmails
};
