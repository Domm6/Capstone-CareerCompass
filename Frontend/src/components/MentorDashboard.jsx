import { useState} from 'react'
import { UserContext } from '../UserContext.jsx';
import './MentorDashboard.css';
import Calendar from './Calendar.jsx';
import Matches from './Matches.jsx';
import Requests from './Requests.jsx';

function MentorDashboard() {
    const [activeComponent, setActiveComponent] = useState('Calendar');
    return(
        <>
        <div className="signup-header">
            <h1>Welcome to CareerCompass!</h1>
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