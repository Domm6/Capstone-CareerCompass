import { useState} from 'react'
import './MenteeDashboard.css'
import Calendar from '../../Calendar'
import Requests from '../../requests/Requests'
import { Link } from 'react-router-dom';
import MenteeMatches from '../mentee-matches/MenteeMatches'


function MenteeDashboard() {
    const [activeComponent, setActiveComponent] = useState('Calendar');

    return(
        <>
        <div className="mp-header">
            <h1>CareerCompass</h1>
            <div className='mp-nav'>
                <Link to="/mentee-profile">Profile</Link>
                <Link to="/matching">Find a Mentor</Link>
            </div>
        </div>
        <div className='md-container'>
            <div className='md-top'>
                <h1>Mentee Dashboard</h1>
            </div>
            <div className='md-nav'>
            <button onClick={() => setActiveComponent('Calendar')}>Calendar</button>
                <button onClick={() => setActiveComponent('Matches')}>Matches</button>
            </div>
            <div className='md-body'>
                {activeComponent == 'Calendar' &&  <Calendar></Calendar>}
                {activeComponent == 'Matches' &&  <MenteeMatches></MenteeMatches>}
            </div>
        </div>
        </>
    )
}

export default MenteeDashboard