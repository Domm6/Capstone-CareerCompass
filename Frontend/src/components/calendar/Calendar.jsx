import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext.jsx';
import config from '../../../config.js';
import moment from 'moment-timezone';
import './Calendar.css';
import CalendarModal from './CalendarModal.jsx';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

function Calendar() {
    const { user } = useContext(UserContext);
    const [meetings, setMeetings] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');
    const [userData, setUserData] = useState('')

    // check if mentor
    const isMentor = (user) => user.userRole === 'mentor';

    // Fetch user data (mentor or mentee)
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const url = isMentor(user)
                    ? `${config.apiBaseUrl}/mentors/${user.id}`
                    : `${config.apiBaseUrl}/mentees/${user.id}`;

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                setUserData(isMentor(user) ? data.mentor : data.mentee);
            } catch (error) {
                setErrorMessage(error.message);
            }
        };

        if (user && user.id) {
            fetchUserData();
        }
    }, [user]);

    // Fetch meetings for the user (mentor or mentee)
    const fetchMeetings = async (userId) => {
        try {
            const url = isMentor(user)
                ? `${config.apiBaseUrl}/meetings/mentor/${userId}`
                : `${config.apiBaseUrl}/meetings/mentee/${userId}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch meetings');
            }
            const data = await response.json();

            // Transform the meetings into FullCalendar event format
            const meetings = data.meetings.map(meeting => ({
                id: meeting.id,
                title: meeting.topic,
                status: meeting.status,
                backgroundColor: getMeetingColor(meeting.status),
                start: moment.utc(meeting.scheduledTime).local().format(),
                end: moment.utc(meeting.endTime).local().format(),
            }));

            setMeetings(meetings);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        if (userData && userData.id) {
            fetchMeetings(userData.id);
        }
    }, [userData]);

    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    }

    const handleMeetingScheduled = () => {
        if (userData && userData.id) {
            fetchMeetings(userData.id);
        }
    };

    const getMeetingColor = (status) => {
        if (status === 'accepted') {
            return 'green'
        } else if (status === 'pending') {
            return 'orange'
        } else if (status === 'declined') {
            return 'red'
        } else {
            return 'blue'
        }
    }

    return (
        <>
            <div className='add-meeting-btn'>
                <button onClick={handleModalToggle}>Add Meeting</button>
            </div>
            <div className='calendar-container'>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    events={meetings}
                    timeZone="UTC"
                />
            </div>
            {isModalOpen && (
                <CalendarModal
                    toggleModal={handleModalToggle}
                    onMeetingScheduled={handleMeetingScheduled}
                    isMentor={isMentor}
                ></CalendarModal>
            )}
        </>
    );
}

export default Calendar
