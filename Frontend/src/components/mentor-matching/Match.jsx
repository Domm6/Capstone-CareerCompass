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
    const NORMALIZE = 100;
    const MAX_RATING = 5;
    const RATING_WEIGHT = 0.3; 
    const EXPERIENCE_WEIGHT = 0.2;
    const MATCHING_SKILLS_WEIGHT = 0.2;
    const NON_MATCHING_SKILLS_WEIGHT = 0.1;
    const SCHOOL_MATCH_WEIGHT = 0.02;
    const SCHOOL_STATE_MATCH_WEIGHT = 0.03;
    const SCHOOL_CITY_MATCH_WEIGHT = 0.05;
    const CAREER_GOALS_MATCH_WEIGHT = 0.2;

    // normalize rating to a 0-10 scale
    const normalizedRating = (mentor.averageRating / MAX_RATING) * NORMALIZE;
    const ratingScore = normalizedRating * RATING_WEIGHT;

    // normalize experience to a 0-10 scale
    const normalizedExperience = Math.min(mentor.years_experience, NORMALIZE);
    const experienceScore = normalizedExperience * EXPERIENCE_WEIGHT;

    // skill scores
    // gets mentee and mentor list of skills
    const menteeSkills = mentee.skills.split(',').map(skill => skill.trim().toLowerCase());
    const mentorSkills = mentor.skills.split(',').map(skill => skill.trim().toLowerCase());

    // gets list of matching, then mentor skills length - matchign skills length
    const matchingSkillsCount = menteeSkills.filter(skill => mentorSkills.includes(skill)).length;
    const nonMatchingSkillsCount = mentorSkills.length - matchingSkillsCount;
    const matchingSkillScore = (matchingSkillsCount / menteeSkills.length) * NORMALIZE * MATCHING_SKILLS_WEIGHT;
    const nonMatchingSkillScore = (nonMatchingSkillsCount / mentorSkills.length) * NORMALIZE * NON_MATCHING_SKILLS_WEIGHT;
    const skillScore = matchingSkillScore + nonMatchingSkillScore;

    // check if school strings match and multiply by match weight
    const menteeSchool = mentee.school ?? ''; // handle null checks
    const mentorSchool = mentor.school ?? '';
    const menteeSchoolState = mentee.schoolState ?? '';
    const mentorSchoolState = mentor.schoolState ?? '';
    const menteeSchoolCity = mentee.schoolCity ?? '';
    const mentorSchoolCity = mentor.schoolCity ?? '';
    
    const schoolMatch = mentorSchool.toLowerCase() === menteeSchool.toLowerCase() ? 1 : 0;
    const schoolStateMatch = mentorSchoolState.toLowerCase() === menteeSchoolState.toLowerCase() ? 1 : 0;
    const schoolCityMatch = mentorSchoolCity.toLowerCase() === menteeSchoolCity.toLowerCase() ? 1 : 0;

    const schoolScore = (schoolMatch * NORMALIZE * SCHOOL_MATCH_WEIGHT) +
                        (schoolStateMatch * NORMALIZE * SCHOOL_STATE_MATCH_WEIGHT) +
                        (schoolCityMatch * NORMALIZE * SCHOOL_CITY_MATCH_WEIGHT);

    // score of matching key words in mentee career goal section to mentor fields
    const careerGoalText = mentee.career_goals
    const keywordsArray = careerGoalText.split(/\s+/); // splits based on whitespace
    const careerGoalsKeywords = keywordsArray.map(keyword => keyword.trim().toLowerCase()); // trim whitespace and lowercase
    const careerGoalsMatchCount = careerGoalsKeywords.filter(keyword => 
        mentor.work_role.toLowerCase().includes(keyword) ||
        mentor.industry.toLowerCase().includes(keyword) ||
        mentor.skills.toLowerCase().includes(keyword) ||
        mentor.company.toLowerCase().includes(keyword) ||
        mentor.industry.toLowerCase().includes(keyword)
    ).length;
    const careerGoalsMatchScore = (careerGoalsMatchCount / careerGoalsKeywords.length) * NORMALIZE * CAREER_GOALS_MATCH_WEIGHT;

    const totalScore = ratingScore + experienceScore + skillScore + schoolScore + careerGoalsMatchScore;
    
    return totalScore;
}

const getTopMentorSuggestions = (mentors, mentee) => {
    const rankedMentors = mentors.map(mentor => {
        const score = calculateMentorScore(mentor, mentee);
        return {
            ...mentor,
            score,
        };
    }).sort((a, b) => b.score - a.score);

    return rankedMentors.slice(0, 5);
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
    const [topMentors, setTopMentors] = useState([]);
    const [matchedMentorIds, setMatchedMentorIds] = useState([]);

    const handleCardClick = (mentor) => {
        setSelectedMentor(mentor);
        setIsMatchModalOpen(true);
    };

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

    console.log(user.id)

    const fetchMatchedMentors = (menteeId) => {
        fetch(`${config.apiBaseUrl}/connect-requests/mentee/${menteeId}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch connect requests. Please try again later.');
            }
            return response.json();
          })
          .then(data => {
            console.log(data)
            const acceptedRequests = data.requests.filter(request => request.status === 'accepted');
            const matchedMentorIds = acceptedRequests.map(request => request.mentorId);
            setMatchedMentorIds(matchedMentorIds);
          })
          .catch(error => {
            setErrorMessage(error.message);
          });
    };

    const getUnmatchedMentors = (mentors, matchedMentorIds) => {
        return mentors.filter(mentor => !matchedMentorIds.includes(mentor.id));
    }

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
            fetchMatchedMentors(data.mentee.id);
          })
          .catch(error => {
            setErrorMessage(error.message);
          });
    };

    useEffect(() => {
        fetchMenteeData();
        fetchMentorsData();
    }, []);

    useEffect(() => {
        if (mentors.length && mentee) {
            const unmatchedMentors = getUnmatchedMentors(mentors, matchedMentorIds);
            const suggestions = getTopMentorSuggestions(unmatchedMentors, mentee);
            setTopMentors(suggestions);
        }
    }, [mentors, mentee, matchedMentorIds]);

    const filteredMentors = mentors.filter(mentor => 
        (selectedRole === '' || (mentor.work_role && mentor.work_role.toLowerCase().includes(selectedRole.toLowerCase()))) &&
        (selectedIndustry === '' || (mentor.industry && mentor.industry.toLowerCase().includes(selectedIndustry.toLowerCase()))) &&
        !matchedMentorIds.includes(mentor.id) && !topMentors.some(topMentor => topMentor.id === mentor.id)

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
        <div className='suggested-container'>
            <div className='sc-header'>
                <h3>Suggested</h3>
            </div>
            <div className='sc-list'>
                {topMentors.map(mentor => (
                    <MentorCard key={mentor.id} mentor={mentor} onCardClick={handleCardClick} score={mentor.score} />
                ))}
            </div>
        </div>
        <div className='divider'></div>
        <div className='mc-header'>
            <h3>Other Mentors</h3>
        </div>
        <div className='mc-list'>
            {filteredMentors.filter(mentor => !topMentors.includes(mentor)).map(mentor => (
                <MentorCard key={mentor.id} mentor={mentor} onCardClick={handleCardClick} />
            ))}
        </div>
        {isMatchModalOpen && (
            <MatchModal mentor={selectedMentor} closeModal={closeModal} mentee={mentee}/>
        )}
        </>
    )
}

export default Match