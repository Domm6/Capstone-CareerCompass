import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext.jsx';
import config from '../../config.js';
import './Calendar.css';
import CalendarModal from './CalendarModal.jsx';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

function Calendar() {
    const { user } = useContext(UserContext);
    const [events, setEvents] = useState([]);
    const [mentorData, setMentorData] = useState('');
    const [meetings, setMeetings] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch mentor data
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

    // Fetch mentor's meetings
    useEffect(() => {
        const fetchMeetings = async (mentorId) => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/meetings/mentor/${mentorId}`);
            if (!response.ok) {
            throw new Error('Failed to fetch meetings');
            }
            const data = await response.json();

            // Transform the meetings into FullCalendar event format
            const events = data.meetings.map(meeting => ({
            id: meeting.id,
            title: meeting.topic,
            start: meeting.scheduledTime,
            end: meeting.endTime,
            }));

            setEvents(events);
        } catch (error) {
            console.error('Error fetching meetings:', error);
        }
        };

        if (mentorData && mentorData.id) {
        fetchMeetings(mentorData.id);
        }
    }, [mentorData]);

    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
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
                    events={events}
                    // dateClick={handleDateClick}
                />
            </div>
            {isModalOpen && (
                <CalendarModal
                    toggleModal={handleModalToggle}
                ></CalendarModal>
            )}
        </>
    );
}

export default Calendar;
