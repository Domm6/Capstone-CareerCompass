import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../UserContext.jsx";
import { useNavigate } from "react-router-dom";
import "./MenteeProfileModal.css";
import config from "../../../../config.js";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  CircularProgress,
} from "@mui/material";

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
  const { updateUser } = useContext(UserContext);
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
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

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
      setLoading(true);
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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching school suggestions:", error);
      setLoading(false);
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
      setLoading(true);
      const response = await fetch(`${config.apiBaseUrl}/mentees/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preparedData),
      });

      if (!response.ok) {
        console.error("Error updating mentee profile:", response.statusText);
        setLoading(false);
        return;
      }

      // Update profile image if a new one is selected
      if (image) {
        const updatedUser = {
          ...user,
          profileImageUrl: image, // Use the base64 string directly
        };
        updateUser(updatedUser); // Update the user context with the new data
      }

      setLoading(false);
      closeModal(); // Close the modal if all updates are successful
    } catch (error) {
      console.error("Error updating mentee profile:", error);
      setLoading(false);
    }
  };

  const handleProfileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Set the base64 string as image
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Edit Mentee Profile
      </Typography>
      {loading ? (
        <div className="loading-spinner">
          <CircularProgress />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="School"
              name="school"
              value={formData.school}
              onChange={handleChange}
              required
            />
            {schoolSuggestions.length > 0 && (
              <Box className="school-suggestions">
                {schoolSuggestions.map((school) => (
                  <Box
                    key={school.id}
                    className="school-suggestion"
                    onClick={() => handleSchoolSelect(school)}
                  >
                    {school["school.name"]}, {school["school.city"]},{" "}
                    {school["school.state"]}
                  </Box>
                ))}
              </Box>
            )}
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Major"
              name="major"
              value={formData.major}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Career Goals"
              name="career_goals"
              value={formData.career_goals}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              multiline
              rows={4}
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Preferred Start Hour"
              type="time"
              name="preferredStartHour"
              value={formData.preferredStartHour}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Preferred End Hour"
              type="time"
              name="preferredEndHour"
              value={formData.preferredEndHour}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          <Box>
            <input type="file" onChange={handleProfileUpload} />
          </Box>
          <FormControl fullWidth margin="normal">
            <Box>
              <Button
                type="button"
                onClick={handleDropdownToggle}
                variant="contained"
                color="primary"
                sx={{ mb: 1 }}
              >
                {dropdownOpen ? "Hide Skills" : "Show Skills"}
              </Button>
              {dropdownOpen && (
                <Box className="skills-dropdown">
                  {skillsList.map((skill) => (
                    <Box key={skill}>
                      <label>{skill}</label>
                      <input
                        type="checkbox"
                        value={skill}
                        checked={selectedSkills.includes(skill)}
                        onChange={() => handleCheckboxChange(skill)}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </FormControl>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </form>
      )}
    </Box>
  );
}

export default MenteeProfileModal;
