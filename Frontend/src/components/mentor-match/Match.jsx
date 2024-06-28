import { useState, useEffect} from 'react'
import { UserContext } from '../../UserContext.jsx';
import "./Match.css"
import MentorCard from './MentorCard.jsx';
import MatchModal from './MatchModal.jsx';
import config from '../../../config.js';

function Match() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mentors, setMentors] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState(null);

    const handleCardClick = (mentor) => {
        setSelectedMentor(mentor);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMentor(null);
    };

    const fetchMentorsData = () => {
        fetch(`${config.apiBaseUrl}/mentors`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP status ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            setMentors(data.mentors);
            console.log(mentors)
          })
          .catch(error => {
            console.error('Error fetching mentor data:', error);
          });
      };

    useEffect(() => {
        fetchMentorsData();
    }, []);

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
                {mentors.map(mentor => (
                    <MentorCard key={mentor.id} mentor={mentor} onCardClick={handleCardClick} />
                ))}
            </div>
        </div>
        {isModalOpen && (
                <MatchModal mentor={selectedMentor} closeModal={closeModal} />
            )}
        </>
    )
}

export default Match