import { useState} from 'react'
import { UserContext } from '../../UserContext.jsx';
import Request from './Request.jsx';
import './Requests.css'

function Requests() {
    return(
        <>
        <div className='requests-list'>
            <h1>Requests</h1>
            <Request></Request>
        </div>
        </>
    )
}

export default Requests