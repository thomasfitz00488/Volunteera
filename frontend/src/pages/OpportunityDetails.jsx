import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import PageTransition from '../components/PageTransition';
import api from '../utils/api';
import { format } from 'date-fns';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Map, AdvancedMarker, APIProvider } from '@vis.gl/react-google-maps';
import { useUser } from '../contexts/UserContext';


const OpportunityDetails = () => {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDates, setSelectedDates] = useState([])
  const [marker, setMarker] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate()
  


  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const response = await api.get(`/opportunities/${id}/`, {
          withCredentials: true,
      });
        setOpportunity(response);
        initMap(response);
        const x = {
          lat: response.latitude,
          lng: response.longitude
        };
        setMarker({ x });
        console.log(response)
      } catch (error) {
        console.error('Error fetching opportunity:', error);
      }
    };
    fetchOpportunity();
  }, [id]);

  const initMap = (opportunity) => {
    if (!window.google || !mapRef.current || !opportunity.latitude || !opportunity.longitude) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 15,
      center: { lat: opportunity.latitude, lng: opportunity.longitude }
    });

    new window.google.maps.Marker({
      position: { lat: opportunity.latitude, lng: opportunity.longitude },
      map,
      title: opportunity.title
    });
  };

  const handleDateClick = (clickedDate) => {

    setSelectedDates((prevDates) => {
      let index = -1
    for (let i = 0; i < prevDates.length; i++) {
      if (prevDates[i].getTime() === clickedDate.getTime()) {
        index = i;
        break;
      }
    }

    if (index !== -1) {
      const updatedDates = [...prevDates];
      updatedDates.splice(index, 1);
      return updatedDates;
    } else {
      return [...prevDates, clickedDate]
    }
    });
  }

  const handleConfirm = () => {
    setShowModal(false);
    handleApply(selectedDates)
  }


  const handleApply = async (selectedDates) => {
    try {
      await api.post(`/opportunities/${id}/apply/`, {
        dates: selectedDates.map(date => date.toISOString().split("T")[0]),
    })

      // Refresh opportunity data to update application status
      const response = await api.get(`/opportunities/${id}/`, {
        withCredentials: true,
      });
      setOpportunity(response);
    } catch (error) {
      console.error('Error applying:', error);
    }
  };

  const isDateAvailible = (date) => {
    const startObject = new Date(opportunity.start_date)
    const endObject = new Date(opportunity.end_date)
    const dateTime = date.getTime();
    const startTime = startObject.getTime();
    const endTime = endObject.getTime();

    return dateTime >= startTime && dateTime <= endTime
  }

  const copyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        alert("URL copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err);
      });
  };

  if (!opportunity) return null;
  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link to="/browse" className="text-sm text-gray-500 hover:text-gray-900">
              ← Back to opportunities
            </Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {/* Header */}
                <div>
                  <div className="text-6xl mb-6">
                    {opportunity.image?.logo || opportunity.image?.name || '📷'}
                  </div>
                  <h1 className="text-3xl font-semibold text-gray-900">{opportunity.title}</h1>
                  <div className="mt-4 flex items-center space-x-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {opportunity.category}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500">{opportunity.organization?.name}</span>
                    <span className="text-gray-500">{opportunity.organization.approved && ("✔️")}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl font-medium text-gray-900 mb-4">About this opportunity</h2>
                  <p className="text-gray-600">{opportunity.description}</p>
                </div>

                {/* Requirements */}
                <div>
                  <h2 className="text-xl font-medium text-gray-900 mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {opportunity.requirements && opportunity.requirements.split('\n').filter(req => req.trim()).map((req, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {req.trim()}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Impact */}
                <div>
                  <h2 className="text-xl font-medium text-gray-900 mb-4">Date</h2>
                  <p className="text-gray-600">{opportunity.start_date.split("T")[0]} to {opportunity.end_date.split("T")[0]}</p>
                </div>

                <div>
                  <h2 className="text-xl font-medium text-gray-900 mb-4">Estimated Shift Times</h2>
                  <p className="text-gray-600">{opportunity.start_time}:00 - {opportunity.end_time}:00</p>
                </div>
                <div>
                  <h2 className="text-xl font-medium text-gray-900 mb-4">Estimated Impact</h2>
                  <p className="text-gray-600">You could recieve {opportunity.estimated_points} points or more!</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-gray-50 rounded-xl p-6 space-y-6">
                {/* Date & Time */}
                <div className='flex'>
                  <h3 className="text-sm font-medium text-gray-900 mr-3">Effort Ranking: </h3>
                  <p className="text-gray-600">{opportunity.estimated_effort_ranking.charAt(0).toUpperCase() + opportunity.estimated_effort_ranking.slice(1)}</p>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Location</h3>
                  <div className="flex items-center text-gray-600">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {opportunity.location_name}
                  </div>
                </div>

                {/* Application closing date */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Application closing date</h3>
                  <p className="text-gray-600">{format(new Date(opportunity.end_date), 'EEEE, MMMM dd, yyyy')}</p>
                </div>

                {/* Apply Button */}
                <button
                  className="w-full px-6 py-3 text-sm font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                  onClick={user ? (() => setShowModal(true)) : (() => navigate('/login'))}
                  disabled={opportunity.has_applied}
                >
                  {opportunity.has_applied ? 'Applied' : 'Apply Now'}
                </button>

                {/*Calendar Modal */}
                {showModal && (
                  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg font-bold">Select a Date or Dates</h2>
                    <p className="text-gray-600">Choose when you want to apply for.</p>
                    
                    <Calendar onClickDay={handleDateClick} tileClassName={({ date }) =>
                  selectedDates.some((d) => d.getTime() === date.getTime()) ? "highlight" : null
                  } 
                  tileDisabled={({ date }) => !isDateAvailible(date)}
                  />
                    
                    <p className="font-semibold mt-2">Selected Dates:</p>
                    {selectedDates.map((d, index) => (
                      <p key={index} className="ml-4">{d.toDateString()}</p>
                    ))}

                    <div className="flex justify-end space-x-4 mt-4">
                      <button 
                        onClick={() => setShowModal(false)} 
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded">
                        Cancel
                      </button>
                      <button 
                        onClick={handleConfirm} 
                        className="px-4 py-2 bg-blue-500 text-white rounded">
                        Confirm Date
                      </button>
                    </div>
                  </div>
                </div>
              )}
                <div className="flex w-full gap-4">
                <Link 
                  to={`/opportunity/${id}/discussions`} 
                  className="w-1/2 px-10 py-3 text-sm font-medium rounded-full text-gray-900 border border-gray-200 hover:bg-gray-50 transition-colors text-center"
                >
                  Discussions
                </Link>
                <button 
                  onClick = {copyLink}className="w-1/2 px-10 py-3 text-sm font-medium rounded-full text-gray-900 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Share Opportunity
                </button>
              </div>
              </div>
              
            </div>
          </div>
          <div className="mt-2 h-[400px] w-full">
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <Map
                defaultCenter={marker}
                defaultZoom={13}
                reuseMaps={true}
                mapId="107f378fc363e5a7"
            >
                {marker && (
                <AdvancedMarker
                    position={marker}
                />
                )}
            </Map>
          </APIProvider>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default OpportunityDetails;
