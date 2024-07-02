import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../UserContext.jsx';
import Request from '../mentor-requests/Request.jsx';
import MatchCard from '../../mentee/mentee-matches/MatchCard.jsx';
import './MentorMatches.css'
import config  from '../../../../config.js';

function MentorMatches() {
    const { user } = useContext(UserContext);
    const [mentorData, setMentorData] = useState(null);
    const [requests, setRequests] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch mentor-specific data using user ID from user context
    const fetchMentorData = async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/mentors/${user.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch mentor data');
            }
            const data = await response.json();
            setMentorData(data.mentor);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    // Fetch list of requests using mentor ID
    const fetchRequests = async (mentorId) => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/connect-requests/${mentorId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch requests');
            }
            const data = await response.json();
            setRequests(data.requests);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        if (user && user.id) {
            fetchMentorData();
        }
    }, [user]);

    useEffect(() => {
        if (mentorData && mentorData.id) {
            fetchRequests(mentorData.id);
        }
    }, [mentorData]);

    // callback function to update page
    const handleReqeustUpdate = (requestId) => {
        setRequests(prevRequests => prevRequests.filter(request => request.id !== requestId))
    }
    
    return(
        <>
        <div className='requests-list'>
            <h1>Matches</h1>
            {requests
                .filter(request => request.status === 'accepted')
                .map(request => (
                    <MatchCard 
                        key={request.id} 
                        menteeName={request.menteeName} 
                        menteeSchool={request.menteeSchool} 
                        menteeMajor={request.menteeMajor} 
                        requestId={request.id} 
                        onRequestUpdate={handleReqeustUpdate}
                    />
                ))
            }
        </div>
        </>
    )
}

export default MentorMatches