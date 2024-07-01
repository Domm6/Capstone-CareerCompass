import {useContext, useEffect, useState} from 'react'
import { UserContext } from '../../UserContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

import './MenteeProfile.css'
import MenteeProfileModal from './MenteeProfileModal.jsx';
import config from '../../../config.js';

const PLACEHOLDER = "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";
const skillsList = [
    'Communication',
    'Teamwork',
    'Problem-Solving',
    'Time Management',
    'Leadership',
    'Adaptability',
    'Critical Thinking',
    'Project Management',
    'Creativity',
    'Technical Writing',
    'Customer Service',
    'Public Speaking',
    'Data Analysis',
    'Strategic Planning',
    'Negotiation',
    'Conflict Resolution',
    'Financial Management',
    'Marketing',
    'Sales',
    'Research',
    'Programming',
    'Networking',
    'Graphic Design',
    'Content Creation',
    'SEO',
    'Social Media Management',
    'UX/UI Design',
    'Cybersecurity',
    'Cloud Computing',
    'Database Management',
    'Machine Learning',
    'Artificial Intelligence',
    'Supply Chain Management',
    'Quality Assurance',
    'Product Development',
    'Business Analysis',
    'Human Resources',
    'Training and Development',
    'Legal Knowledge',
    'Foreign Languages'
];

function MenteeProfile() {
    const { user } = useContext(UserContext)
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const navigate = useNavigate();
    // const logoApiKey = process.env.REACT_APP_LOGO_API_KEY; getting error process not defined

    const [userData, setUserData] = useState({
        name: "Loading",
        profileImageUrl: PLACEHOLDER,
        bio: '',
        major: '',
        career_goals: '',
        school: '',
        skills: ''
    });

    const fetchMenteeData = () => {
        if (user && user.id) {
          fetch(`${config.apiBaseUrl}/mentees/${user.id}`)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              setUserData({
                name: user.name,
                profileImageUrl: user.profileImageUrl || PLACEHOLDER,
                major: data.mentee.major,
                school: data.mentee.school,
                bio: data.mentee.bio,
                career_goals: data.mentee.career_goals,
                skills: data.mentee.skills
              });
            })
            .catch(error => {
              console.error('Error fetching mentee data:', error);
              setUserData({
                name: 'Failed to load user data',
                profileImageUrl: PLACEHOLDER
              });
            });
        }
      };
      
    useEffect(() => {
        fetchMenteeData();
    }, [user]);

    const handleCheckboxChange = (skill) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter((currentSkill) => currentSkill !== skill));
        } else {
            setSelectedSkills([...selectedSkills, skill]);
        }
    };
    
    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    }

    return(
        <>
        <div className="mp-header">
            <h1>CareerCompass</h1>
            <div className='mp-nav'>
                <Link to="/mentee-dashboard">Dashboard</Link>
                <Link to="/matching">Find Mentors</Link>
            </div>
        </div>
        <div className='mp-container'>
            <div className='mp-top'>
                <div className='mp-top-left'>
                    <h1>Mentee Profile</h1>
                </div>
                <div className='mp-top-right'>
                    <button onClick={handleModalToggle}>Edit</button>
                </div>
            </div>
            <div className='mp-body'>
                <div className='mp-left'>
                    <img src={userData.profileImageUrl} alt="profile picture" />
                    <h3>{userData.name}</h3>
                </div>
                <div className='mp-right'>
                    <p>School: {userData.school}</p>
                    <p>Major: {userData.major}</p>
                    <p>Career Goals: {userData.career_goals}</p>
                    <p>Skills: {userData.skills}</p>
                    <p>Bio: {userData.bio}</p>
                </div>
            </div>
            {isModalOpen && (
                    <MenteeProfileModal
                        menteeData={userData}
                        handleDropdownToggle={handleDropdownToggle}
                        dropdownOpen={dropdownOpen}
                        selectedSkills={selectedSkills}
                        handleCheckboxChange={handleCheckboxChange}
                        skillsList={skillsList}
                        closeModal={() => {
                            handleModalToggle();
                            fetchMenteeData();
                        }}
                    />
                )}
            <button onClick={() => navigate('/mentee-dashboard')} id='save-button'>Save</button>
        </div>
        </>
    )
}

export default MenteeProfile