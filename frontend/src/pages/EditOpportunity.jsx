import React from 'react';
import EditForm from '../components/EditForm';
import PageTransition from '../components/PageTransition';
import { useParams } from 'react-router';
import { useState } from 'react';
import { useEffect } from 'react';
import api from '../utils/api';

const EditOpportunity = () => {


  const [opp, setOpp] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function fetchOpp() {
      try {
        const response = await api.get(`/opportunities/${id}/`);
        setOpp(response);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
      }
    }

    if (id) {
      fetchOpp();
    }
    }, [id]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <EditForm currentData = {opp}/>
        </div>
      </div>
    </PageTransition>
  );
};

export default EditOpportunity;
