import { useState} from 'react'
import { UserContext } from '../../UserContext.jsx';
import "./Match.css"
import MentorCard from './MentorCard.jsx';
import MatchModal from './MatchModal.jsx';

function Match() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState(null);

    const handleCardClick = (mentor) => {
        setSelectedMentor(mentor);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMentor(null);
    };

    return (
        <>
        <div className="match-header">
            <h1>CareerCompass</h1>
        </div>
        <div className='match-top'>
            <h1>Choose a Mentor</h1>
        </div>
        <div className='match-container'>
            <div className='mc-list'>
                <MentorCard onCardClick={handleCardClick}></MentorCard>
            </div>
        </div>
        {isModalOpen && (
                <MatchModal mentor={selectedMentor} closeModal={closeModal} />
            )}
        </>
    )
}

export default Match