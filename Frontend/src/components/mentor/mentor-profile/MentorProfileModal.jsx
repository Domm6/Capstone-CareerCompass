import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MentorProfileModal.css';
import config from '../../../../config.js';

const experienceMappingReverse = {
    1: '0-2',
    2: '2-5',
    3: '5-10',
    4: '10+',
    5: '20+',
  };

function MentorProfileModal ({handleCheckboxChange, handleDropdownToggle, dropdownOpen, selectedSkills, skillsList, mentorData, closeModal}) {
    const { user } = useContext(UserContext);
    const [formData, setFormData] = useState({
        industry: '',
        company: '',
        work_role: '',
        years_experience: '',
        school: '',
        schoolState: '',
        schoolCity: '',
        bio: '',
        skills: selectedSkills.join(', '),
    })
    const [schoolSuggestions, setSchoolSuggestions] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (mentorData) {
            setFormData({
                industry: mentorData.industry || '',
                company: mentorData.company || '',
                work_role: mentorData.work_role || '',
                years_experience: mentorData.years_experience || '',
                school: mentorData.school || '',
                schoolState: mentorData.schoolState || '',
                schoolCity: mentorData.schoolCity || '',
                bio: mentorData.bio || '',
                skills: mentorData.skills || '',
            });
        }
    }, [mentorData]);

    const searchSchools = async (query) => {
        try {
            const response = await axios.get(`https://api.data.gov/ed/collegescorecard/v1/schools`, {
                params: {
                    'school.name': query,
                    'fields': 'id,school.name,school.city,school.state',
                    'api_key': 'h4vhrQ91a1mE8DOWWaja1m5JguMfsPy1fjULWHZi',
                },
            });
    
            if (response.data.results) {
                setSchoolSuggestions(response.data.results);
            } else {
                setSchoolSuggestions([]);
            }
        } catch (error) {
            setErrorMessage(error)
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        // Handle years_experience specifically
        if (name === 'years_experience') {
            setFormData({ ...formData, [name]: value});
        } else {
            setFormData({ ...formData, [name]: value });
        }

        if (name === 'school' && value.length > 2) {
            searchSchools(value);
        }
    };

    const handleSchoolSelect = (school) => {
        setFormData({ 
            ...formData, 
            school: school['school.name'],
            schoolCity: school['school.city'],
            schoolState: school['school.state']
        });
        setSelectedSchool(school);
        setSchoolSuggestions([]);
    };    

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const preparedData = {
            ...formData,
            skills: selectedSkills.join(', '),
        };

        try {
            const response = await fetch(`${config.apiBaseUrl}/mentors/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(preparedData),
            });

            if (response.ok) {
            // Close the modal after a successful update
            closeModal();
            } else {
            console.error('Error updating mentor profile:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating mentor profile:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="modal-close" onClick={closeModal}>×</span>
                <form className='mp-form' onSubmit={handleSubmit}>
                        <div className='form-industry'>
                            <label htmlFor="industry" required>Industry</label>
                            <input
                                type="text"
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='form-company'>
                            <label htmlFor="company">Company</label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='form-role'>
                            <label htmlFor="role">Role</label>
                            <input
                                type="text"
                                name="work_role"
                                value={formData.work_role}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='form-years-experience'>
                            <label htmlFor="years_experience">Years of Experiencce</label>
                            <select
                                name="years_experience"
                                value={formData.years_experience}
                                onChange={handleChange}
                                required
                                >
                                <option value="">Select</option>
                                <option value="1">0 - 2</option>
                                <option value="2">2 - 5</option>
                                <option value="3">5 - 10</option>
                                <option value="4">10+</option>
                                <option value="5">20+</option>
                            </select>
                        </div>
                        <div className='form-school'>
                            <label htmlFor="school">School</label>
                            <input
                                type="text"
                                name="school"
                                value={formData.school}
                                onChange={handleChange}
                                required
                            />
                            {schoolSuggestions.length > 0 && (
                                <div className="school-suggestions">
                                    {schoolSuggestions.slice(0, 20).map((school) => (
                                        <div
                                            key={school.id}
                                            className="school-suggestion"
                                            onClick={() => handleSchoolSelect(school)}
                                        >
                                            {school['school.name']}, {school['school.city']}, {school['school.state']}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className='form-bio'>
                            <label htmlFor="bio">Bio</label>
                            <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            required
                            />
                        </div>
                        <div className='form-skills'>
                                <label htmlFor="skills">Skills</label>
                                <div>
                                    <button type="button" onClick={handleDropdownToggle}>
                                        {dropdownOpen ? 'Hide Skills' : 'Show Skills'}
                                    </button>
                                    {dropdownOpen && (
                                        <div className='skills-dropdown'>
                                            {skillsList.map((skill) => (
                                                <div key={skill}>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value={skill}
                                                            checked={selectedSkills.includes(skill)}
                                                            onChange={() => handleCheckboxChange(skill)}
                                                        />
                                                        {skill}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button type='submit'>Save</button>
                    </form>
            </div>
        </div>
    )
}

export default MentorProfileModal