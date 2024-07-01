import { useState} from 'react'
import { UserContext } from '../../UserContext.jsx';
import './Request.css'

const PLACEHOLDER = "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";


function Request() {
    return(
        <>
        <div className='request-container'>
            <div className='request-left'>
                <div className='reqeust-img'>
                    <img src={PLACEHOLDER} alt="profile picture" />
                </div>
                <div className='request-text'>
                    <h3>Name</h3>
                    <p>School</p>
                    <p>Major</p>
                </div>
            </div>
            <div className='request-right'>
                <div className='request-actions'>
                    <button>Accept</button>
                    <button>Decline</button>
                </div>
            </div>
        </div>
        </>
    )
}

export default Request