import { useState, useEffect} from 'react'
import { UserContext } from '../../UserContext.jsx';
import "./Match.css"
import MentorCard from './MentorCard.jsx';
import MatchModal from './MatchModal.jsx';
import config from '../../../config.js';

const techRoles = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'Data Analyst',
    'DevOps Engineer',
    'System Administrator',
    'Database Administrator',
    'Machine Learning Engineer',
    'AI Engineer',
    'Cloud Engineer',
    'Cybersecurity Specialist',
    'Network Engineer',
    'Mobile Developer',
    'iOS Developer',
    'Android Developer',
    'QA Engineer',
    'Test Automation Engineer',
    'UX/UI Designer',
    'Product Manager',
    'Project Manager',
    'Business Analyst',
    'Technical Writer',
    'Tech Support Specialist',
    'Solutions Architect',
    'IT Manager',
    'Security Analyst',
    'Blockchain Developer',
    'Game Developer',
    'Embedded Systems Engineer',
    'Site Reliability Engineer (SRE)',
    'IT Consultant',
    'Research Scientist',
    'Robotics Engineer',
    'Web Developer',
    'IT Support Engineer',
    'Enterprise Architect',
    'IT Auditor',
    'Cloud Solutions Architect',
    'Other'
];

const industries = [
    'Information Technology',
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'Manufacturing',
    'Retail',
    'Telecommunications',
    'Energy',
    'Transportation',
    'Construction',
    'Real Estate',
    'Hospitality',
    'Agriculture',
    'Media & Entertainment',
    'Automotive',
    'Aerospace',
    'Legal',
    'Consulting',
    'Government',
    'Non-Profit',
    'Pharmaceuticals',
    'Biotechnology',
    'Insurance',
    'Logistics',
    'Consumer Goods',
    'Advertising',
    'Environmental Services',
    'Food & Beverage',
    'Mining',
    'Public Safety',
    'Research & Development',
    'Sports & Recreation',
    'Textiles',
    'Utilities',
    'Warehousing',
    'Other'
];

function Match() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mentors, setMentors] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('');

    const handleCardClick = (mentor) => {
        setSelectedMentor(mentor);
        setIsModalOpen(true);
    };

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    const handleIndustryChange = (event) => {
        setSelectedIndustry(event.target.value);
    };

    const closeModal = () => {
        setIsModalOpen(false);
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

    useEffect(() => {
        fetchMentorsData();
    }, []);

    const filteredMentors = mentors.filter(mentor => 
        (selectedRole === '' || (mentor.work_role && mentor.work_role.toLowerCase().includes(selectedRole.toLowerCase()))) &&
        (selectedIndustry === '' || (mentor.industry && mentor.industry.toLowerCase().includes(selectedIndustry.toLowerCase())))
    );  

    return (
        <>
        <div className="match-header">
            <h1>CareerCompass</h1>
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
        <div className='match-container'>
            <div className='mc-list'>
                {filteredMentors.map(mentor => (
                    <MentorCard key={mentor.id} mentor={mentor} onCardClick={handleCardClick} />
                ))}
            </div>
        </div>
        {isModalOpen && (
                <MatchModal mentor={selectedMentor} closeModal={closeModal} />
            )}
        </>
    )
}

export default Match