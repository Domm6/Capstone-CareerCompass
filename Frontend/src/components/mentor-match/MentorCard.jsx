import { useState} from 'react'
import { UserContext } from '../../UserContext.jsx';
import "./MentorCard.css"

const PLACEHOLDER = "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";


function MentorCard({onCardClick}) {

    const mentor = {
        // Mock mentor data; replace with actual data as needed
        name: 'John Doe',
        profileImageUrl: 'https://example.com/profile.jpg',
        industry: 'Technology',
        company: 'Tech Inc.',
        work_role: 'Software Engineer',
        years_experience: '5-10',
        school: 'MIT',
        skills: 'Programming, Problem-Solving',
        bio: 'Experienced software engineer with a passion for technology.'
    };

    return (
        <>
        <div className='mc-container' onClick={() => onCardClick(mentor)}>
            <div className='mc-image'>
                <img src={PLACEHOLDER} alt="profile picture" />
            </div>
            <div className='mc-name'>
                <h3>Name</h3>
            </div>
            <div className='mc-role'>
                <p>Role</p>
            </div>
            <div className='mc-company'>
                <p>Comapny</p>
            </div>
        </div>
        </>
    )

}

export default MentorCard