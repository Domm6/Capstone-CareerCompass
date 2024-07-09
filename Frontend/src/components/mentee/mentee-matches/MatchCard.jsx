import { useState, useContext } from 'react';
import { UserContext } from '../../../UserContext.jsx';
import config from '../../../../config.js';
import "./MatchCard.css"

const PLACEHOLDER = "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";

function MatchCard({mentorName, mentorCompany, mentorWorkRole, requestId, mentee, mentorId}) {

    const { user } = useContext(UserContext);
    const [rating, setRating] = useState(1);
    const [message, setMessage] = useState('');

    const handleRatingChange = (event) => {
        setRating(parseInt(event.target.value));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${config.apiBaseUrl}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mentorId,
                    menteeId: mentee.id,
                    rating: rating,
                }),
            });

            if (response.ok) {
                setMessage('Rating submitted successfully!');
                console.log(message)
            } else {
                const errorData = await response.json();
                setMessage(`Error: ${errorData.error}`);
            }
        } catch (error) {
            setMessage('Server error, please try again later.');
        }
    };
    
    return(
        <>
        <div className='request-container'>
            <div className='request-left'>
                <div className='reqeust-img'>
                    <img src={PLACEHOLDER} alt="profile picture" />
                </div>
                <div className='request-text'>
                    <h3>{mentorName}</h3>
                    <p>{mentorCompany}</p>
                    <p>{mentorWorkRole}</p>
                </div>
            </div>
            <div className='request-right'>
                <form onSubmit={handleSubmit}>
                    <div className='right-rating'>
                        <select value={rating} onChange={handleRatingChange}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                        <button type="submit">Submit Rating</button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}

export default MatchCard