import { useState} from 'react'
import { UserContext } from '../UserContext.jsx';
import './Calendar.css'
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

function Calendar() {

    return(
        <>
        <div className='calendar-container'>
            <Fullcalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={'timeGridWeek'}
                headerToolbar={{
                    start: "today prev,next",
                    center: "title",
                    end: "", 
                }}
            />
        </div>
        <div className='add-event'>
            <button>Add Event</button>
        </div>
        </>
    )
}

export default Calendar