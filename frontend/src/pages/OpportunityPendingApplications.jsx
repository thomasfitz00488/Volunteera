import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import PageTransition from '../components/PageTransition';
import Spin from '../components/LoadingSpinner';
import api from '../utils/api';

// Application Card component
const ApplicationCard = ({ volunteer, application, refresh }) => {

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
                onClick={() => handleApplication("rejected")}
                className="ml-auto inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-red-900 hover:bg-gray-800 transition-colors"
                >
                Reject
            </button>
            <button
                onClick={() => handleApplication("accepted")}
                className="ml-auto inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-green-900 hover:bg-gray-800 transition-colors"
                >
                Accept
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
                <div className='flex mt-3 mb-3'>
                    <h3 className='w-full'> Applications </h3>
                    <h3 className='w-full'> Requested Completion </h3>
                </div>

              <div className='flex'>




              <div className="flex flex-col md:flex-row justify-between gap-6">
                  {/* Application Side */}
                  <div className="w-full md:w-1/2">
                    <div className="grid grid-cols-1 gap-6">
                      {isLoading ? (
                        <div className="text-center py-12">
                          <Spin />
                        </div>
                      ) : volunteers.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-gray-500">No applications found</p>
                        </div>
                      ) : (
                        volunteers.map((volunteer) => (
                          <ApplicationCard
                            key={volunteer.id}
                            volunteer={volunteer}
                            application={volunteer.application}
                            refresh={fetchVolunteers}
                          />
                        ))
                      )}
                    </div>
                  </div>

                  {/* Requested Completion Side */}
                  <div className="w-full md:w-1/2">
                    <div className="grid grid-cols-1 gap-6">
                      {isLoading ? (
                        <div className="text-center py-12">
                          <Spin />
                        </div>
                      ) : volunteersRequested.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-gray-500">No applications found</p>
                        </div>
                      ) : (
                        volunteersRequested.map((volunteer) => (
                          <RequestCard
                            key={volunteer.id}
                            volunteer={volunteer}
                            application={volunteer.application}
                            refresh={fetchVolunteers}
                          />
                        ))
                      )}
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

export default OpportunityPendingApplications;
