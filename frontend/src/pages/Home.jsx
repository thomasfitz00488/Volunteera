import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router';
import PageTransition from '../components/PageTransition';
import useInView from '../hooks/useInView';

const Home = () => {
  const [gradientPosition, setGradientPosition] = useState(0);
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const optionsRef = useRef(null);
  const isOptionsInView = useInView(optionsRef);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setGradientPosition(scrollPosition * 0.2);
      setIsHeaderCompact(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToOptions = () => {
    optionsRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
  };

  // Add this style to your title span
  const gradientStyle = {
    backgroundPosition: `${gradientPosition}% 50%`,
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-emerald-400 to-blue-500 bg-[length:400%_400%] animate-gradient">
        <div className="min-h-screen bg-white/90"> {/* Reduced opacity for more color */}
          <div className="relative backdrop-blur-sm"> {/* Added subtle blur effect */}
            <div className="relative">
              {/* Hero Section */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
                <div className="text-center py-20">
                  <h1 
                    className={`text-4xl tracking-tight font-semibold text-gray-900 sm:text-5xl md:text-6xl transition-all duration-500
                      ${isHeaderCompact ? 'opacity-0' : 'opacity-100'}`}
                  >
                    <span className="block mb-4">Welcome to</span>
                    <span className="block relative">
                      <span className="inline-block relative">
                        <span 
                          className="animate-gradient bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 bg-[length:200%_auto] bg-clip-text text-transparent"
                          style={gradientStyle}
                        >
                          Volunteera
                        </span>
                      </span>
                    </span>
                  </h1>
                  <div className="h-6"></div> {/* Smaller spacer */}
                  <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500">
                    Explore volunteer opportunities near you, browse by category, or check out some of the great community events.
                  </p>
                  <div className="mt-10 flex justify-center gap-4">
                    <Link
                      to="/browse"
                      className="px-8 py-3 text-sm font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                    >
                      Browse Opportunities
                    </Link>
                    <button
                      onClick={scrollToOptions}
                      className="px-8 py-3 text-sm font-medium rounded-full text-gray-900 border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      Sign Up Now
                    </button>
                  </div>
                </div>

                {/* Scroll indicator */}
                <div className="flex justify-center mt-20 animate-bounce">
                  <svg 
                    className="w-6 h-6 text-gray-400 cursor-pointer"
                    fill="none" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    onClick={scrollToOptions}
                  >
                    <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                </div>

                {/* Options Section */}
                <div className="py-32" ref={optionsRef}>
                  <div 
                    className={`max-w-4xl mx-auto grid grid-cols-1 gap-8 md:grid-cols-2 transition-all duration-1000 transform
                      ${isOptionsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  >
                    {/* Volunteer Option */}
                    <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                          <span className="text-3xl">🤝</span>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">I'm a Volunteer</h3>
                        <p className="text-gray-600 mb-6">
                          Join our community of volunteers and make a difference in your local area. Find opportunities that match your interests and skills.
                        </p>
                        <Link
                          to="/register/volunteer"
                          className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700"
                        >
                          Get Started
                          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>

                    {/* Organization Option */}
                    
                    
                      
                        
                        
                        
                        <Link
                          to="/register/organization"
                          className="inline-flex items-center text-green-600 font-medium group-hover:text-green-700"
                        >
                          <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-green-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            </div>
                            <div className="relative">
                              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <span className="text-3xl">🏢</span>
                              </div>
                              <h3 className="text-2xl font-semibold text-gray-900 mb-4">I'm an Organization</h3>
                              <p className="text-gray-600 mb-6">
                              Connect with passionate volunteers and manage your opportunities efficiently. Post opportunities and find the perfect match.
                              </p>
                              Get Started
                              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </Link>
                      
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Home;
