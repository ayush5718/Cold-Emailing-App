const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = async (senderEmail, appPassword) => {
  if (!senderEmail || !appPassword) {
    throw new Error('Sender email and app password are required');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: senderEmail,
      pass: appPassword,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Verify the connection configuration
  try {
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    return transporter;
  } catch (error) {
    console.error('SMTP connection verification failed:', error);
    throw new Error('Failed to connect to email server: ' + error.message);
  }
};

const validateEmailConfig = async (senderEmail, appPassword) => {
  try {
    console.log('Validating email configuration for:', senderEmail);
    const transporter = await createTransporter(senderEmail, appPassword);
    return {
      success: true,
      message: 'Email configuration is valid'
    };
  } catch (error) {
    console.error('Email validation error:', error);
    return {
      success: false,
      message: 'Invalid email configuration',
      error: error.message
    };
  }
};

const sendOTPEmail = async (email, token) => {
  try {
    const transporter = await createTransporter(process.env.MAIL_USER, process.env.MAIL_PASS);
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #4F46E5, #06B6D4); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0;">Password Reset Request</h1>
        </div>
        <div style="padding: 30px 20px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
            You requested to reset your password. Here's your One-Time Password (OTP):
          </p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h2 style="color: #4F46E5; letter-spacing: 5px; margin: 0; font-size: 24px;">${token}</h2>
          </div>

          <p style="font-size: 16px; color: #374151; margin: 20px 0;">
            Alternatively, you can click the button below to reset your password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/reset-password/${token}" 
               style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #4F46E5, #06B6D4); color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">
              Reset Password
            </a>
          </div>

          <div style="margin-top: 20px; padding: 15px; background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 6px;">
            <p style="color: #c2410c; margin: 0; font-size: 14px;">
              ⚠️ This OTP and reset link will expire in 10 minutes.
            </p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6B7280; font-size: 14px;">
            <p>For security reasons, never share this OTP or email with anyone.</p>
            <p>If you didn't request this reset, please ignore this email or contact support.</p>
          </div>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Mern Auth" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: html,
    });

    console.log('Password reset email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
};

const sendBulkEmails = async ({ senderEmail, appPassword, recipients, subject, content, attachments = [] }) => {
  if (!Array.isArray(recipients) || recipients.length === 0 || recipients.length > 20) {
    throw new Error('Please provide between 1 and 20 recipient email addresses');
  }

  console.log(`Attempting to send emails from ${senderEmail} to ${recipients.length} recipients`);
  
  try {
    const transporter = await createTransporter(senderEmail, appPassword);
    const results = [];
    let successCount = 0;

    for (const recipient of recipients) {
      try {
        const mailOptions = {
          from: `"Cold Email App" <${senderEmail}>`,
          to: recipient,
          subject,
          html: content,
          attachments: attachments.map(file => ({
            filename: file.originalname,
            path: file.path
          }))
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${recipient}:`, info.messageId);
        results.push({ email: recipient, status: 'success', messageId: info.messageId });
        successCount++;

        // Add a small delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to send email to ${recipient}:`, error);
        results.push({
          email: recipient,
          status: 'failed',
          error: error.message
        });
      }
    }

    return {
      totalSent: recipients.length,
      successful: successCount,
      failed: recipients.length - successCount,
      details: results
    };
  } catch (error) {
    console.error('Bulk email sending failed:', error);
    throw new Error(`Failed to send emails: ${error.message}`);
  }
};

const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = await createTransporter(process.env.MAIL_USER, process.env.MAIL_PASS);
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .email-container {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
          }
          .header {
            background: linear-gradient(135deg, #4F46E5, #06B6D4);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            padding: 30px 20px;
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 0 0 10px 10px;
          }
          .welcome-text {
            font-size: 24px;
            color: #1F2937;
            margin-bottom: 20px;
          }
          .feature-list {
            margin: 25px 0;
          }
          .feature-item {
            display: block;
            margin: 15px 0;
            color: #4B5563;
            padding-left: 24px;
            position: relative;
          }
          .feature-item:before {
            content: "✓";
            color: #10B981;
            position: absolute;
            left: 0;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #4F46E5, #06B6D4);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            color: #6B7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Welcome to Cold Email Dashboard! 🚀</h1>
          </div>
          <div class="content">
            <div class="welcome-text">
              Hello ${name},
            </div>
            <p>Thank you for joining our Cold Email Dashboard! We're excited to help you streamline your email campaigns and boost your outreach efforts.</p>
            
            <div class="feature-list">
              <strong>Here's what you can do with our platform:</strong>
              <span class="feature-item">Send personalized bulk emails</span>
              <span class="feature-item">Track email performance</span>
              <span class="feature-item">Manage multiple recipients</span>
              <span class="feature-item">Attach files securely</span>
              <span class="feature-item">Use email templates (Coming Soon)</span>
            </div>

            <p>Getting started is easy:</p>
            <ol style="color: #4B5563; margin-left: 20px;">
              <li>Configure your Gmail account</li>
              <li>Add your recipients</li>
              <li>Compose your message</li>
              <li>Add attachments (optional)</li>
              <li>Review and send!</li>
            </ol>

            <center>
              <a href="http://localhost:5173/dashboard" class="button">
                Start Sending Emails
              </a>
            </center>

            <div class="footer">
              <p>Need help? Contact us at ayushbhardwaj9504@gmail.com</p>
              <p>Made with ❤️ by Aayush Kumar</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: `"Cold Email Dashboard" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Welcome to Cold Email Dashboard! 🚀",
      html: html,
    });

    console.log('Welcome email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Welcome email sending failed:', error);
    throw error;
  }
};

module.exports = {
  validateEmailConfig,
  sendOTPEmail,
  sendBulkEmails,
  sendWelcomeEmail
};