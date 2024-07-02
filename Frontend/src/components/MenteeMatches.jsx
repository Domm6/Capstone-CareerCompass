import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext.jsx';
import Request from './requests/Request.jsx';
import MatchCard from './MatchCard.jsx';
import './Matches.css'
import config  from '../../config.js';

function MenteeMatches() {
    const { user } = useContext(UserContext);
    const [menteeData, setMenteeData] = useState(null);
    const [requests, setRequests] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch mentee-specific data using user ID from user context
    const fetchMenteeData = async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/mentees/${user.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch mentee data');
            }
            const data = await response.json();
            setMenteeData(data.mentee);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    // Fetch list of requests using mentee ID
    const fetchRequests = async (menteeId) => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/connect-requests/mentee/${menteeId}`);
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
            fetchMenteeData();
        }
    }, [user]);

    useEffect(() => {
        if (menteeData && menteeData.id) {
            fetchRequests(menteeData.id);
        }
    }, [menteeData]);

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
                        name={request.name} 
                        school={request.school} 
                        major={request.major} 
                        requestId={request.id}
                        onRequestUpdate={handleReqeustUpdate}
                    />
                ))
            }
        </div>
        </>
    )
}

export default MenteeMatches