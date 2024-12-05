import axios from "axios";

const API_URL = "https://cold-emailing-app-56ji.vercel.app/api/email";

// Create axios instance with auth header
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const validateEmailConfig = async (senderEmail, appPassword) => {
  try {
    const response = await axiosInstance.post(
      "/validate",
      {
        senderEmail,
        appPassword,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Email validation error:",
      error.response?.data || error.message
    );
    throw (
      error.response?.data || {
        message: "Failed to validate email configuration",
      }
    );
  }
};

const sendBulkEmails = async ({
  senderEmail,
  appPassword,
  recipients,
  subject,
  content,
  attachments,
}) => {
  try {
    // Create FormData object
    const formData = new FormData();
    formData.append("senderEmail", senderEmail);
    formData.append("appPassword", appPassword);
    formData.append("recipients", JSON.stringify(recipients));
    formData.append("subject", subject);
    formData.append("content", content);

    // Append attachments if any
    if (attachments && attachments.length > 0) {
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    // Log formData contents (excluding sensitive data)
    console.log("Sending email with:", {
      senderEmail,
      recipientsCount: recipients.length,
      subject,
      attachmentsCount: attachments?.length || 0,
    });

    const response = await axiosInstance.post("/send", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error(
      "Email sending error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Failed to send emails" };
  }
};

export const emailService = {
  validateEmailConfig,
  sendBulkEmails,
};
