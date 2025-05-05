import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import PageTransition from '../components/PageTransition';
import Spin from '../components/LoadingSpinner';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserPlus, FaUserCircle, FaEllipsisV } from 'react-icons/fa';

const FormattedDates = ({ rawDates }) => {
  const formattedDates = rawDates.split(',').map(dateStr => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  });

  return (
    <ul>
      {formattedDates.map((date, index) => (
        <li key={index}>{date}</li>
      ))}
    </ul>
  );
};
// Opportunity Card component
const RequestCard = ({ volunteer, application, refresh }) => {

    async function handleApplication(mode){

        try {
            await api.post(`/application/update/${application.id}/${mode}/`);
            refresh();
            } catch (error) {
            console.error('Error:', error);
            }

    }
    return (
        <div className='volunteer'>
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex p-6">
            {volunteer.display_name}
            <button
                onClick={() => handleApplication("not_completed")}
                className="ml-auto inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-red-900 hover:bg-gray-800 transition-colors"
                >
                Not Completed
            </button>
            <button
                onClick={() => handleApplication("completed")}
                className="ml-auto inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-green-900 hover:bg-gray-800 transition-colors"
                >
                Accept Completion
            </button>
            <Link
                to={`/dashboard/volunteer/${volunteer.volunteer_id}/`}
                className="ml-auto inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                >
                View Volunteer
            </Link>
            </div>
            {application.dates_worked}
        </div>
        </div>
    );
};

const OpportunityPendingApplications = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [volunteersRequested, setVolunteersRequested] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("applications");
  const [isOpen, setIsOpen] = useState(false);

  function searchVolunteer() {
    let input = document.getElementById("searchBar").value.toLowerCase();
    let volunteers = document.querySelectorAll(".volunteer");

    volunteers.forEach(volunteer => {
        if (volunteer.textContent.toLowerCase().includes(input)) {
            volunteer.style.display = "block";
        } else {
            volunteer.style.display = "none";
        }
    });
}

  useEffect(() => {
    fetchVolunteers();
  }, []);

  async function fetchVolunteers() {
    try {
      setIsLoading(true);
      const response = await api.get(`/volunteers/pending/${id}/`);
      setVolunteers(response);
      const response1 = await api.get(`/volunteers/requested/${id}/`);
      setVolunteersRequested(response1);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Container animation variant for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Individual item animation variant
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

  async function handleApplication(mode, application){

    try {
        await api.post(`/application/update/${application.id}/${mode}/`);
        fetchVolunteers();
        } catch (error) {
        console.error('Error:', error);
        }

  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-white -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Applications</h1>
          </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search and Filters */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    id='searchBar'
                    type="text"
                    onKeyUp={searchVolunteer}
                    placeholder="Search application..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          {/* Tabs Navigation - Styled similar to Leaderboard toggle */}
          <div className="bg-white rounded-xl shadow-sm mb-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap sm:flex-nowrap border-b"
            >
              {[
                { id: "applications", label: "Applications", icon: "👥" },
                { id: "requested_completion", label: "Completion Requests", icon: "📨" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 text-md font-medium transition-all 
                    ${activeTab === tab.id 
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" 
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="hidden sm:inline">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </motion.div>

            {/* Tab Content - Add motion animations similar to Leaderboard */}
            <div className="p-6">
              {activeTab === "applications" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Applications</h2>
                  
                  {volunteers.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-10 bg-gray-50 rounded-lg"
                    >
                      <span className="text-5xl block mb-4">👋</span>
                      <h3 className="text-lg font-medium text-gray-900">No application</h3>
                    </motion.div>
                  ) : (
                    <motion.div 
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                      {volunteers.map((volunteer) => (
                        <motion.div
                          key={volunteer.id}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-white border rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
                        >
                          <div className="p-5">
                            <div className="flex items-center space-x-4">
                              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                                {volunteer.display_name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-lg font-medium text-gray-900 truncate">
                                  {volunteer.display_name}  
                                </p>
                              <FormattedDates rawDates={volunteer.application.dates_worked} />
                              </div>
                              <div className="relative">
                                <button
                                  onClick={() => setIsOpen(isOpen === volunteer.id ? null : volunteer.id)}
                                  className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none rounded-full hover:bg-gray-100 transition"
                                >
                                  <FaEllipsisV />
                                </button>
                                
                                {isOpen === volunteer.id && (
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
                                  >
                                    <button
                                      onClick={() => handleApplication("accepted", volunteer.application)}
                                      className="block w-full text-left px-4 py-2 text-sm text-black-600 hover:bg-green-50"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                      onClick={() => handleApplication("rejected", volunteer.application)}
                                    >
                                      Reject
                                    </button>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-5 py-3">
                            <Link
                              to={`/dashboard/volunteer/${volunteer.volunteer_id}/`}
                              className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                              View volunteer details →
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
              
              {activeTab === "requested_completion" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Requesting Opportunity Completion</h2>
                  
                  {volunteersRequested.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-10 bg-gray-50 rounded-lg"
                    >
                      <span className="text-5xl block mb-4">📭</span>
                      <h3 className="text-lg font-medium text-gray-900">No Requests</h3>
                      <p className="text-gray-500 mt-2">You don't have any pending requests</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="space-y-4"
                    >
                      {volunteersRequested.map((volunteer) => (
                        <motion.div 
                          key={volunteer.id} 
                          variants={item}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white border rounded-lg shadow-sm p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                {volunteer.display_name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-md font-medium text-gray-900">{volunteer.display_name}</p>
                                <p className="text-sm text-gray-500">Has {volunteer.display_name} completed their task on these date(s)?</p>
                                <FormattedDates rawDates={volunteer.application.dates_worked} />
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => handleApplication("not_completed", volunteer.application)}
                                className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition"
                              >
                                Not Complete
                              </button>
                              <button 
                                onClick={() => handleApplication("completed", volunteer.application)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-sm transition"
                              >
                                Complete
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </div>

            </div>
          </div>
        </div>
        
          
          {/* Notification Toast - Make more like Leaderboard */}
        </div>
      

    </PageTransition>
  );
};

export default OpportunityPendingApplications;
