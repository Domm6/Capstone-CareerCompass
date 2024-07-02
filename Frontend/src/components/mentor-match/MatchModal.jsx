import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext.jsx';
import config from '../../../config.js';
import "./MatchModal.css";

const PLACEHOLDER = "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";

function MatchModal({mentor, closeModal, mentee}) {
    const { user } = useContext(UserContext);  // Access the user context
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const reqData = {
            mentorId: mentor.id,
            menteeId: mentee.id,
            name: user.name,
            school: mentee.school,
            major: mentee.major,
            status: 'pending'
        };

        try {
            const response = await fetch(`${config.apiBaseUrl}/connect-requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqData),
            });

            if (response.ok) {
                // Close the modal after a successful update
                closeModal();
            } else {
                const data = await response.json();
                setErrorMessage(data.error || 'Error creating connect request');
            }
        } catch (error) {
            setErrorMessage('Error creating connect request');
            console.error('Error creating connect request:', error);
        }
    };

    return (
        <>
        <div className="modal">
            <div className="modal-content">
                <span className="modal-close" onClick={closeModal}>×</span>
                <div className='mp-container'>
                    <div className='mp-body'>
                        <div className='mp-left'>
                            <img src={PLACEHOLDER} alt="profile picture" />
                            <h3>{mentor.User.name}</h3>
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
                    <button id='save-button' onClick={handleSubmit}>Connect</button>
                </div>  
            </div>
        </div>
        </>
    )
}

export default MatchModal