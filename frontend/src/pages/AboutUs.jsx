import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const TIMELINE = [
  {
    year: "2023",
    title: "Volunteera Launch",
    description: "Platform officially launched with 100+ partner organizations.",
    icon: "🚀"
  },
  {
    year: "2023",
    title: "Beta Testing",
    description: "Successfully completed beta testing with 1,000 volunteers.",
    icon: "🧪"
  },
  {
    year: "2022",
    title: "Development Begins",
    description: "Started development of the Volunteera platform.",
    icon: "💻"
  },
  {
    year: "2022",
    title: "Concept & Research",
    description: "Initial concept development and market research.",
    icon: "💡"
  },
];

const IMPACT_STATS = [
  { 
    number: 10000,
    label: "Volunteers",
    icon: "👥",
    description: "Active volunteers making a difference"
  },
  { 
    number: 500,
    label: "Organizations",
    icon: "🏢",
    description: "Partner organizations worldwide"
  },
  { 
    number: 50000,
    label: "Hours",
    icon: "⏰",
    description: "Volunteer hours contributed"
  },
  { 
    number: 100,
    label: "Communities",
    icon: "🌍",
    description: "Communities positively impacted"
  },
  { 
    number: 15,
    label: "Countries",
    icon: "🌎",
    description: "Countries where we're making an impact"
  }
];

// Team members data
const TEAM_MEMBERS = [
  {
    name: "Adel Anarbayeva",
    role: "Project Manager",
    bio: "Coordinating the team and ensuring timely delivery of features while maintaining project scope and quality.",
    linkedin: "#",
    image: "https://ui-avatars.com/api/?name=Adel+Anarbayeva&background=0D8ABC&color=fff"
  },
  {
    name: "Alex Morris",
    role: "Full Stack Developer",
    bio: "Experienced developer working on both frontend and backend components of the Volunteera platform.",
    linkedin: "#",
    image: "https://ui-avatars.com/api/?name=Alex+Morris&background=047857&color=fff"
  },
  {
    name: "Dylan Farrar",
    role: "Tech Lead",
    bio: "Overseeing technical implementation and architecture decisions to ensure platform scalability and reliability.",
    linkedin: "#",
    image: "https://ui-avatars.com/api/?name=Dylan+Farrar&background=6D28D9&color=fff"
  },
  {
    name: "Dzakwan Dzulzalani",
    role: "Frontend Developer",
    bio: "Focused on creating intuitive and responsive user interfaces to enhance the volunteer experience.",
    linkedin: "https://www.linkedin.com/in/amirdzakwan/",
    image: "https://ui-avatars.com/api/?name=Dzakwan+Dzulzalani&background=2563EB&color=fff"
  },
  {
    name: "Rudhr Shaji",
    role: "Designer",
    bio: "Creating visually appealing designs and user experiences that make volunteering accessible to everyone.",
    linkedin: "#",
    image: "https://ui-avatars.com/api/?name=Rudhr+Shaji&background=DB2777&color=fff"
  },
  {
    name: "Thomas Fitzsimons",
    role: "Full Stack Developer",
    bio: "Building comprehensive solutions across the entire application stack to deliver a seamless volunteering platform.",
    linkedin: "#",
    image: "https://ui-avatars.com/api/?name=Thomas+Fitzsimons&background=0891B2&color=fff"
  },
  {
    name: "William Rodriguez Ward",
    role: "Full Stack Developer",
    bio: "Developing end-to-end features with a focus on performance and security for the Volunteera platform.",
    linkedin: "#",
    image: "https://ui-avatars.com/api/?name=William+Rodriguez+Ward&background=9333EA&color=fff"
  }
];

// AnimatedCounter component for stat numbers
const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      const currentCount = Math.floor(easeOutQuart * value);
      
      setCount(currentCount);

      if (percentage < 1) {
        countRef.current = requestAnimationFrame(animate);
      }
    };

    countRef.current = requestAnimationFrame(animate);
    return () => {
      if (countRef.current) {
        cancelAnimationFrame(countRef.current);
      }
    };
  }, [value, duration]);

  return <>{count.toLocaleString()}</>;
};

// Detect when element is in viewport
const useInView = (threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isInView];
};

const AboutUs = () => {
  const [heroRef, heroInView] = useInView();
  const [missionRef, missionInView] = useInView();
  const [statsRef, statsInView] = useInView(0.05);
  const [timelineRef, timelineInView] = useInView(0.1);
  const [teamRef, teamInView] = useInView(0.1);

  return (
    <PageTransition>
      <div className="overflow-hidden">
        {/* Hero Section - Enhanced with more vibrant colors */}
        <div ref={heroRef} className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 opacity-90"
              animate={{ 
                background: [
                  "linear-gradient(to bottom right, #2563eb, #9333ea, #ec4899)",
                  "linear-gradient(to bottom right, #8b5cf6, #3b82f6, #06b6d4)",
                  "linear-gradient(to bottom right, #ec4899, #8b5cf6, #2563eb)"
                ]
              }}
              transition={{ 
                duration: 15, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            {/* Decorative circles */}
            <div className="absolute top-20 left-20 w-64 h-64 bg-white opacity-10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-10 right-20 w-72 h-72 bg-pink-300 opacity-10 rounded-full filter blur-3xl"></div>
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Making Volunteering <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-50">Accessible to Everyone</span>
              </h1>
              <p className="mx-auto mt-6 max-w-lg text-xl text-white sm:max-w-3xl">
                Connecting passionate volunteers with meaningful opportunities to create positive change in communities worldwide.
              </p>
            </motion.div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
              <path 
                fill="#EFFFFD" 
                fillOpacity="1" 
                d="M0,64L60,80C120,96,240,128,360,128C480,128,600,96,720,80C840,64,960,64,1080,64C1200,64,1320,64,1380,64L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Mission & About Section - Added gradient background */}
        <div ref={missionRef} className="bg-gradient-to-b from-[#EFFFFD] to-[#B8FFF9] py-12 sm:py-16 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-30"></div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={missionInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
              className="mx-auto max-w-3xl text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Mission</h2>
              <p className="mt-4 text-lg text-gray-700">
                Volunteera was born from a simple observation: while many people want to volunteer, 
                finding the right opportunity often proves challenging. Our platform bridges this gap, 
                making it easier for volunteers to connect with causes they care about.
              </p>
              <p className="mt-4 text-lg text-gray-700">
                By combining modern technology with social impact, we're creating a more connected 
                and engaged volunteering community.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Impact Stats Section - More subtle color scheme */}
        <div ref={statsRef} className="bg-gradient-to-r from-teal-50 to-blue-50 py-12 sm:py-16 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/inspiration-geometry.png')] opacity-5"></div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Impact</h2>
              <p className="mt-3 text-xl text-gray-600">
                Together we're making a difference in communities around the world
              </p>
            </div>
            
            <dl className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {IMPACT_STATS.map((stat, index) => {
                // Unified color scheme with subtle distinction
                const colors = [
                  "bg-blue-100 text-blue-800 border-blue-200",
                  "bg-teal-100 text-teal-800 border-teal-200",
                  "bg-purple-100 text-purple-800 border-purple-200",
                  "bg-amber-100 text-amber-800 border-amber-200",
                  "bg-cyan-100 text-cyan-800 border-cyan-200"
                ];
                
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={statsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative overflow-hidden rounded-lg ${colors[index]} p-6 text-center shadow-md border hover:shadow-lg transition-shadow duration-300`}
                  >
                    <dt className="truncate text-base font-medium flex items-center justify-center">
                      <span className="text-2xl mr-2">{stat.icon}</span>
                      <span>{stat.label}</span>
                    </dt>
                    <dd className="mt-2 text-3xl font-bold tracking-tight">
                      {statsInView ? <AnimatedCounter value={stat.number} /> : 0}
                      {stat.label === 'Hours' && '+'}
                    </dd>
                    <dd className="mt-3 text-sm opacity-80">{stat.description}</dd>
                  </motion.div>
                );
              })}
            </dl>
          </div>
        </div>

        {/* Timeline Section - More colorful timeline nodes */}
        <div ref={timelineRef} className="bg-gradient-to-b from-[#85F4FF] to-[#EFFFFD] py-16 sm:py-24 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/crisp-paper-ruffles.png')] opacity-20"></div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mx-auto max-w-2xl lg:max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">Our Journey</h2>
              <p className="mt-3 text-xl text-gray-600 text-center mb-12">
                The story of how Volunteera came to be
              </p>
              
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 -ml-px bg-gradient-to-b from-purple-400 via-blue-500 to-emerald-500 rounded-full"></div>
                
                <div className="space-y-16">
                  {TIMELINE.map((event, index) => {
                    // Create a different color for each timeline node
                    const nodeColors = ["bg-purple-500", "bg-blue-500", "bg-teal-500", "bg-emerald-500"];
                    
                    return (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                        animate={timelineInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="relative"
                      >
                        <div className={`flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className="flex-1">
                            <div className={`${index % 2 === 0 ? 'lg:pl-8' : 'lg:pr-8'} bg-white p-6 rounded-lg shadow-md relative hover:shadow-lg transition-shadow duration-300 border border-gray-100`}>
                              <div className="flex items-center">
                                <div className="flex-shrink-0 mr-4 text-3xl">{event.icon}</div>
                                <div>
                                  <div className="text-sm text-blue-600 font-semibold">{event.year}</div>
                                  <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                                </div>
                              </div>
                              <p className="mt-3 text-gray-600">{event.description}</p>
                              
                              {/* Arrow pointing to timeline */}
                              <div className={`absolute top-1/2 -mt-2.5 h-0 w-0 border-5 ${
                                index % 2 === 0 
                                  ? 'left-0 -ml-5 border-l-0 border-r-white border-t-transparent border-b-transparent' 
                                  : 'right-0 -mr-5 border-r-0 border-l-white border-t-transparent border-b-transparent'
                              }`}></div>
                            </div>
                          </div>
                          
                          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full ${nodeColors[index]} text-white relative z-10 shadow-md">
                            <span className="text-lg font-semibold">{TIMELINE.length - index}</span>
                          </div>
                          
                          <div className="flex-1"></div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div ref={teamRef} className="bg-gradient-to-b from-[#EFFFFD] to-white py-16 sm:py-24 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')] opacity-10"></div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mx-auto max-w-4xl text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Team</h2>
              <p className="mt-3 text-xl text-gray-600">
                Meet the passionate people behind Volunteera
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {TEAM_MEMBERS.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={teamInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col items-center">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-24 h-24 rounded-full object-cover border-2 border-blue-100 mb-4"
                      />
                      <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-blue-600 mb-3">{member.role}</p>
                      <p className="text-sm text-gray-600 text-center mb-4">{member.bio}</p>
                      <a 
                        href={member.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        LinkedIn
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-16 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="px-6 py-8 sm:p-10">
                <h3 className="text-2xl font-bold text-gray-900 text-center">Join Us Today</h3>
                <p className="mt-4 text-gray-600 text-center">
                  Whether you're looking to volunteer or seeking volunteers for your organization, 
                  Volunteera makes it easy to connect and make a difference.
                </p>
                <div className="mt-8 flex justify-center">
                  <a
                    href="/register"
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AboutUs;