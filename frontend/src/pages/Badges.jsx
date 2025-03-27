import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import PageTransition from '../components/PageTransition';
import Spin from '../components/LoadingSpinner';
import api from '../utils/api';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router';

const badgeCategories = [
  { name: "Elderly Care", icon: "👵", color: "bg-amber-500", colorLight: "bg-amber-100", key: "elderly" },
  { name: "Medical", icon: "🩺", color: "bg-red-500", colorLight: "bg-red-100", key: "medical" },
  { name: "Special Needs", icon: "♿", color: "bg-blue-500", colorLight: "bg-blue-100", key: "disability" },
  { name: "Animal Welfare", icon: "🐾", color: "bg-green-500", colorLight: "bg-green-100", key: "animals" },
  { name: "Sports", icon: "⚽", color: "bg-indigo-500", colorLight: "bg-indigo-100", key: "sports" },
  { name: "Greener Planet", icon: "🌱", color: "bg-emerald-500", colorLight: "bg-emerald-100", key: "greener_planet" },
  { name: "Education", icon: "📚", color: "bg-yellow-500", colorLight: "bg-yellow-100", key: "education" },
  { name: "Community", icon: "👪", color: "bg-purple-500", colorLight: "bg-purple-100", key: "community" },
];

const Badge = ({ category, score, maxScore = 700, selected, onClick }) => {
  const level = Math.min(7, Math.max(1, Math.floor(score / (maxScore / 7)) + 1));
  const progress = (score % (maxScore / 7)) / (maxScore / 7) * 100;
  
  const levelTitles = [
    "Beginner",
    "Apprentice",
    "Enthusiast",
    "Specialist",
    "Expert", 
    "Master",
    "Champion"
  ];
  
  return (
    <motion.div 
      className={`cursor-pointer p-5 bg-white rounded-xl shadow-md hover:shadow-xl transition-all ${selected ? 'ring-4 ring-blue-400' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`w-full h-36 ${category.color} text-white rounded-xl flex items-center justify-center mb-4`}>
        <span className="text-6xl">{category.icon}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
      <div className="flex justify-between items-center mb-1">
        <p className="text-sm text-gray-600">Level {level}</p>
        <p className="text-sm font-medium text-gray-700">{score}/{maxScore}</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
        <div
          className={`h-3 rounded-full ${category.color}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 mt-1">{levelTitles[level-1]}</p>
    </motion.div>
  );
};

const BadgeDetailView = ({ category, score, maxScore = 700 }) => {
  const level = Math.min(7, Math.max(1, Math.floor(score / (maxScore / 7)) + 1));
  const currentLevelScore = Math.floor(score % (maxScore / 7));
  const pointsForNextLevel = Math.floor(maxScore / 7);
  
  const levelTitles = [
    "Beginner",
    "Apprentice", 
    "Enthusiast",
    "Specialist",
    "Expert",
    "Master",
    "Champion"
  ];
  
  const levelDescriptions = [
    "You've just started your journey in this field.",
    "You're building your knowledge and skills.",
    "You're becoming familiar with this type of volunteering.",
    "You have good experience in this area.",
    "You have significant expertise in this field.",
    "You've mastered this area of volunteering.",
    "You're a leader and mentor in this field."
  ];
  
  const benefits = [
    "Access to beginner resources",
    "Access to volunteer events",
    "Special recognition on profile",
    "Eligibility for dedicated roles",
    "Priority for specialized opportunities",
    "Mentorship possibilities",
    "Leadership opportunities"
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-white rounded-xl shadow-lg col-span-2"
    >
      <div className="flex items-start space-x-6">
        <div className={`p-5 ${category.color} text-white rounded-xl flex items-center justify-center`}>
          <span className="text-6xl">{category.icon}</span>
        </div>
        
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{category.name} Badge</h2>
          <p className="text-lg font-semibold text-gray-700 mb-4">
            Level {level}: {levelTitles[level-1]}
          </p>
          <p className="text-gray-600 mb-6">{levelDescriptions[level-1]}</p>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm text-gray-600">Progress to next level</p>
              <p className="text-sm font-medium text-gray-700">{currentLevelScore}/{pointsForNextLevel}</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full ${category.color}`}
                style={{ width: `${(currentLevelScore / pointsForNextLevel) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Benefits at this level:</h3>
            <ul className="text-gray-600 space-y-1">
              {benefits.slice(0, level).map((benefit, idx) => (
                <li key={idx} className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  {benefit}
                </li>
              ))}
              {level < 7 && benefits.slice(level).map((benefit, idx) => (
                <li key={idx + level} className="flex items-center text-gray-400">
                  <svg className="w-4 h-4 mr-2 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
                  </svg>
                  {benefit} (unlock at level {idx + level + 1})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Progress Levels */}
      <div className="mt-8">
        <h3 className="font-semibold text-gray-800 mb-4">Badge Levels</h3>
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4, 5, 6, 7].map((lvl) => (
            <div 
              key={lvl}
              className={`w-1/7 px-3 py-2 text-center ${lvl <= level ? category.color : category.colorLight} rounded-lg`}
            >
              <p className={`text-sm font-medium ${lvl <= level ? 'text-white' : 'text-gray-700'}`}>{levelTitles[lvl-1]}</p>
              <p className={`text-xs ${lvl <= level ? 'text-white/80' : 'text-gray-500'}`}>Level {lvl}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const BadgesPage = () => {
  const { user } = useUser();
  const [volunteer, setVolunteer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Function to handle back navigation
  const handleBackNavigation = () => {
    // Check if we came from the dashboard
    if (location.state?.from === 'dashboard') {
      navigate('/dashboard', { state: { activeTab: 'badges' } });
    } else {
      // If not from dashboard, just go back
      navigate(-1);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      if (user && user.email) {
        try {
          setIsLoading(true);
          const response = await api.get('/volunteer/list/');
          const volunteers = response;
          const currentVolunteer = volunteers.find(v => v.email === user.email);
          
          if (currentVolunteer) {
            const detailResponse = await api.get(`/volunteer/${currentVolunteer.id}/`);
            setVolunteer(detailResponse);
          }
        } catch (error) {
          console.error('Error fetching volunteer data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin />
      </div>
    );
  }

  if (!volunteer) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={handleBackNavigation} 
              className="mr-4 p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
              aria-label="Go back"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Badges</h1>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <p className="text-center text-gray-600">Please sign in to view your badges.</p>
          </div>
        </div>
      </div>
    );
  }
  
  const scores = volunteer.scores || {};
  const totalScore = volunteer.overall_score || 0;
  
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <button 
              onClick={handleBackNavigation} 
              className="mr-4 p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
              aria-label="Go back"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Your Badges</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Badges Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${selectedBadge ? 'col-span-1' : 'md:col-span-3'}`}>
              {badgeCategories.map(category => (
                <Badge 
                  key={category.key}
                  category={category}
                  score={scores[category.key] || 0}
                  selected={selectedBadge?.key === category.key}
                  onClick={() => setSelectedBadge(
                    selectedBadge?.key === category.key ? null : category
                  )}
                />
              ))}
            </div>
            
            {/* Selected Badge Detail */}
            {selectedBadge && (
              <BadgeDetailView 
                category={selectedBadge}
                score={scores[selectedBadge.key] || 0}
              />
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default BadgesPage;
