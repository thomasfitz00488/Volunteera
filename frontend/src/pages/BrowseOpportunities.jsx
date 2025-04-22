import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { FaCheckCircle } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import Spin from '../components/LoadingSpinner';
import api from '../utils/api';

// Verification badge component
const VerificationBadge = ({ type }) => {
  const badges = {
    companiesHouse: {
      label: "UK Companies House Verified",
      color: "bg-blue-50 text-blue-700 border border-blue-200",
    },
    charitiesCommission: {
      label: "UK Charity Commission Verified",
      color: "bg-purple-50 text-purple-700 border border-purple-200",
    }
  };

  const badge = badges[type];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badge.color} gap-1.5`}
      title={badge.label}
    >
      {badge.label}
      <FaCheckCircle className="w-3 h-3" />
    </span>
  );
};

// Opportunity Card component
const OpportunityCard = ({ opportunity }) => {
  return (
    <div className='opportunity'>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="p-6">
          {/* Header section */}
          <div className="flex flex-col gap-4">
            {/* Title and Organization */}
            <div className="flex items-start gap-3">
              <span className="text-2xl">{opportunity.image || '📋'}</span>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {opportunity.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {opportunity.organization.name} {opportunity.organization.approved && ("✔️")}
                </p>
              </div>
              <h4 className='text-sm text-gray-500'>
                  Effort: {opportunity.effort}
              </h4>
            </div>

            {/* Verification Badges */}
            <div className="flex flex-wrap gap-2">
              {opportunity.organization.companiesHouseVerified && (
                <VerificationBadge type="companiesHouse" />
              )}
              {opportunity.organization.charitiesCommissionVerified && (
                <VerificationBadge type="charitiesCommission" />
              )}
            </div>
          </div>

          {/* Description */}
          <p className="mt-4 text-gray-600">
            {opportunity.description}
          </p>

          {/* Tags */}
          {opportunity.tags && (
            <div className="mt-4 flex flex-wrap gap-2">
              {opportunity.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 flex justify-between items-center">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <span>📍</span> {opportunity.location_name}
              </span>
            </div>
            <Link
              to={`/opportunity/${opportunity.id}`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const BrowseOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [sortedOpportunities, setSortedOpportunities] = useState([...opportunities]);
  function searchOpportunity() {
    let input = document.getElementById("searchBar").value.toLowerCase();
    let opportunities = document.querySelectorAll(".opportunity");

    opportunities.forEach(opportunity => {
        if (opportunity.textContent.toLowerCase().includes(input)) {
            opportunity.style.display = "block";
        } else {
            opportunity.style.display = "none";
        }
    });
}


  useEffect(() => {
    fetchOpportunities();
  }, []);

  async function fetchOpportunities() {
    try {
      setIsLoading(true);
      const response = await api.get('/opportunities/');
      setOpportunities(response);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  async function orderOpportunities(order) {
    //const response = await api.post('/opportunities/filter/', {opportunities, order});
    let ordered = [...opportunities];
    if (order === "Closest Deadline") {
        setOpportunities(opportunities.sort((a, b) => new Date(a.end_date) - new Date(b.end_date)));
    } else if (order === "Furthest Deadline") {
        setOpportunities(opportunities.sort((a, b) => new Date(b.end_date) - new Date(a.end_date)));
    } else if (order === "Newest") {
        setOpportunities(opportunities.sort((a, b) => new Date(b.date_created) - new Date(a.date_created)));
    } else if (order === "Oldest") {
        setOpportunities(opportunities.sort((a, b) => new Date(a.date_created) - new Date(b.date_created)));
    } else if (order === "Largest Capacity") {
        setOpportunities(opportunities.sort((a, b) => a.capacity - b.capacity));
    } else if (order === "Smallest Capacity") {
        setOpportunities(opportunities.sort((a, b) => b.capacity - a.capacity));
    } else if (order === "Close to Capacity") {
      setOpportunities(opportunities.sort((a, b) => (a.capacity - a.current_count) - (b.capacity - b.current_count)));
    } else if (order === "Low to High Duration") {
      setOpportunities(opportunities.sort((a, b) => a.duration - b.duration));
    } else if (order === "High to Low Duration") {
      setOpportunities(opportunities.sort((a, b) => b.duration - a.duration));
    } else {
        fetchOpportunities();
    }
    setSortedOpportunities(ordered);
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/categories/');
        setCategories(response);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  function filterOpportunities(category) {

    let arr = [];
    opportunities.forEach(opp => {
      if(opp.categories.includes(category)){
        arr.push(opp)
      }
    })
    setOpportunities(arr)
  }


  function clearFilters() {
    fetchOpportunities()
  }

  const [formData, setFormData] = useState({
      postcode: null,
      max_distance: null,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/opportunities/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
      }

      const data = await response.json();
      setOpportunities(data)
      localStorage.setItem('token', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err) {}
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Discover Opportunities</h1>
            <p className="mt-2 text-gray-600">Explore volunteer opportunities near you</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-8">
                {/* Categories Section */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Categories</h2>
                  <div className="space-y-2">
                    {isLoading ? (
                    <div className="col-span-2 text-center py-12">
                      <Spin/>
                    </div>) : (

                    <div>

                    {categories.map(category => (
                      <div key= {category.id} className="w-full">
                        <label className="w-full"><button onClick = {() => filterOpportunities(category.name)} name={category.name} className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"> {category.name} <span className="text-gray-400 ml-auto">{category.count}</span></button></label>

                        </div>
                    ))}
                    <button
                      onClick={clearFilters}
                      className="bg-white-500 text-grey px-4 py-2 rounded mt-2 w-full hover:bg-gray-50"
                    >
                      Clear Filters
                    </button>
                  </div>
                    ) }
                </div>
                </div>

                {/* Locations Section */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Location</h2>
                  <form className="space-y-2" onSubmit={handleSubmit}>
                      <input
                        id='user_postcode'
                        type="text"
                        placeholder="Your Postcode..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                        onChange={(e) => setFormData({...formData, postcode: e.target.value})}
                      />
                      <input
                        id='max_distance'
                        type="number"
                        placeholder="Distance in km..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                        onChange={(e) => setFormData({...formData, max_distance: e.target.value})}
                      />
                      <button className="hover:cursor-pointer bg-white-500 text-grey px-4 py-2 rounded mt-2 w-full hover:bg-gray-50" type='submit'>Submit</button>
                  </form>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search and Filters */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    id='searchBar'
                    type="text"
                    onKeyUp={searchOpportunity}
                    placeholder="Search opportunities..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
                <div>
                  <select 
                    onChange={(e) => orderOpportunities(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 hover:cursor-pointer"
                  >
                    <option value="">Sort By</option>
                    <option value="Closest Deadline">Closest Deadline</option>
                    <option value="Furthest Deadline">Furthest Deadline</option>
                    <option value="Newest">Newest</option>
                    <option value="Oldest">Oldest</option>
                    <option value="Largest Capacity">Largest Capacity</option>
                    <option value="Smallest Capacity">Smallest Capacity</option>
                    <option value="Close to Capacity">Close to Capacity</option>
                    <option value="Low to High Duration">Shortest Duration</option>
                    <option value="High to Low Duration">Longest Duration</option>
                  </select>
                  </div>
              </div>

              {/* Opportunities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                  <div className="col-span-2 text-center py-12">
                    <Spin/>
                  </div>
                ) : opportunities.length === 0 ? (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-gray-500">No opportunities found</p>
                  </div>
                ) : (
                  opportunities.map(opportunity => (
                    <OpportunityCard
                      key={opportunity.id}
                      opportunity={opportunity}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default BrowseOpportunities;
