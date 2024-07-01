import { useState} from 'react'
import { UserContext } from '../UserContext.jsx';
import { Link } from 'react-router-dom';

import './MentorDashboard.css';
import Calendar from './Calendar.jsx';
import Matches from './Matches.jsx';
import Requests from './Requests.jsx';

function MentorDashboard() {
    const [activeComponent, setActiveComponent] = useState('Calendar');
    return(
        <>
        <div className="mp-header">
            <h1>CareerCompass</h1>
            <div className='mp-nav'>
                <Link to="/mentor-profile">Profile</Link>
            </div>
        </div>
        <div className='md-container'>
            <div className='md-top'>
                <h1>Mentor Dashboard</h1>
            </div>
            <div className='md-nav'>
                <button onClick={() => setActiveComponent('Calendar')}>Calendar</button>
                <button onClick={() => setActiveComponent('Matches')}>Matches</button>
                <button onClick={() => setActiveComponent('Requests')}>Requests</button>
            </div>
            <div className='md-body'>
                {activeComponent == 'Calendar' &&  <Calendar></Calendar>}
                {activeComponent == 'Matches' &&  <Matches></Matches>}
                {activeComponent == 'Requests' &&  <Requests></Requests>}

            </div>
        </div>
        </>
    )
}

export default MentorDashboard