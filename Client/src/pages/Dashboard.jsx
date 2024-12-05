import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { emailService } from "../services/emailService";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import {
  FiMail,
  FiUsers,
  FiEdit,
  FiPaperclip,
  FiSend,
  FiCheck,
} from "react-icons/fi";

const steps = [
  { id: 1, title: "Configuration", description: "Set up email", icon: FiMail },
  { id: 2, title: "Recipients", description: "Add recipients", icon: FiUsers },
  { id: 3, title: "Content", description: "Compose email", icon: FiEdit },
  { id: 4, title: "Attachments", description: "Add files", icon: FiPaperclip },
  { id: 5, title: "Review", description: "Send emails", icon: FiSend },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function Dashboard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [emailConfigValid, setEmailConfigValid] = useState(false);
  const fileInputRef = useRef(null);

  // Form states
  const [emailConfig, setEmailConfig] = useState({
    senderEmail: "",
    password: "",
    host: "smtp.gmail.com",
    port: "587",
  });
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleEmailValidation = async (e) => {
    e.preventDefault();
    if (!emailConfig.senderEmail || !emailConfig.password) {
      toast.error("Sender email and app password are required");
      return;
    }

    setLoading(true);
    try {
      await emailService.validateEmailConfig(
        emailConfig.senderEmail,
        emailConfig.password
      );
      setEmailConfigValid(true);
      setCurrentStep(2);
      toast.success("Email configuration validated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to validate email configuration");
      setEmailConfigValid(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmails = async (e) => {
    e.preventDefault();
    if (!emailConfigValid) {
      toast.error("Please validate your email configuration first");
      return;
    }

    setLoading(true);
    try {
      const recipientList = recipients.split(",").map((email) => email.trim());
      await emailService.sendBulkEmails({
        senderEmail: emailConfig.senderEmail,
        appPassword: emailConfig.password,
        recipients: recipientList,
        subject,
        content: message,
        attachments: files,
      });
      toast.success("Emails sent successfully!");
      // Reset form
      setRecipients("");
      setSubject("");
      setMessage("");
      setFiles([]);
      setCurrentStep(1);
    } catch (error) {
      toast.error(error.message || "Failed to send emails");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const fileList = Array.from(e.target.files);
    if (fileList.length > 5) {
      toast.error("Maximum 5MB files allowed");
      return;
    }
    setFiles(fileList);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 5) {
      toast.error("Maximum 5 files allowed");
      return;
    }
    setFiles(droppedFiles);
  };

  const Progress = () => (
    <div className="w-full mb-8 mt-20">
      <div className="flex justify-between mb-4 overflow-x-auto py-2 px-4 md:px-0">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            className={`flex flex-col items-center ${
              index === steps.length - 1 ? "" : "relative"
            }`}
            variants={itemVariants}
          >
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= step.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentStep > step.id ? <FiCheck /> : <step.icon />}
            </motion.div>
            <p className="text-xs mt-2 text-center hidden md:block">
              {step.title}
            </p>
            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 left-1/2 w-full h-0.5 ${
                  currentStep > step.id ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="w-full max-w-md mx-auto"
          >
            <motion.div
              className="backdrop-blur-lg bg-white/80 rounded-2xl p-6 shadow-xl border border-gray-200"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Email Configuration
              </h3>
              <form onSubmit={handleEmailValidation} className="space-y-6">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sender Email
                  </label>
                  <input
                    type="email"
                    value={emailConfig.senderEmail}
                    onChange={(e) =>
                      setEmailConfig({
                        ...emailConfig,
                        senderEmail: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    App Password
                  </label>
                  <input
                    type="password"
                    value={emailConfig.password}
                    onChange={(e) =>
                      setEmailConfig({
                        ...emailConfig,
                        password: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </motion.div>
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Validating...
                    </div>
                  ) : (
                    "Validate Configuration"
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="w-full max-w-md mx-auto"
          >
            <motion.div
              className="backdrop-blur-lg bg-white/80 rounded-2xl p-6 shadow-xl border border-gray-200"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Recipients
              </h3>
              <div className="space-y-6">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Addresses
                  </label>
                  <textarea
                    value={recipients}
                    onChange={(e) => setRecipients(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    rows="4"
                    placeholder="email1@example.com, email2@example.com"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Separate multiple emails with commas
                  </p>
                </motion.div>
                <div className="flex justify-between space-x-4">
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-3 px-6 rounded-lg bg-gray-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Next
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="w-full max-w-md mx-auto"
          >
            <motion.div
              className="backdrop-blur-lg bg-white/80 rounded-2xl p-6 shadow-xl border border-gray-200"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Email Content
              </h3>
              <div className="space-y-6">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    rows="6"
                    required
                  />
                </motion.div>
                <div className="flex justify-between space-x-4">
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 py-3 px-6 rounded-lg bg-gray-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(4)}
                    className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Next
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            key="step4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="w-full max-w-md mx-auto"
          >
            <motion.div
              className="backdrop-blur-lg bg-white/80 rounded-2xl p-6 shadow-xl border border-gray-200"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Attachments
              </h3>
              <div className="space-y-6">
                <motion.div
                  variants={itemVariants}
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    className="hidden"
                  />
                  <FiPaperclip className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag and drop files here, or{" "}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum 5 Mb files allowed
                  </p>
                </motion.div>
                {files.length > 0 && (
                  <motion.div variants={itemVariants} className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm text-gray-600 truncate">
                          {file.name}
                        </span>
                        <button
                          onClick={() =>
                            setFiles(files.filter((_, i) => i !== index))
                          }
                          className="text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
                <div className="flex justify-between space-x-4">
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 py-3 px-6 rounded-lg bg-gray-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(5)}
                    className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Next
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div
            key="step5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="w-full max-w-md mx-auto"
          >
            <motion.div
              className="backdrop-blur-lg bg-white/80 rounded-2xl p-6 shadow-xl border border-gray-200"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Review & Send
              </h3>
              <div className="space-y-6">
                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      From
                    </h4>
                    <p className="text-sm text-gray-600">
                      {emailConfig.senderEmail}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      To
                    </h4>
                    <p className="text-sm text-gray-600">
                      {recipients
                        .split(",")
                        .map((email) => email.trim())
                        .join(", ")}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </h4>
                    <p className="text-sm text-gray-600">{subject}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Message
                    </h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {message}
                    </p>
                  </div>
                  {files.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Attachments
                      </h4>
                      <ul className="list-disc list-inside">
                        {files.map((file, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
                <div className="flex justify-between space-x-4">
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(4)}
                    className="flex-1 py-3 px-6 rounded-lg bg-gray-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendEmails}
                    disabled={loading}
                    className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Sending...
                      </div>
                    ) : (
                      "Send Emails"
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Progress />
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
