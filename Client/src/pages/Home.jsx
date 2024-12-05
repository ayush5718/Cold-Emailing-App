import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import FeatureCard from '@/components/FeatureCard';

// const featureCards = [
//   {
//     icon: FiLayout,
//     title: "Email Templates",
//     description: "Create and save custom email templates for different occasions. Coming soon!",
//     color: "from-purple-500 to-purple-600",
//     delay: 0.1
//   },
//   {
//     icon: FiBarChart,
//     title: "Analytics Dashboard",
//     description: "Track email performance, open rates, and engagement metrics. Coming soon!",
//     color: "from-blue-500 to-blue-600",
//     delay: 0.2
//   },
//   {
//     icon: FiUsers,
//     title: "Team Collaboration",
//     description: "Work together with your team members on email campaigns. Coming soon!",
//     color: "from-green-500 to-green-600",
//     delay: 0.3
//   },
//   {
//     icon: FiClock,
//     title: "Scheduled Sending",
//     description: "Schedule your emails to be sent at the perfect time. Coming soon!",
//     color: "from-yellow-500 to-yellow-600",
//     delay: 0.4
//   },
//   {
//     icon: FiGlobe,
//     title: "Multi-language Support",
//     description: "Send emails in multiple languages with automatic translation. Coming soon!",
//     color: "from-red-500 to-red-600",
//     delay: 0.5
//   },
//   {
//     icon: FiMail,
//     title: "Smart Personalization",
//     description: "Advanced AI-powered email personalization features. Coming soon!",
//     color: "from-indigo-500 to-indigo-600",
//     delay: 0.6
//   }
// ];

const Home = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [currentStep, setCurrentStep] = useState(0);
  const [showDemo, setShowDemo] = useState(false);

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      title: "Welcome to Free Cold Mailing!",
      description: "Let's learn how to use this platform in a fun way! It's 100% free forever.",
      animation: {
        initial: { scale: 0 },
        animate: { scale: 1, rotate: [0, 10, -10, 0] },
        transition: { duration: 0.5 }
      },
      icon: "👋"
    },
    {
      title: "Step 1: Gmail Setup",
      description: "First, you'll need your Gmail and App Password. Don't worry, we'll show you how to get it!",
      demoContent: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <h4 className="font-semibold mb-2">How to get App Password:</h4>
          <ol className="list-decimal list-inside space-y-2">
            <li>Go to Google Account Settings</li>
            <li>Enable 2-Step Verification</li>
            <li>Go to Security → App Passwords</li>
            <li>Generate new password for 'Mail'</li>
          </ol>
          <a 
            href="https://myaccount.google.com/security" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Visit Google Security Settings →
          </a>
        </motion.div>
      ),
      icon: "🔐"
    },
    {
      title: "Step 2: Add Recipients",
      description: "Time to add your recipients! Perfect for job applications, networking, or business outreach.",
      demoContent: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="space-y-4">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-green-500">✓</span>
              <span>HR Managers</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-green-500">✓</span>
              <span>Recruiters</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span className="text-green-500">✓</span>
              <span>Potential Clients</span>
            </motion.div>
          </div>
        </motion.div>
      ),
      icon: "📧"
    },
    {
      title: "Step 3: Craft Your Message",
      description: "Create compelling emails with our professional templates. Stand out from the crowd!",
      demoContent: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            <div className="mt-4 flex space-x-2">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-blue-100 rounded text-sm"
              >
                Template 1
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-green-100 rounded text-sm"
              >
                Template 2
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      ),
      icon: "✍️"
    },
    {
      title: "Step 4: Send & Track",
      description: "Send your emails and track their performance. All completely free!",
      demoContent: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="space-y-4">
            <motion.div 
              className="flex justify-between items-center"
              initial={{ x: -20 }}
              animate={{ x: 0 }}
            >
              <span>Emails Sent</span>
              <span className="text-green-500 font-bold">100%</span>
            </motion.div>
            <motion.div 
              className="h-2 bg-gray-200 rounded-full overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5 }}
            >
              <motion.div 
                className="h-full bg-green-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5 }}
              ></motion.div>
            </motion.div>
          </div>
        </motion.div>
      ),
      icon: "📊"
    }
  ];

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [navigate, userInfo]);

  const handleEmailCampaign = () => {
    navigate('/dashboard');
    toast.success('Starting new email campaign');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <motion.span 
              className="block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Professional Email Campaigns
            </motion.span>
            <motion.span 
              className="block text-blue-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              100% Free Forever!
            </motion.span>
          </h1>
        </motion.div>

        {/* Interactive Tutorial Section */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-8 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <motion.span
                  className="text-4xl"
                  {...steps[currentStep].animation}
                >
                  {steps[currentStep].icon}
                </motion.span>
                <span className="text-gray-500">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
              <p className="text-gray-600 mb-6">{steps[currentStep].description}</p>
              
              {steps[currentStep].demoContent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6"
                >
                  {steps[currentStep].demoContent}
                </motion.div>
              )}

              <div className="flex justify-between mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrevStep}
                  className={`px-6 py-2 rounded-lg ${
                    currentStep === 0
                      ? 'bg-gray-200 text-gray-400'
                      : 'bg-blue-100 text-blue-600'
                  }`}
                  disabled={currentStep === 0}
                >
                  Previous
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={currentStep === steps.length - 1 ? handleEmailCampaign : handleNextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {currentStep === steps.length - 1 ? "Start Now!" : "Next"}
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Feature Cards Section */}
       
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Exciting Features Coming Soon
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're working hard to bring you these amazing features. Stay tuned for updates that will make your email campaigns even more powerful!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Feature Cards */}
          <FeatureCard />
        </motion.div>

        {/* Developer Credit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-16 text-gray-600"
        >
          <p>Developed with ❤️ by Aayush Kumar</p>
          <p>
            <a href="mailto:ayushbhardwaj9504@gmail.com" className="text-blue-600 hover:underline">
              ayushbhardwaj9504@gmail.com
            </a>
          </p>
          <p className="text-sm mt-2">Making professional networking easier and more accessible</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
