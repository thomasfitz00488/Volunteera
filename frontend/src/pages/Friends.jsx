import React, { useState, useEffect } from 'react';
import PageTransition from '../components/PageTransition';
import api from '../utils/api';
import { useUser } from '../contexts/UserContext';
import Spin from '../components/LoadingSpinner';
import { Link } from 'react-router';

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
        console.log(response.message)

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

  return (
    <PageTransition>
      <div className="bg-gray-50 min-h-screen pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Friends</h1>
            <p className="mt-3 text-xl text-gray-500 max-w-3xl mx-auto">
              Connect with other volunteers and build your community
            </p>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-xl shadow-sm mb-8">
            <div className="flex flex-wrap sm:flex-nowrap border-b">
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
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "friends" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Friends</h2>
                  
                  {FRIENDS.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                      <span className="text-5xl block mb-4">👋</span>
                      <h3 className="text-lg font-medium text-gray-900">No friends yet</h3>
                      <p className="text-gray-500 mt-2">Start connecting with other volunteers</p>
                      <button 
                        onClick={() => setActiveTab("search")}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                      >
                        Find Friends
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {FRIENDS.map((friend) => (
                        <div key={friend.id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
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
                                  className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                  </svg>
                                </button>
                                
                                {isOpen === friend.id && (
                                  <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                                    <Link
                                      to={`/dashboard/volunteer/${friend.id}/`}
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      View Profile
                                    </Link>
                                    <button
                                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                      onClick={() => deleteFriend(friend.id)}
                                    >
                                      Remove Friend
                                    </button>
                                  </div>
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
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === "friendRequests" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Pending Friend Requests</h2>
                  
                  {FriendRequests.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                      <span className="text-5xl block mb-4">📭</span>
                      <h3 className="text-lg font-medium text-gray-900">No friend requests</h3>
                      <p className="text-gray-500 mt-2">You don't have any pending friend requests</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {FriendRequests.map((friend) => (
                        <div key={friend.id} className="bg-white border rounded-lg shadow-sm p-4">
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
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                              >
                                Decline
                              </button>
                              <button 
                                onClick={() => acceptFriend(friend.id)} 
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                              >
                                Accept
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === "sentRequests" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Sent Friend Requests</h2>
                  
                  {sentRequests.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                      <span className="text-5xl block mb-4">📤</span>
                      <h3 className="text-lg font-medium text-gray-900">No sent requests</h3>
                      <p className="text-gray-500 mt-2">You haven't sent any friend requests yet</p>
                      <button 
                        onClick={() => setActiveTab("search")}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                      >
                        Find Friends
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sentRequests.map((friend) => (
                        <div key={friend.id} className="bg-white border rounded-lg shadow-sm p-4">
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
                              className="px-4 py-2 border border-gray-300 text-red-600 rounded-md hover:bg-red-50 transition"
                            >
                              Cancel Request
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === "search" && (
                <div>
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
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                      <span className="text-5xl block mb-4">🔍</span>
                      <h3 className="text-lg font-medium text-gray-900">No volunteers found</h3>
                      <p className="text-gray-500 mt-2">Try adjusting your search</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {volunteers.map((vol) => (
                        <div className="user" key={vol.id}>
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
                                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                >
                                  <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                  </svg>
                                  Add Friend
                                </button>
                                <Link
                                  to={`/dashboard/volunteer/${vol.id}/`}
                                  className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                                >
                                  View Profile
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Success Message Toast */}
          {message && (
            <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-md shadow-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {message}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Friends;