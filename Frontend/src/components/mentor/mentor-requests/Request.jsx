import { useState} from 'react'
import { UserContext } from '../../../UserContext.jsx';
import config from '../../../../config.js';
import './Request.css'

const PLACEHOLDER = "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";


function Request({name, major, school, requestId, onRequestUpdate}) {
    const [errorMessage, setErrorMessage] = useState('');

    // delete specific request
    const deleteRequest = async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/connect-requests/${requestId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                onRequestUpdate(requestId);
            } else {
                setErrorMessage('Failed to delete connect request');
            }
        } catch (error) {
            setErrorMessage('Error deleting connect request');
        }
    };

    // accept specific request
    const acceptRequest = async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/connect-requests/${requestId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'accepted' }),
            });

            if (response.ok) {
                onRequestUpdate(requestId)
            } else {
                setErrorMessage('Failed to accept connect request');
            }
        } catch (error) {
            setErrorMessage('Error accepting connect request');
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
                    <h3>{name}</h3>
                    <p>{school}</p>
                    <p>{major}</p>
                </div>
            </div>
            <div className='request-right'>
                <div className='request-actions'>
                    <button onClick={acceptRequest}>Accept</button>
                    <button onClick={deleteRequest}>Decline</button>
                </div>
            </div>
        </div>
        </>
    )
}

export default Request