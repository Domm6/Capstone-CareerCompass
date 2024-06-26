import { useState} from 'react'
import './MenteeDashboard.css'
import Calendar from './Calendar'
import Matches from './Matches'
import Requests from './Requests'

function MenteeDashboard() {
    const [activeComponent, setActiveComponent] = useState('Calendar');

    return(
        <>
        <div className="signup-header">
            <h1>Welcome to CareerCompass!</h1>
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
                {activeComponent == 'Matches' &&  <Matches></Matches>}
            </div>
        </div>
        </>
    )
}

export default MenteeDashboard