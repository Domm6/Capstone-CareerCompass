import { useState} from 'react'
import { UserContext } from '../../UserContext.jsx';
import "./MatchModal.css"

const PLACEHOLDER = "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";


function MatchModal({mentor, closeModal}) {
    const { User: user } = mentor; // Access user data from mentor

    return (
        <>
        <div className="modal">
            <div className="modal-content">
                <span className="modal-close" onClick={closeModal}>×</span>
                <div className='mp-container'>
                    <div className='mp-body'>
                        <div className='mp-left'>
                            <img src={PLACEHOLDER} alt="profile picture" />
                            <h3>{user.name}</h3>
                        </div>
                        <div className='mp-right'>
                            <p>Industry: {mentor.industry}</p>
                            <p>Company: {mentor.company}</p>
                            <p>Role: {mentor.work_role}</p>
                            <p>Years of Experience: {mentor.years_experience} years</p>
                            <p>School: {mentor.school} </p>
                            <p>Skills: {mentor.skills}</p>
                            <p>Bio: {mentor.bio || "No Bio Available"}</p>
                        </div>
                    </div>
                    <button id='save-button'>Connect</button>
                </div>  
            </div>
        </div>
        </>
    )

}

export default MatchModal