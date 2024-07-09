import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext.jsx';
import { Link } from 'react-router-dom';
import "./Match.css";
import MentorCard from './MentorCard.jsx';
import MatchModal from './MatchModal.jsx';
import SuggestionModal from './SuggestionModal.jsx';
import config from '../../../config.js';

const TechRolesEnum = Object.freeze({
    SOFTWARE_ENGINEER: 'Software Engineer',
    FRONTEND_DEVELOPER: 'Frontend Developer',
    BACKEND_DEVELOPER: 'Backend Developer',
    FULL_STACK_DEVELOPER: 'Full Stack Developer',
    DATA_SCIENTIST: 'Data Scientist',
    DATA_ANALYST: 'Data Analyst',
    DEVOPS_ENGINEER: 'DevOps Engineer',
    SYSTEM_ADMINISTRATOR: 'System Administrator',
    DATABASE_ADMINISTRATOR: 'Database Administrator',
    MACHINE_LEARNING_ENGINEER: 'Machine Learning Engineer',
    AI_ENGINEER: 'AI Engineer',
    CLOUD_ENGINEER: 'Cloud Engineer',
    CYBERSECURITY_SPECIALIST: 'Cybersecurity Specialist',
    NETWORK_ENGINEER: 'Network Engineer',
    MOBILE_DEVELOPER: 'Mobile Developer',
    IOS_DEVELOPER: 'iOS Developer',
    ANDROID_DEVELOPER: 'Android Developer',
    QA_ENGINEER: 'QA Engineer',
    TEST_AUTOMATION_ENGINEER: 'Test Automation Engineer',
    UX_UI_DESIGNER: 'UX/UI Designer',
    PRODUCT_MANAGER: 'Product Manager',
    PROJECT_MANAGER: 'Project Manager',
    BUSINESS_ANALYST: 'Business Analyst',
    TECHNICAL_WRITER: 'Technical Writer',
    TECH_SUPPORT_SPECIALIST: 'Tech Support Specialist',
    SOLUTIONS_ARCHITECT: 'Solutions Architect',
    IT_MANAGER: 'IT Manager',
    SECURITY_ANALYST: 'Security Analyst',
    BLOCKCHAIN_DEVELOPER: 'Blockchain Developer',
    GAME_DEVELOPER: 'Game Developer',
    EMBEDDED_SYSTEMS_ENGINEER: 'Embedded Systems Engineer',
    SITE_RELIABILITY_ENGINEER: 'Site Reliability Engineer (SRE)',
    IT_CONSULTANT: 'IT Consultant',
    RESEARCH_SCIENTIST: 'Research Scientist',
    ROBOTICS_ENGINEER: 'Robotics Engineer',
    WEB_DEVELOPER: 'Web Developer',
    IT_SUPPORT_ENGINEER: 'IT Support Engineer',
    ENTERPRISE_ARCHITECT: 'Enterprise Architect',
    IT_AUDITOR: 'IT Auditor',
    CLOUD_SOLUTIONS_ARCHITECT: 'Cloud Solutions Architect',
    OTHER: 'Other'
});

const techRoles = Object.values(TechRolesEnum);

const IndustriesEnum = Object.freeze({
    INFORMATION_TECHNOLOGY: 'Information Technology',
    TECHNOLOGY: 'Technology',
    FINANCE: 'Finance',
    HEALTHCARE: 'Healthcare',
    EDUCATION: 'Education',
    MANUFACTURING: 'Manufacturing',
    RETAIL: 'Retail',
    TELECOMMUNICATIONS: 'Telecommunications',
    ENERGY: 'Energy',
    TRANSPORTATION: 'Transportation',
    CONSTRUCTION: 'Construction',
    REAL_ESTATE: 'Real Estate',
    HOSPITALITY: 'Hospitality',
    AGRICULTURE: 'Agriculture',
    MEDIA_ENTERTAINMENT: 'Media & Entertainment',
    AUTOMOTIVE: 'Automotive',
    AEROSPACE: 'Aerospace',
    LEGAL: 'Legal',
    CONSULTING: 'Consulting',
    GOVERNMENT: 'Government',
    NON_PROFIT: 'Non-Profit',
    PHARMACEUTICALS: 'Pharmaceuticals',
    BIOTECHNOLOGY: 'Biotechnology',
    INSURANCE: 'Insurance',
    LOGISTICS: 'Logistics',
    CONSUMER_GOODS: 'Consumer Goods',
    ADVERTISING: 'Advertising',
    ENVIRONMENTAL_SERVICES: 'Environmental Services',
    FOOD_BEVERAGE: 'Food & Beverage',
    MINING: 'Mining',
    PUBLIC_SAFETY: 'Public Safety',
    RESEARCH_DEVELOPMENT: 'Research & Development',
    SPORTS_RECREATION: 'Sports & Recreation',
    TEXTILES: 'Textiles',
    UTILITIES: 'Utilities',
    WAREHOUSING: 'Warehousing',
    OTHER: 'Other'
});

const industries = Object.values(IndustriesEnum);

const calculateMentorScore = (mentor, mentee) => {
    const RATING_WEIGHT = 7;
    const EXPERIENCE_WEIGHT = 5;
    const SKILLS_MATCH_WEIGHT = 3;
    const SCHOOL_MATCH_WEIGHT = 4;

    // multiply ratign score
    const ratingScore = mentor.averageRating * RATING_WEIGHT;

    // multiply years of experience by experience weight
    const experienceScore = mentor.years_experience * EXPERIENCE_WEIGHT;

    // count skill matches and multiply by match weight
    const menteeSkills = mentee.skills.split(',').map(skill => skill.trim().toLowerCase());
    const mentorSkills = mentor.skills.split(',').map(skill => skill.trim().toLowerCase());
    const skillsMatchCount = menteeSkills.filter(skill => mentorSkills.includes(skill)).length;
    const skillScore = skillsMatchCount * SKILLS_MATCH_WEIGHT;

    // check if school strings match and multiply by match weight
    const schoolScore = mentor.school.toLowerCase() === mentee.school.toLowerCase() ? SCHOOL_MATCH_WEIGHT : 0;

    const totalScore = ratingScore + experienceScore + skillScore + schoolScore;

    return totalScore;
}

const getTopMentorSuggestions = (mentors, mentee) => {
    const rankedMentors = mentors.map(mentor => ({
        ...mentor,
        score: calculateMentorScore(mentor, mentee),
    })).sort((a,b) => b.score - a.score);

    return rankedMentors.slice(0, 5)
}

function Match() {
    const { user } = useContext(UserContext);
    const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
    const [mentors, setMentors] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [mentee, setMentee] = useState(null);
    const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
    const [topMentors, setTopMentors] = useState([]);

    const handleCardClick = (mentor) => {
        setSelectedMentor(mentor);
        setIsMatchModalOpen(true);
    };

    const openSuggestionModal = () => {
        const suggestions = getTopMentorSuggestions(mentors, mentee);
        setTopMentors(suggestions);
        console.log(topMentors)
        setIsSuggestionModalOpen(true);    
    }

    const closeSuggestionModal = () => {
        setIsSuggestionModalOpen(false);
    }

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    const handleIndustryChange = (event) => {
        setSelectedIndustry(event.target.value);
    };

    const closeModal = () => {
        setIsMatchModalOpen(false);
        setSelectedMentor(null);
    };

    const fetchMentorsData = () => {
        fetch(`${config.apiBaseUrl}/mentors`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch mentor data. Please try again later.');
            }
            return response.json();
          })
          .then(data => {
            setMentors(data.mentors);
          })
          .catch(error => {
            setErrorMessage(error.message);
          });
    };

    const fetchMenteeData = () => {
        fetch(`${config.apiBaseUrl}/mentees/${user.id}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch mentee data. Please try again later.');
            }
            return response.json();
          })
          .then(data => {
            setMentee(data.mentee);
          })
          .catch(error => {
            setErrorMessage(error.message);
          });
    };

    useEffect(() => {
        fetchMentorsData();
        fetchMenteeData();
    }, []);

    const filteredMentors = mentors.filter(mentor => 
        (selectedRole === '' || (mentor.work_role && mentor.work_role.toLowerCase().includes(selectedRole.toLowerCase()))) &&
        (selectedIndustry === '' || (mentor.industry && mentor.industry.toLowerCase().includes(selectedIndustry.toLowerCase())))
    );  

    return (
        <>
        <div className="mp-header">
            <h1>CareerCompass</h1>
            <div className='mp-nav'>
                <Link to="/mentee-profile">Profile</Link>
                <Link to="/mentee-dashboard">Dashboard</Link>
            </div>
        </div>
        <div className='match-top'>
            <h1>Choose a Mentor</h1>
        </div>
        <div className='match-nav'>
            <button id='suggestion-btn' onClick={openSuggestionModal}>Suggestions</button>
            <select name="role" value={selectedRole} onChange={handleRoleChange}>
                <option value="">Select a role</option>
                {techRoles.map((role, index) => (
                    <option key={index} value={role}>
                        {role}
                    </option>
                ))}
            </select>
            <select name="industry" id="" value={selectedIndustry} onChange={handleIndustryChange}>
                <option value="">Select an industry</option>
                    {industries.map((industry, index) => (
                        <option key={index} value={industry}>
                            {industry}
                        </option>
                    ))}
            </select>
        </div>
        <div className='match-container'>
            <div className='mc-list'>
                {filteredMentors.map(mentor => (
                    <MentorCard key={mentor.id} mentor={mentor} onCardClick={handleCardClick} />
                ))}
            </div>
        </div>
        {isMatchModalOpen && (
            <MatchModal mentor={selectedMentor} closeModal={closeModal} mentee={mentee}/>
        )}
        {isSuggestionModalOpen && (
            <SuggestionModal closeModal={closeSuggestionModal} mentors={topMentors}></SuggestionModal>
        )}
        </>
    )
}

export default Match