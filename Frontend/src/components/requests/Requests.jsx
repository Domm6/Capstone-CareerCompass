import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext.jsx';
import Request from './Request.jsx';
import './Requests.css';
import config from '../../../config.js';

function Requests() {

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
    }, [mentorData, requests]);

    return(
        <>
        <div className='requests-list'>
            <h1>Requests</h1>
            {requests
                .filter(request => request.status === 'pending')
                .map(request => (
                    <Request 
                        key={request.id} 
                        name={request.name} 
                        school={request.school} 
                        major={request.major} 
                        requestId={request.id} 
                    />
                ))
            }
        </div>
        </>
    )
}

export default Requests