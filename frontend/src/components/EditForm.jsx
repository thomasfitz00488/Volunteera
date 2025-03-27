import React, { useEffect, useState } from 'react';
import { Map, AdvancedMarker, APIProvider } from '@vis.gl/react-google-maps';
import { useNavigate } from 'react-router';
import api from '../utils/api';
import PageTransition from './PageTransition';
import Spin from './LoadingSpinner';

const defaultCenter = {
  lat: 51.5074, // London coordinates as default
  lng: -0.1278
};

const EditForm = ({ currentData }) => {
    const [formData, setFormData] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [id, setId] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        if(currentData){
            setFormData(currentData);
            setId(currentData.id);
            setLoading(false);
            const lat = currentData.latitude;
            const lng = currentData.longitude;
            setMarker({lat, lng});
            
        }
        
    }, [currentData])
    

  const [marker, setMarker] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMapClick = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    
    setMarker({ lat, lng });
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));

    // Get address from coordinates using Geocoding service
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat, lng };
    
    try {
      const response = await geocoder.geocode({ location: latlng });
      if (response.results[0]) {
        setFormData(prev => ({
          ...prev,
          location_name: response.results[0].formatted_address
        }));
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
  
        const response = await api.post(`/opportunities/${id}/`, formData);
        if (response.status === 201) {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Error response:', err.response?.data);
        if (err.response?.status === 403) {
          setError('You must be logged in as an organization to edit opportunities');
        } else {
          setError(err.response?.data?.error || 'Failed to edit opportunity');
        }
      }
    
  };
  console.log(import.meta.env);
  return (
    <PageTransition>
        {isLoading ? (
      <div className="flex justify-center items-center h-screen">
        <Spin/>
      </div>) : (
        <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Edit Opportunity</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
  
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700">Requirements</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              required
              rows="4"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Average Start Time (24 hour clock)</label>
            <input
              type="number"
              max={24}
              min={0}
              name="start_time"
              value={formData.start_time}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Average End Time (24 hour clock)</label>
            <input
              type="number"
              max={24}
              min={0}
              name="end_time"
              value={formData.end_time}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estimated Duration (In Days)</label>
            <input
              type="number"
              min={0}
              name="estimated_duration"
              value={formData.duration}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="datetime-local"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="datetime-local"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity</label>
            <input
              type="number"
              min={0}
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estimated Effort</label>
            <select id="effort" value = {formData.estimated_effort_ranking} name="estimated_effort_ranking" onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            
            <div className="mt-2 h-[400px] w-full">
              <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <Map
                    defaultCenter={defaultCenter}
                    defaultZoom={13}
                    reuseMaps={true}
                    onClick={(e) => handleMapClick(e.detail.latLng)}
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
            <p className="mt-2 text-sm text-gray-500">Click on the map to set the location</p>
          </div>
  
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      )}
    </PageTransition>
    
  );
};

export default EditForm;
