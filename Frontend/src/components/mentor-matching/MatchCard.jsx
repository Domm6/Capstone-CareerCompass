import { useState} from 'react'
import { UserContext } from '../../UserContext.jsx';
import config from '../../../config.js';
import "../mentor/mentor-requests/Request.css"

const PLACEHOLDER = "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";


function MatchCard({name, major, school, requestId}) {

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
            </div>
        </div>
        </>
    )
}

export default MatchCard