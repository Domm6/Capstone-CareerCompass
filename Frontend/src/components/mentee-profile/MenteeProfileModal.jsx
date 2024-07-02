import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import './MenteeProfileModal.css';
import config from '../../../config.js';

const PLACEHOLDER = "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";


function MenteeProfileModal ({handleCheckboxChange, handleDropdownToggle, dropdownOpen, selectedSkills, skillsList, menteeData, closeModal}) {
    const { user } = useContext(UserContext);
    const [formData, setFormData] = useState({
        name: '',
        profileImageUrl: '',
        major: '',
        school: '',
        bio: '',
        career_goals: '',
        skills: selectedSkills.join(', '),
    })

    useEffect(() => {
        if (menteeData) {
            setFormData({
              name: user.name,
                profileImageUrl: user.profileImageUrl || PLACEHOLDER,
                major: menteeData.major,
                school: menteeData.school,
                bio: menteeData.bio,
                career_goals: menteeData.career_goals,
                skills: menteeData.skills
            });
        }
    }, [menteeData]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const preparedData = {
            ...formData,
            skills: selectedSkills.join(', '),
        };

        try {
            const response = await fetch(`${config.apiBaseUrl}/mentees/${user.id}`, {
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
            console.error('Error updating mentee profile:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating mentee profile:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="modal-close" onClick={closeModal}>×</span>
                <form className='mp-form' onSubmit={handleSubmit}>
                        <div className='form-school'>
                            <label htmlFor="school" required>School</label>
                            <input
                                type="text"
                                name="school"
                                value={formData.school}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='form-major'>
                            <label htmlFor="major">Major</label>
                            <input
                                type="text"
                                name="major"
                                value={formData.major}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='form-career-goals'>
                            <label htmlFor="career-goals">Career Goals</label>
                            <input
                                type="text"
                                name="career_goals"
                                value={formData.career_goals}
                                onChange={handleChange}
                                required
                            />
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

export default MenteeProfileModal