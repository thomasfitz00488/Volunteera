import PageTransition from '../components/PageTransition';
import Spin from '../components/LoadingSpinner';
import api from '../utils/api';
import React, { useState, useEffect, useRef } from 'react';
import _ from "lodash";
import { useUser } from '../contexts/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import { FaTrophy, FaMedal, FaEllipsisV, FaUserPlus, FaUserCircle, FaStar, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

// Profile Preview Component
const ProfilePreview = ({ volunteer, onMouseEnter, onMouseLeave }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute left-0 top-full mt-2 z-50 bg-white rounded-lg shadow-xl border border-gray-100 p-4 w-64"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex flex-col items-center mb-3">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center text-xl font-bold mb-2">
          {volunteer.display_name?.charAt(0) || "V"}
        </div>
        <h3 className="font-bold text-gray-800 text-lg">{volunteer.display_name}</h3>
        <div className="flex items-center mt-1">
          <FaStar className="text-yellow-500 mr-1" />
          <span className="text-gray-600 font-medium">{volunteer.overall_score} Impact Score</span>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        {volunteer.profile?.bio && (
          <p className="text-gray-600 italic">"{volunteer.profile?.bio?.substring(0, 100)}{volunteer.profile?.bio?.length > 100 ? '...' : ''}"</p>
        )}
        
        <div className="flex items-center text-gray-500">
          <FaCalendarAlt className="mr-2" />
          <span>Member since {volunteer.created_at ? new Date(volunteer.created_at).toLocaleDateString() : 'N/A'}</span>
        </div>
        
        {volunteer.location && (
          <div className="flex items-center text-gray-500">
            <FaMapMarkerAlt className="mr-2" />
            <span>{volunteer.location}</span>
          </div>
        )}
      </div>
      
      <Link
        to={`/dashboard/volunteer/${volunteer.id}/`}
        className="mt-3 block w-full text-center bg-primary hover:bg-primary-dark text-white rounded-lg py-2 transition duration-200"
      >
        View Full Profile
      </Link>
    </motion.div>
  );
};

const Leaderboard = () => {
  const { user } = useUser();
  const [userID, setUserID] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFriendsLeaderboard, setShowFriendsLeaderboard] = useState(false);
  const [dropdownStates, setDropdownStates] = useState({});
  const [hoveredVolunteer, setHoveredVolunteer] = useState(null);
  const [isHoveringPreview, setIsHoveringPreview] = useState(false);
  const hoverTimeoutRef = useRef(null);

  const toggleDropdown = (id) => {
    setDropdownStates((prev) => ({
      [id]: !prev[id],
    }));
  };

  // Fetch userID based on the logged-in user's email
  useEffect(() => {
    const fetchUserID = async () => {
      try {
        if (!user) return; // Wait for user data

        const response = await api.get('/volunteer/list/');
        const users = response;

        const matchedUser = users.find(volunteer => volunteer.email === user.email);
        if (matchedUser) {
          setUserID(matchedUser.id);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserID();
  }, [user]);

  const addFriend = async (friendshipId, index) => {
    try {
        await api.post(`/friendship/create/${friendshipId}/${userID}/`);
        toggleDropdown(index);
    } catch (error) {
        console.error("Error creating friendship:", error);
    }
};

  // Fetch all volunteers and sort them by overall score
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/volunteer/list/');
        const sortedData = _.orderBy(response, ["overall_score"], ["desc"]).slice(0,50);
        setVolunteers(sortedData);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  // Fetch friends leaderboard once userID is available
  useEffect(() => {
    if (!userID) return;

    const fetchFriends = async () => {
      try {
        const response = await api.get(`/volunteer/${userID}/`);
        const listOfFriends = response.friends || [];
        listOfFriends.push(response)
        const sortedFriends = _.orderBy(listOfFriends, ["overall_score"], ["desc"]);
        setFriends(sortedFriends)
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, [userID]);

  const getRankIcon = (index) => {
    switch(index) {
      case 0:
        return <FaTrophy className="text-yellow-500" size={20} title="1st Place" />;
      case 1:
        return <FaMedal className="text-gray-400" size={20} title="2nd Place" />;
      case 2:
        return <FaMedal className="text-amber-700" size={20} title="3rd Place" />;
      default:
        return <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-semibold">{index + 1}</span>;
    }
  };

  const handleMouseEnterName = (volunteer) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredVolunteer(volunteer);
  };

  const handleMouseLeaveName = () => {
    // Only hide the preview if we're not hovering over the preview itself
    if (!isHoveringPreview) {
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredVolunteer(null);
      }, 100);
    }
  };

  const handleMouseEnterPreview = () => {
    // Clear any timeout that would hide the preview
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHoveringPreview(true);
  };

  const handleMouseLeavePreview = () => {
    setIsHoveringPreview(false);
    // Hide the preview after a short delay
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredVolunteer(null);
    }, 100);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <PageTransition>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full h-full py-6" // Made it full width by removing max-width constraint
        >
          <div className="bg-white shadow-lg overflow-hidden h-full"> {/* Removed rounded corners for full-width display */}
            {/* Updated gradient to match volunteer logo */}
            <div className="bg-gradient-to-r from-[#A85AC8] to-blue-600 p-6 text-white">
              <motion.h1 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-3xl font-bold text-center"
              >
                Leaderboard
              </motion.h1>
              <p className="text-center text-white/90 mt-2">See who's making the biggest impact</p>
            </div>

            {/* Improved Global/Friends toggle with better contrast */}
            {friends.length > 0 && (
              <div className="flex justify-center -mt-5">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-full shadow-md p-1 flex items-center border border-gray-200"
                >
                  <button
                    onClick={() => setShowFriendsLeaderboard(false)}
                    className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                      !showFriendsLeaderboard 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Global
                  </button>
                  <button
                    onClick={() => setShowFriendsLeaderboard(true)}
                    className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                      showFriendsLeaderboard 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Friends
                  </button>
                </motion.div>
              </div>
            )}

            <div className="p-4 md:p-6 lg:p-8"> {/* Responsive padding for different screen sizes */}
              {/* Leaderboard header */}
              <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50 rounded-lg font-medium text-gray-500 mb-4">
                <div className="col-span-1 text-center">Rank</div>
                <div className="col-span-7">Volunteer</div>
                <div className="col-span-3 text-center">Impact Score</div>
                <div className="col-span-1"></div>
              </div>

              {/* Leaderboard List */}
              <motion.ul 
                className="space-y-3"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.07
                    }
                  }
                }}
              >
                {(showFriendsLeaderboard ? friends : volunteers).map((vol, index) => (
                  <motion.li
                    key={vol.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                    }}
                    className={`grid grid-cols-12 gap-2 items-center p-4 rounded-xl border transition-all duration-300 ${
                      vol.id === userID 
                        ? 'bg-primary/5 border-primary/30' 
                        : index < 3 
                          ? `bg-gradient-to-r ${index === 0 ? 'from-yellow-50 to-white' : index === 1 ? 'from-gray-50 to-white' : 'from-amber-50 to-white'} border-${index === 0 ? 'yellow' : index === 1 ? 'gray' : 'amber'}-200`
                          : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="col-span-1 flex justify-center">
                      {getRankIcon(index)}
                    </div>
                    
                    <div className="col-span-7 font-medium text-gray-800 flex items-center gap-3 relative">
                      {vol.id === userID && <span className="text-xs font-bold uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full">You</span>}
                      <span 
                        className="cursor-pointer hover:text-primary transition-colors duration-200"
                        onMouseEnter={() => handleMouseEnterName(vol)}
                        onMouseLeave={handleMouseLeaveName}
                      >
                        {vol.display_name}
                      </span>
                      
                      {/* Profile Preview */}
                      <AnimatePresence>
                        {hoveredVolunteer && hoveredVolunteer.id === vol.id && (
                          <ProfilePreview 
                            volunteer={vol} 
                            onMouseEnter={handleMouseEnterPreview}
                            onMouseLeave={handleMouseLeavePreview}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <div className="col-span-3 text-center">
                      <span className={`font-bold ${index < 3 ? 'text-lg' : ''} ${
                        index === 0 ? 'text-yellow-600' : index === 1 ? 'text-gray-600' : index === 2 ? 'text-amber-700' : 'text-gray-800'
                      }`}>
                        {vol.overall_score}
                      </span>
                    </div>
                    
                    <div className="col-span-1 relative">
                      <button
                        onClick={() => toggleDropdown(index)}
                        className="p-2 rounded-full hover:bg-gray-100 transition text-gray-500"
                        aria-label="Options"
                      >
                        <FaEllipsisV />
                      </button>

                      {/* Dropdown Menu */}
                      {dropdownStates[index] && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-10 right-0 mt-2 w-44 bg-white shadow-xl rounded-lg border border-gray-100 overflow-hidden"
                        >
                          {user?.is_volunteer && !friends.some(u => u.id === vol.id) && vol.id !== userID && (
                            <button
                              onClick={() => addFriend(vol.id, index)}
                              className="flex w-full items-center gap-2 text-left px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors duration-200"
                            >
                              <FaUserPlus size={14} />
                              <span>Add Friend</span>
                            </button>
                          )}
                          
                          <Link
                            to={`/dashboard/volunteer/${vol.id}/`}
                            className="flex w-full items-center gap-2 text-left px-4 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors duration-200"
                          >
                            <FaUserCircle size={14} />
                            <span>View Profile</span>
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
              
              {/* Empty state */}
              {(showFriendsLeaderboard && friends.length === 0) && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-10"
                >
                  <p className="text-gray-500">You haven't added any friends yet.</p>
                  <button 
                    onClick={() => setShowFriendsLeaderboard(false)}
                    className="mt-3 px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition-colors"
                  >
                    Browse Global Leaderboard
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </PageTransition>
  );
};

export default Leaderboard;