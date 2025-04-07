import React, { useState, useEffect, useRef } from 'react';
import { Link, redirect, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';

const NavBar = ({ isScrolled = false, gradientStyle = {} }) => {
  const { user, logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [rainbowVisible, setRainbowVisible] = useState(false);
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate()
  const [notif, setNotif] = useState(false);

  const SendNotification = ({ setNotif }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        setNotif(false);
      }, 5000);
      return () => clearTimeout(timer);
    }, [notif]);

    return(
      <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="fixed top-13 right-5 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg"
    >
      <Link to='/dashboard'>
      New Notification
      </Link>
     
    </motion.div>
    )
  }




  //Web socket to check for incoming messages at any time on any page since nav bar is on all pages

  const socketRef = useRef(null);

  useEffect(() => {

    if (!socketRef.current || socketRef.current.readyState > 1) {
      socketRef.current = new WebSocket("ws://127.0.0.1:8000/ws/volunteers/"); // opens the connection
    }

    const socket = socketRef.current;

    socket.onopen = () => {
      console.log("✅ WebSocket connected!");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if(data.message['to_volunteer'] === user.email){
        setNotif(true) 
      }
    };

    socket.onerror = (error) => {
      //console.error("❌ WebSocket error:", error);
    };

    socket.onclose = (event) => {
      //console.warn(`⚠️ WebSocket closed! Code: ${event.code}`);
      setTimeout(() => {
        socketRef.current = new WebSocket("ws://127.0.0.1:8000/ws/volunteers/");
      }, 3000);
    };

    return () => {
      socket.close();
    };
  }, [user]);


  useEffect(() => {
    // Delay the rainbow animation to start after page load
    const timer = setTimeout(() => {
      setRainbowVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50">
      {/* Rainbow Gradient Bar */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{
          scaleY: rainbowVisible ? 1 : 0,
          opacity: rainbowVisible ? 1 : 0
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut"
        }}
        className="h-1 w-full bg-gradient-to-r from-blue-500 via-emerald-400 to-blue-500 bg-[length:200%_auto] animate-gradient"
      />

      {/* Navbar Content */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to={user ? ('/dashboard') : ('/')} className="flex-shrink-0 flex items-center">
                <span
                  className={`transition-all duration-500 transform ${
                    isScrolled
                      ? "animate-gradient bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 bg-[length:200%_auto] bg-clip-text text-transparent text-xl font-semibold"
                      : "text-xl font-semibold text-gray-900"
                  }`}
                  style={isScrolled ? gradientStyle : {}}
                >
                  Volunteera
                </span>
              </Link>
            </div>
            {notif && (
              <SendNotification setNotif = {setNotif}/>
            )}

            {/* Desktop menu */}
            <div className="hidden sm:flex sm:items-center sm:space-x-6">
              {!user && (
                <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Home
                </Link>
              )}
              <Link to="/browse" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Browse
              </Link>

              {user ? (
                <div className="relative ml-3">
                  <button 
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-3 focus:outline-none group"
                  >
                    <div className="flex items-center">
                      {user.is_organization && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                          Organization
                        </span>
                      )}
                      <div className="flex items-center space-x-3">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt="Profile"
                            className="w-8 h-8 rounded-full object-cover border border-gray-200 group-hover:border-blue-400 transition-all"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-green-400 flex items-center justify-center text-white group-hover:shadow-md transition-all">
                            {user.email?.charAt(0).toUpperCase() || '?'}
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{user.email}</span>
                        <svg
                          className={`h-4 w-4 text-gray-500 transition-all duration-300 group-hover:text-blue-500 ${showProfileDropdown ? 'rotate-180 text-blue-500' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                  
                  {/* Profile Dropdown Menu */}
                  {showProfileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
                    >
                      <div className="py-1">
                        <Link to="/dashboard" className="group flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                          <svg className="mr-3 h-4 w-4 text-gray-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Dashboard
                        </Link>
                      </div>
                      
                      {user.is_organization && (
                        <div className="py-1 border-t border-gray-100">
                          <Link to="/opportunities/create" className="group flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                            <svg className="mr-3 h-4 w-4 text-gray-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create Opportunity
                          </Link>
                        </div>
                      )}
                      
                      {!user.is_organization && (
                        <div className="py-1 border-t border-gray-100">
                          <Link to="/friends" className="group flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                            <svg className="mr-3 h-4 w-4 text-gray-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Friends
                          </Link>
                        </div>
                      )}
                      
                      <div className="py-1 border-t border-gray-100">
                        <Link to="/leaderboard" className="group flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                          <svg className="mr-3 h-4 w-4 text-gray-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Leaderboard
                        </Link>
                      </div>
                      
                      <div className="py-1 border-t border-gray-100">
                        <Link to="/about" className="group flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                          <svg className="mr-3 h-4 w-4 text-gray-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          About Us
                        </Link>
                      </div>
                      
                      <div className="py-1 border-t border-gray-100 bg-red-50">
                        <button
                          onClick={handleLogout}
                          className="group flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <svg className="mr-3 h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <>
                  {/* Register Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowRegisterDropdown(!showRegisterDropdown)}
                      onBlur={() => setTimeout(() => setShowRegisterDropdown(false), 100)}
                      className="px-4 py-2 text-sm font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-colors flex items-center"
                    >
                      Register
                      <svg
                        className={`ml-2 h-4 w-4 transition-transform ${showRegisterDropdown ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {showRegisterDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                      >
                        <Link
                          to="/register/volunteer"
                          state={{ type: 'volunteer' }}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg flex items-center"
                        >
                          <span className="text-lg mr-2">🤝</span>
                          I'm a Volunteer
                        </Link>
                        <Link
                          to="/register"
                          state={{ type: 'organization' }}
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg flex items-center"
                        >
                          <span className="text-lg mr-2">🏢</span>
                          I'm an Organization
                        </Link>
                      </motion.div>
                    )}
                  </div>
                  
                  <Link to="/login" className="ml-3 px-4 py-2 text-sm font-medium rounded-full text-blue-600 border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center">
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center bg-white">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <span className="sr-only">Open main menu</span>
                {/* Hamburger icon */}
                <svg
                  className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/* Close icon */}
                <svg
                  className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden bg-white`}>
        <div className="pt-2 pb-3 space-y-1">
          {!user && (
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Home
            </Link>
          )}
          <Link
            to="/browse"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            Browse
          </Link>
          
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Dashboard
              </Link>
              
              {user.is_organization && (
                <Link
                  to="/opportunities/create"
                  className="block px-3 py-2 text-base font-medium text-green-600 hover:text-green-700 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Opportunity
                  </div>
                </Link>
              )}
              
              {!user.is_organization && (
                <Link
                  to="/friends"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Friends
                </Link>
              )}
              
              <Link
                to="/leaderboard"
                className='block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              >
                Leaderboard
              </Link>
              
              <Link
                to="/about"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                About Us
              </Link>
              
              <div className="px-3 py-2">
                {user.is_organization && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Organization
                  </span>
                )}
                <span className="block mt-1 text-sm font-medium text-gray-700">{user.email}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center"
              >
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </Link>
              <div className="px-3 py-2 space-y-1">
                <Link
                  to="/register"
                  state={{ type: 'volunteer' }}
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Register as Volunteer
                </Link>
                <Link
                  to="/register"
                  state={{ type: 'organization' }}
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Register as Organization
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
