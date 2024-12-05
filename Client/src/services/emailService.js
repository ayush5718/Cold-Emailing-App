import axios from "axios";
import { API_URL } from "../config/config";

// Create axios instance with credentials
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This is important for cookies
  headers: {
    'Content-Type': 'application/json',
  }
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
    const response = await axiosInstance.post("/validate", {
      senderEmail,
      appPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to validate email configuration"
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
    // Create FormData for file upload
    const formData = new FormData();
    formData.append("senderEmail", senderEmail);
    formData.append("appPassword", appPassword);
    formData.append("recipients", JSON.stringify(recipients));
    formData.append("subject", subject);
    formData.append("content", content);

    // Append each file to FormData
    if (attachments && attachments.length > 0) {
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    const response = await axios.post(`${API_URL}/send`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to send emails");
  }
};

export const emailService = {
  validateEmailConfig,
  sendBulkEmails,
};
