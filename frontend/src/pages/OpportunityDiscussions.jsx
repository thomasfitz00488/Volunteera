import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router';
import PageTransition from '../components/PageTransition';
import { useUser } from '../contexts/UserContext';
import api from '../utils/api';
import { format } from 'date-fns';
import Spin from '../components/LoadingSpinner';

const DiscussionCard = ({ discussion, user, reload}) => {
    const [showDiscussion, setShowDiscussion] = useState(false);
    const [showAnserBox, setShowAnswerBox] = useState(false);
    const [formData, setFormData] = useState({id: discussion.id, answer: ''})
    const [error, setError] = useState('')


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            reload(prev => !prev);
            await api.post(`/opportunities/${discussion.id}/discussions/`, formData);
            setShowAnswerBox(false);
            reload(false);
            } catch (err) {
            console.error('Error response:', err.response?.data);
            if (err.response?.status === 403) {
                setError('You must be logged in as an organization to answer discussions');
            } else {
                setError(err.response?.data?.error || 'Failed to answer discussion');
            }
        }
    
    };

    async function deleteDis(){
        try {
            reload(prev => !prev);
            await api.delete(`/opportunities/${discussion.id}/discussions/`, formData);
            setShowAnswerBox(false);
            reload(false);
            } catch (err) {
            console.error('Error response:', err);
        }
    
    };


    return (
        <PageTransition>
            <div onClick={() => setShowDiscussion(!showDiscussion)} className='mt-3 bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:bg-blue-50 hover:cursor-pointer'>
                <div className="flex ">
                    <h3 className="text-lg font-semibold text-gray-900">{discussion.title}</h3>
                    <h4 className='ml-auto'> {format(new Date(discussion.time_created), 'MMMM dd, yyyy, h:mm')} </h4>
                </div>
                <div className='flex'>
                    <h2>{discussion.answer && !showDiscussion ? "1 Response" : discussion.answer ? null : "0 Responses"}</h2>
                </div>
                
                {showDiscussion && showAnserBox == false && !discussion.answer? (
                    <div className='flex'>
                        <h3> {discussion.content} </h3>
                        {discussion.volunteer_email == user.email ? 
                            <button 
                            onClick={() => deleteDis()}
                            className="ml-auto px-4 py-2 bg-blue-100 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-red-500 hover:text-white transition-colors duration-300"
                            >
                                Delete
                            </button>
                        : user.is_organization ? 
                            <button 
                                onClick={() => setShowAnswerBox(true)}
                                className="ml-auto px-4 bg-green-500 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-red-50"
                                >
                                Answer
                            </button> : null}
                    </div>
                ) : showDiscussion && discussion.answer ? <h3> Response: {discussion.answer} </h3> : null}

                {showAnserBox ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Answer</label>
                        <textarea
                            name="answer"
                            value={formData.answer}
                            onChange={handleInputChange}
                            required
                            rows="4"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Answer Discussion
                    </button>
                </form> 
                ) : null}

            </div>
            
            

      </PageTransition>
    );
  };

const CreateDiscussion = ({opportunity, onClose, id}) => {
    
    const [formData, setFormData] = useState({
        opportunity: opportunity.id,
        title: '',
        content: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/opportunities/${id}/`, formData);
            onClose()
        } catch (err) {
            console.error('Error response:', err.response?.data);
        }
        
      };

    return(
            <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-5xl w-full">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                name="title"
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Content</label>
                            <textarea
                                type="text"
                                name="content"
                                onChange={handleInputChange}
                                required
                                rows={10}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div className='flex'>
                        <button 
                            onClick={onClose} 
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                            Close
                        </button>
                
                        <div className="flex ml-auto space-x-4">
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </div>
                        
                        </div>
                    </form>
                    
                </div>
            </div>
            
    )
}


const OpportunityDiscussions = () => {
  const { id } = useParams();
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [opportunity, setOpportunity] = useState(null);
  const [discussions, setDiscussions] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const [loadingElsewhere, setLoadingElsewhere] = useState(false)
  const {user} = useUser();

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/opportunities/${id}/`, {
          withCredentials: true,
      });
      const response1 = await api.get(`/opportunities/${id}/discussions`, {
        withCredentials: true,
    });
        setOpportunity(response);
        setDiscussions(response1.sort((a, b) => new Date(b.time_created) - new Date(a.time_created)));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching opportunity:', error);
      }
    };
    fetchOpportunity();
  }, [id, showDiscussion, loadingElsewhere]);


  if (!opportunity) return null;

  return (
    <PageTransition>
        {isLoading ? (<div className="flex justify-center items-center h-screen">
            <Spin/>
        </div>) : (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb */}
            <nav className="flex">
                <Link to={`/opportunity/${id}`} className="text-sm text-gray-500 hover:text-gray-900">
                ← Back to {opportunity.title}
                </Link>
            
                {/* Application closing date */}
                <div className="lg:ml-auto">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Application closing date</h3>
                    <p className="text-gray-600">{format(new Date(opportunity.end_date), 'EEEE, MMMM dd, yyyy')}</p>
                    <button
                        type="button"
                        onClick={() => setShowDiscussion(true)}
                        className="px-4 py-2 ml-auto border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        {!showDiscussion ? "Create Discussion" : "Close Discussion"}
                    </button>
                </div>
            </nav>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Main Content */}
                <div className="lg:w-2/3">
                    <div className="space-y-8">
                        {/* Header */}
                        <div>
                            <h1 className="text-3xl mb-3 font-semibold text-gray-900">Discussions</h1>
                        </div>
                    </div>
                </div>

                
            </div>

            {showDiscussion && <CreateDiscussion className="w-full" opportunity={opportunity} id = {id} onClose={() => setShowDiscussion(false)} />}


            {discussions.length == 0 ? (
                <h3> No discussions yet, start one by clciking the button in the top right! </h3>
            ) : (
            discussions.map(dis => (
                <DiscussionCard key = {dis.id} discussion = {dis} user = {user} reload = {setLoadingElsewhere}/>
            ))
        )}
            </div>
        </div>
        )}
</PageTransition>
  );
};

export default OpportunityDiscussions;
