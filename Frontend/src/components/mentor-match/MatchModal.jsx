import { useState} from 'react'
import { UserContext } from '../../UserContext.jsx';
import "./MatchModal.css"

const PLACEHOLDER = "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";


function MatchModal({mentor, closeModal}) {
    return (
        <>
        <div className="modal">
            <div className="modal-content">
                <span className="modal-close" onClick={closeModal}>×</span>
                <div className='mp-container'>
                    <div className='mp-top'>
                        <div className='mp-top-left'>
                            <h1>Mentor Profile</h1>
                        </div>
                    </div>
                    <div className='mp-body'>
                        <div className='mp-left'>
                            <img src={PLACEHOLDER} alt="profile picture" />
                            <h3>Name</h3>
                        </div>
                        <div className='mp-right'>
                            <p>Industry:</p>
                            <p>Company:</p>
                            <p>Role:</p>
                            <p>Years of Experience:  years</p>
                            <p>School: </p>
                            <p>Skills:</p>
                            <p>Bio:</p>
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