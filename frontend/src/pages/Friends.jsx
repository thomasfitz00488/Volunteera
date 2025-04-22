import PageTransition from '../components/PageTransition';
import Spin from '../components/LoadingSpinner';
import api from '../utils/api';
import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import { FaUserPlus, FaUserCircle, FaEllipsisV } from 'react-icons/fa';

const Friends = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [volunteers, setVolunteers] = useState([]);
  const [FRIENDS, setFriends] = useState([]);
  const [sentRequests, setSent] = useState([]);
  const [FriendRequests, setReqs] = useState([]);
  const { user } = useUser();
  const [volunteer_id, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("friends");
  const [isOpen, setIsOpen] = useState(false);
  let user_id = 0

  function searchFriend() {
    let input = document.getElementById("searchBar").value.toLowerCase();
    let users = document.querySelectorAll(".user");

    users.forEach(user => {
        if (user.textContent.toLowerCase().includes(input)) {
            user.style.display = "block";
        } else {
            user.style.display = "none";
        }
    });
}

  const fetchUser = async () => {
    try {
      setIsLoading(true);

      if (!user) {
          console.error("User is null. Cannot fetch data.");
          return;
      }

      const response1 = await api.get('/volunteer/list/');
      const users = response1

      let possibleVolunteers = response1

      
      users.forEach(item =>{
          if (item.email === user.email){
              user_id = item.id;
              setUser(item.id);
          }
      })
      const response2 = await api.get('/volunteer/' + user_id + '/');
      setFriends(response2.friends);
      const friends = response2.friends;

      // filter so that none of your friends will show up as possible people to add
      possibleVolunteers = possibleVolunteers.filter(volunteer => !friends.some(friend => friend.id === volunteer.id))
      // filter so that the current user will not be able to add themselves
      possibleVolunteers = possibleVolunteers.filter(volunteer => volunteer.id !== user_id)

      const pendingRequestsData = await api.get('/friendship/list/pending/');
      const pendingRequests = pendingRequestsData;

      possibleVolunteers = possibleVolunteers.filter(volunteer => 
        !pendingRequests.some(req => 
          (req.from_volunteer === user_id && req.to_volunteer === volunteer.id) || 
          (req.to_volunteer === user_id && req.from_volunteer === volunteer.id)
        )
      );
// getting data for the already sent requests to allow a user to cancel them or just view them with the sentRequests variable
      const reqs = pendingRequests.filter(request => 
        request.from_volunteer === user_id && request.to_volunteer !== user_id
    );
    
      let sentRequests = []
      
      for (const req of reqs) {
        const response = await api.get('/volunteer/' + req.to_volunteer + '/');
        sentRequests.push(response);
      }
      setSent(sentRequests);

// getting data for the already sent requests to allow a user to cancel them or just view them with the sentRequests variable
      const reqst = pendingRequests.filter(request => 
        request.to_volunteer === user_id && request.from_volunteer !== user_id
    );
    
      let fRequests = []
      
      for (const req of reqst) {
        const response = await api.get('/volunteer/' + req.from_volunteer + '/');
        fRequests.push(response);
      }
      setReqs(fRequests);

      setVolunteers(possibleVolunteers);

    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setIsLoading(false);
    }
}

  useEffect(() => {
    
    if(user){
        fetchUser();
    }
    
  }, [user]);

  const deleteFriend = async (friendshipId) => {
    try {
        const response = await api.delete(`/friendship/delete/${friendshipId}/${volunteer_id}/`);

        fetchUser();

        setMessage(response.message);

    } catch (error) {
        console.error("Error deleting friendship:", error);
    }
};

const addFriend = async (friendshipId) => {
    try {
        // Ensure the request body is properly structured, if needed
        const response = await api.post(`/friendship/create/${friendshipId}/${volunteer_id}/`);
        fetchUser();
        setMessage(response.message);
    } catch (error) {
        console.error("Error creating friendship:", error);
    }
};
const acceptFriend = async (friendshipId) => {
    try {
        const response = await api.post(`/friendship/accept/${friendshipId}/${volunteer_id}/`, {
            headers: {
                "Content-Type": "application/json"
            },
        });

        fetchUser();

        setMessage(response.message);

    } catch (error) {
        console.error("Error creating friendship:", error);
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

  return (
    <PageTransition>
      {!isLoading ? (
        <div className="bg-gray-50 min-h-screen">
        {/* Header with gradient background - similar to Leaderboard */}
        <div className="bg-gradient-to-r from-blue-800 via-blue-600 to-purple-500 py-12 px-4 sm:px-6 lg:px-8 shadow-md">
          <div className="max-w-7xl mx-auto">
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-4xl font-bold text-white tracking-tight text-center"
            >
              Friends
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-3 text-xl text-blue-100 max-w-3xl mx-auto text-center"
            >
              Connect with other volunteers and build your community
            </motion.p>
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
                { id: "friends", label: "My Friends", icon: "👥" },
                { id: "friendRequests", label: "Friend Requests", icon: "📨" },
                { id: "sentRequests", label: "Sent Requests", icon: "📤" },
                { id: "search", label: "Find Friends", icon: "🔍" },
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
              {activeTab === "friends" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Friends</h2>
                  
                  {FRIENDS.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-10 bg-gray-50 rounded-lg"
                    >
                      <span className="text-5xl block mb-4">👋</span>
                      <h3 className="text-lg font-medium text-gray-900">No friends yet</h3>
                      <p className="text-gray-500 mt-2">Start connecting with other volunteers</p>
                      <button 
                        onClick={() => setActiveTab("search")}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-sm"
                      >
                        Find Friends
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                      {FRIENDS.map((friend) => (
                        <motion.div
                          key={friend.id}
                          variants={item}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-white border rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
                        >
                          <div className="p-5">
                            <div className="flex items-center space-x-4">
                              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                                {friend.display_name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-lg font-medium text-gray-900 truncate">
                                  {friend.display_name}
                                </p>
                              </div>
                              <div className="relative">
                                <button
                                  onClick={() => setIsOpen(isOpen === friend.id ? null : friend.id)}
                                  className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none rounded-full hover:bg-gray-100 transition"
                                >
                                  <FaEllipsisV />
                                </button>
                                
                                {isOpen === friend.id && (
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
                                  >
                                    <Link
                                      to={`/dashboard/volunteer/${friend.id}/`}
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white transition-colors"
                                    >
                                      View Profile
                                    </Link>
                                    <button
                                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                      onClick={() => deleteFriend(friend.id)}
                                    >
                                      Remove Friend
                                    </button>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-5 py-3">
                            <Link
                              to={`/dashboard/volunteer/${friend.id}/`}
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
              
              {activeTab === "friendRequests" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Pending Friend Requests</h2>
                  
                  {FriendRequests.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-10 bg-gray-50 rounded-lg"
                    >
                      <span className="text-5xl block mb-4">📭</span>
                      <h3 className="text-lg font-medium text-gray-900">No friend requests</h3>
                      <p className="text-gray-500 mt-2">You don't have any pending friend requests</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="space-y-4"
                    >
                      {FriendRequests.map((friend) => (
                        <motion.div 
                          key={friend.id} 
                          variants={item}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white border rounded-lg shadow-sm p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                {friend.display_name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-md font-medium text-gray-900">{friend.display_name}</p>
                                <p className="text-sm text-gray-500">Wants to connect with you</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => deleteFriend(friend.id)} 
                                className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition"
                              >
                                Decline
                              </button>
                              <button 
                                onClick={() => acceptFriend(friend.id)} 
                                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-sm transition"
                              >
                                Accept
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
              
              {activeTab === "sentRequests" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Sent Friend Requests</h2>
                  
                  {sentRequests.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-10 bg-gray-50 rounded-lg"
                    >
                      <span className="text-5xl block mb-4">📤</span>
                      <h3 className="text-lg font-medium text-gray-900">No sent requests</h3>
                      <p className="text-gray-500 mt-2">You haven't sent any friend requests yet</p>
                      <button 
                        onClick={() => setActiveTab("search")}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full shadow-sm hover:bg-blue-700 transition"
                      >
                        Find Friends
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="space-y-4"
                    >
                      {sentRequests.map((friend) => (
                        <motion.div 
                          key={friend.id} 
                          variants={item}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white border rounded-lg shadow-sm p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                {friend.display_name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-md font-medium text-gray-900">{friend.display_name}</p>
                                <p className="text-sm text-gray-500">Request pending</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => deleteFriend(friend.id)} 
                              className="px-4 py-2 border border-gray-300 text-red-600 rounded-full hover:bg-red-50 transition"
                            >
                              Cancel Request
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
              
              {activeTab === "search" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Find New Friends</h2>
                  
                  <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="searchBar"
                      onKeyUp={searchFriend}
                      type="text"
                      placeholder="Search for volunteers..."
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <Spin />
                    </div>
                  ) : volunteers.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-10 bg-gray-50 rounded-lg"
                    >
                      <span className="text-5xl block mb-4">🔍</span>
                      <h3 className="text-lg font-medium text-gray-900">No volunteers found</h3>
                      <p className="text-gray-500 mt-2">Try adjusting your search</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {volunteers.map((vol) => (
                        <motion.div 
                          className="user" 
                          key={vol.id}
                          variants={item}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="bg-white border rounded-lg shadow-sm hover:shadow transition overflow-hidden">
                            <div className="p-5">
                              <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                                  {vol.display_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-medium text-gray-900">{vol.display_name}</h3>
                                </div>
                              </div>
                              <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                <button 
                                  onClick={() => addFriend(vol.id)} 
                                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-sm transition"
                                >
                                  <FaUserPlus className="mr-1" size={14} />
                                  Add Friend
                                </button>
                                <Link
                                  to={`/dashboard/volunteer/${vol.id}/`}
                                  className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition"
                                >
                                  <FaUserCircle className="mr-1" size={14} />
                                  View Profile
                                </Link>
                              </div>
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
          
          {/* Notification Toast - Make more like Leaderboard */}
          <AnimatePresence>
            {message && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-md shadow-lg"
              >
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {message}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      ) : (
        <div className="flex justify-center py-12">
        <Spin />
      </div>
    )}
      
    </PageTransition>
  );
};

export default Friends;