import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import "./mentor/mentor-profile/MentorProfileModal.css"
import config from '../../config.js';

function CalendarModal ({toggleModal}) {
    const {user} = useContext(UserContext);
    const [mentees, setMentees] = useState([]);
    const [mentorData, setMentorData] = useState(null);
    const [selectedMentee, setSelectedMentee] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [topic, setTopic] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Fetch mentor-specific data using user ID from user context
    useEffect(() => {
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

        if (user && user.id) {
        fetchMentorData();
        }
    }, [user]);

    // Fetch list of requests using mentor ID
    useEffect(() => {
        const fetchRequests = async (mentorId) => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/connect-requests/${mentorId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch requests');
            }
            const data = await response.json();
            const acceptedRequests = data.requests.filter(request => request.status === 'accepted');
            setMentees(acceptedRequests
                .filter(request => request.status === 'accepted')
                .map(request => ({
                    id: request.menteeId,
                    name: request.menteeName
            })));
        } catch (error) {
            setErrorMessage(error.message);
        }
        };

        if (mentorData && mentorData.id) {
        fetchRequests(mentorData.id);
        }
    }, [mentorData]);

    // schedule a meeting
    const handleScheduleMeeting = async (event) => {
        event.preventDefault();
    
        const scheduledTimeFull = `${scheduledDate}T${scheduledTime}:00.000Z`; // Combine date and time
        console.log(scheduledTimeFull)
    
        try {
          const response = await fetch(`${config.apiBaseUrl}/meetings`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              mentorId: mentorData.id,
              menteeId: selectedMentee,
              scheduledTime: scheduledTimeFull,
              topic,
            }),
          });
    
          if (response.ok) {
            alert('Meeting scheduled successfully');
            toggleModal();
          } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
          }
        } catch (error) {
            setErrorMessage(error.message)
        }
      };
    
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="modal-close" onClick={toggleModal}>×</span>
                <h3>Schedule Meeting:</h3>
                <form onSubmit={handleScheduleMeeting}>
                    <div className='form-group'>
                        <label htmlFor="mentee">Select Mentee</label>
                        <select id='mentee' value={selectedMentee} onChange={(event) => setSelectedMentee(event.target.value)} required>
                            <option value="">Select Mentee</option>
                            {mentees
                            .map((mentee) => (
                                <option key={mentee.id} value={mentee.id}>
                                {mentee.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='form-group'>
                        <label htmlFor="date">Date:</label>
                        <input type="date" id='date' value={scheduledDate} onChange={(event) => setScheduledDate(event.target.value)} required/>
                    </div>
                    <div className='form-group'>
                        <label htmlFor="time">Time:</label>
                        <input type="time" id='time' value={scheduledTime} onChange={(event) => setScheduledTime(event.target.value)} required/>
                    </div>
                    <div className='form-group'>
                        <label htmlFor="topic">Topic:</label>
                        <input type="text" id='topic' value={topic} onChange={(event) => setTopic(event.target.value)}/>
                    </div>
                    <button type='submit'>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default CalendarModal