import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import '../mentor/mentor-profile/MentorProfileModal.css';
import config from '../../../config.js';
import MentorCard from './MentorCard.jsx';
import './SuggestionModal.css'

function SuggestionModal ({closeModal, mentors, score}) {

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="modal-close" onClick={closeModal}>×</span>
                <h3>Top Suggestions</h3>
                <div className='scroll-container'>
                    {mentors.map(mentor => (
                        <MentorCard key={mentor.id} mentor={mentor} score={mentor.score}/>
                    ))}

                </div>
            </div>
        </div>
    )
}

export default SuggestionModal
