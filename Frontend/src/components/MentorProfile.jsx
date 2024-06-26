import { useState} from 'react'
import './MentorProfile.css'

const PLACEHOLDER = "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";


function MentorProfile() {
    return(
        <>
        <div className="mp-header">
            <h1>CareerCompass!</h1>
        </div>
        <div className='mp-container'>
            <div className='mp-top'>
                <h1>Edit Mentor Profile</h1>
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
            <button>Save</button>
        </div>
        </>
    )
}

export default MentorProfile