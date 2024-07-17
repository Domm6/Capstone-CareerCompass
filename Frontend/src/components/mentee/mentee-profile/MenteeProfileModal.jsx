import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../UserContext.jsx";
import { useNavigate } from "react-router-dom";
import "./MenteeProfileModal.css";
import config from "../../../../config.js";
import axios from "axios";

const PLACEHOLDER =
  "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";
const API_KEY = import.meta.env.VITE_SCHOOL_API;

function MenteeProfileModal({
  handleCheckboxChange,
  handleDropdownToggle,
  dropdownOpen,
  selectedSkills,
  skillsList,
  menteeData,
  closeModal,
}) {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: "",
    profileImageUrl: "",
    major: "",
    school: "",
    schoolState: "",
    schoolCity: "",
    bio: "",
    career_goals: "",
    skills: selectedSkills.join(", "),
    preferredStartHour: "00:00",
    preferredEndHour: "23:59",
  });
  const [schoolSuggestions, setSchoolSuggestions] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (menteeData) {
      setFormData({
        name: user.name,
        profileImageUrl: user.profileImageUrl || PLACEHOLDER,
        major: menteeData.major,
        school: menteeData.school,
        schoolState: menteeData.schoolState || "",
        schoolCity: menteeData.schoolCity || "",
        bio: menteeData.bio,
        career_goals: menteeData.career_goals,
        skills: menteeData.skills,
        preferredStartHour: menteeData?.preferredStartHour || "00:00",
        preferredEndHour: menteeData?.preferredEndHour || "23:59",
      });
    }
  }, [menteeData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    if (name === "school" && value.length > 2) {
      searchSchools(value);
    }
  };

  // serach for schools
  const searchSchools = async (query) => {
    try {
      const response = await axios.get(
        `https://api.data.gov/ed/collegescorecard/v1/schools`,
        {
          params: {
            "school.name": query,
            fields: "id,school.name,school.city,school.state",
            api_key: API_KEY,
          },
        }
      );

      if (response.data.results) {
        setSchoolSuggestions(response.data.results);
      } else {
        setSchoolSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching school suggestions:", error);
    }
  };

  const handleSchoolSelect = (school) => {
    setFormData({
      ...formData,
      school: school["school.name"],
      schoolCity: school["school.city"],
      schoolState: school["school.state"],
    });
    setSelectedSchool(school);
    setSchoolSuggestions([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const preparedData = {
      ...formData,
      skills: selectedSkills.join(", "),
      meetingPreferences: {
        preferredStartHour: formData.preferredStartHour,
        preferredEndHour: formData.preferredEndHour,
      },
    };

    try {
      const response = await fetch(`${config.apiBaseUrl}/mentees/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preparedData),
      });

      if (response.ok) {
        // Close the modal after a successful update
        closeModal();
      } else {
        console.error("Error updating mentee profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating mentee profile:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="modal-close" onClick={closeModal}>
          ×
        </span>
        <form className="mp-form" onSubmit={handleSubmit}>
          <div className="form-school">
            <label htmlFor="school" required>
              School
            </label>
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
              required
            />
            {schoolSuggestions.length > 0 && (
              <div className="school-suggestions">
                {schoolSuggestions.map((school) => (
                  <div
                    key={school.id}
                    className="school-suggestion"
                    onClick={() => handleSchoolSelect(school)}
                  >
                    {school["school.name"]}, {school["school.city"]},{" "}
                    {school["school.state"]}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="form-major">
            <label htmlFor="major">Major</label>
            <input
              type="text"
              name="major"
              value={formData.major}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-career-goals">
            <label htmlFor="career-goals">Career Goals</label>
            <input
              type="text"
              name="career_goals"
              value={formData.career_goals}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-bio">
            <label htmlFor="bio">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-time-preference">
            <label htmlFor="preferredStartHour">Preferred Start Hour:</label>
            <input
              type="time"
              id="preferredStartHour"
              name="preferredStartHour"
              value={formData.preferredStartHour}
              onChange={handleChange}
            />
          </div>
          <div className="form-time-preference">
            <label htmlFor="preferredEndHour">Preferred End Hour:</label>
            <input
              type="time"
              id="preferredEndHour"
              name="preferredEndHour"
              value={formData.preferredEndHour}
              onChange={handleChange}
            />
          </div>
          <div className="form-skills">
            <label htmlFor="skills">Skills</label>
            <div>
              <button type="button" onClick={handleDropdownToggle}>
                {dropdownOpen ? "Hide Skills" : "Show Skills"}
              </button>
              {dropdownOpen && (
                <div className="skills-dropdown">
                  {skillsList.map((skill) => (
                    <div key={skill}>
                      <label>{skill}</label>
                      <input
                        type="checkbox"
                        value={skill}
                        checked={selectedSkills.includes(skill)}
                        onChange={() => handleCheckboxChange(skill)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
}

export default MenteeProfileModal;
