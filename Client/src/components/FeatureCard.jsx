import React from "react";
import { FiMail, FiBarChart, FiLayout, FiUsers, FiClock, FiGlobe } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const featureCards = [
    {
      icon: FiLayout,
      title: "Email Templates",
      description: "Create and save custom email templates for different occasions. Coming soon!",
      color: "from-purple-500 to-purple-600",
      delay: 0.1
    },
    {
      icon: FiBarChart,
      title: "Analytics Dashboard",
      description: "Track email performance, open rates, and engagement metrics. Coming soon!",
      color: "from-blue-500 to-blue-600",
      delay: 0.2
    },
    {
      icon: FiUsers,
      title: "Team Collaboration",
      description: "Work together with your team members on email campaigns. Coming soon!",
      color: "from-green-500 to-green-600",
      delay: 0.3
    },
    {
      icon: FiClock,
      title: "Scheduled Sending",
      description: "Schedule your emails to be sent at the perfect time. Coming soon!",
      color: "from-yellow-500 to-yellow-600",
      delay: 0.4
    },
    {
      icon: FiGlobe,
      title: "Multi-language Support",
      description: "Send emails in multiple languages with automatic translation. Coming soon!",
      color: "from-red-500 to-red-600",
      delay: 0.5
    },
    {
      icon: FiMail,
      title: "Smart Personalization",
      description: "Advanced AI-powered email personalization features. Coming soon!",
      color: "from-indigo-500 to-indigo-600",
      delay: 0.6
    }
  ];
const FeatureCard = ({ icon, title, description }) => {
    return (
        <>
            {featureCards.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: feature.delay }}
              className="group relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white/80 p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                   style={{ backgroundImage: `linear-gradient(to right, #4F46E5, #06B6D4)` }} />
              
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-gray-600">
                {feature.description}
              </p>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                   style={{ backgroundImage: `linear-gradient(to right, #4F46E5, #06B6D4)` }} />
            </motion.div>
          ))}
        </>
    );
};
export default FeatureCard;