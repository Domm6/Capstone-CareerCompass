import { useState} from 'react'
import { UserContext } from '../../UserContext.jsx';
import "./MentorCard.css"

const PLACEHOLDER = "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";


function MentorCard({mentor, onCardClick}) {
    const { User: user } = mentor; // Access user data from mentor

    return (
        <>
        <div className='mc-container' onClick={() => onCardClick(mentor)}>
            <div className='mc-image'>
                <img src={PLACEHOLDER} alt="profile picture" />
            </div>
            <div className='mc-name'>
                <h3>{user.name}</h3>
            </div>
            <div className='mc-role'>
                <p>{mentor.work_role}</p>
            </div>
            <div className='mc-company'>
                <p>{mentor.company}</p>
            </div>
        </div>
        </>
    )

}

export default MentorCard