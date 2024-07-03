import React, { useState, useEffect } from 'react';
import { UserContext } from '../UserContext.jsx';
import './Calendar.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

function Calendar() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Fetch events from your API or database
        // setEvents(fetchedEvents);
    }, []);

    const handleDateClick = (info) => {
        // Handle date click event to schedule a new meeting
        console.log('Date clicked:', info.dateStr);
    };

    return (
        <>
            <div className='calendar-container'>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    events={events}
                    dateClick={handleDateClick}
                />
            </div>
        </>
    );
}

export default Calendar;
