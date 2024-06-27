import {useContext, useEffect, useState} from 'react'
import { UserContext } from '../UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import './MentorProfile.css'

const PLACEHOLDER = "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";

function MentorProfile() {
    const { user } = useContext(UserContext)
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: "Loading",
        profileImageUrl: PLACEHOLDER
    })

    useEffect(() => {
        if (user && user.id) {
            fetch(`http://localhost:3000/users/${user.id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP status ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setUserData({
                    name: data.name,
                    profileImageUrl: data.profileImageUrl || PLACEHOLDER
                });
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setUserData({
                    name: 'Failed to load user data',
                    profileImageUrl: PLACEHOLDER
                });
            });
    }
    }, [user]);

    return(
        <>
        <div className="mp-header">
            <h1>CareerCompass!</h1>
        </div>
        <div className='mp-container'>
            <div className='mp-top'>
                <h1>Edit Mentor Profile</h1>
            </div>
            <div className='mp-body'>
                <div className='mp-left'>
                    <img src={userData.profileImageUrl} alt="profile picture" />
                    <h3>{userData.name}</h3>
                </div>
                <div className='mp-right'>
                    <p>Industry: </p>
                    <p>Company: </p>
                    <p>Roles: </p>
                    <p>Years of Experience: </p>
                    <p>School: </p>
                    <p>Skills: </p>
                </div>
            </div>
            <button onClick={() => navigate('/mentor-dashboard')}>Save</button>
        </div>
        </>
    )
}

export default MentorProfile