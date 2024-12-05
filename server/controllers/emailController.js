const { sendBulkEmails, validateEmailConfig } = require('../utils/emailService');
const multer = require('multer');

// Use memory storage instead of disk storage
const upload = multer({
  storage: multer.memoryStorage(),
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

      const { senderEmail, appPassword, recipients, subject, content } = req.body;
      
      // Convert recipients string to array if needed
      const recipientList = typeof recipients === 'string' ? JSON.parse(recipients) : recipients;

      // Process attachments from memory
      const attachments = req.files ? req.files.map(file => ({
        filename: file.originalname,
        content: file.buffer // Use the buffer directly
      })) : [];

      const result = await sendBulkEmails({
        senderEmail,
        appPassword,
        recipients: recipientList,
        subject,
        content,
        attachments
      });

      res.json(result);
    } catch (error) {
      console.error('Error in sendEmails:', error);
      res.status(500).json({
        message: 'Unknown error',
        error: error.message
      });
    }
  });
};

module.exports = {
  validateEmail,
  sendEmails
};
