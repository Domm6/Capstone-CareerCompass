import { useState} from 'react'
import { useNavigate } from 'react-router-dom';
import './MenteeProfile.css'

const PLACEHOLDER = "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";


function MenteeProfile() {

    const navigate = useNavigate();

    return(
        <>
        <div className="mp-header">
            <h1>CareerCompass!</h1>
        </div>
        <div className='mp-container'>
            <div className='mp-top'>
                <h1>Edit Mentee Profile</h1>
            </div>
            <div className='mp-body'>
                <div className='mp-left'>
                    <img src={PLACEHOLDER} alt="profile picture" />
                    <h3>John Doe</h3>
                </div>
                <div className='mp-right'>
                    <p>Industry: </p>
                    <p>Company: </p>
                    <p>Roles:</p>
                    <p>Years of Experience: </p>
                    <p>School: </p>
                    <p>Skills: </p>
                </div>
            </div>
            <button onClick={() => navigate('/mentee-dashboard')}>Save</button>
        </div>
        </>
    )
}

export default MenteeProfile