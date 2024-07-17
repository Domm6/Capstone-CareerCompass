import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../UserContext.jsx";
import axios from "axios";
import config from "../../../../config.js";
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const API_KEY = import.meta.env.VITE_SCHOOL_API;

const experienceMappingReverse = {
  1: "0-2",
  2: "2-5",
  3: "5-10",
  4: "10+",
  5: "20+",
};

function MentorProfileModal({
  handleCheckboxChange,
  handleDropdownToggle,
  dropdownOpen,
  selectedSkills,
  skillsList,
  mentorData,
  closeModal,
}) {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    industry: "",
    company: "",
    work_role: "",
    years_experience: "",
    school: "",
    schoolState: "",
    schoolCity: "",
    bio: "",
    skills: selectedSkills,
    preferredStartHour: "00:00",
    preferredEndHour: "23:59",
  });
  const [schoolSuggestions, setSchoolSuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  console.log(mentorData);

  useEffect(() => {
    if (mentorData) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        industry: mentorData.industry || "",
        company: mentorData.company || "",
        work_role: mentorData.work_role || "",
        years_experience:
          Object.keys(experienceMappingReverse).find(
            (key) =>
              experienceMappingReverse[key] === mentorData.years_experience
          ) || "",
        school: mentorData.school || "",
        schoolState: mentorData.schoolState || "",
        schoolCity: mentorData.schoolCity || "",
        bio: mentorData.bio || "",
        preferredStartHour: mentorData.preferredStartHour || "00:00",
        preferredEndHour: mentorData.preferredEndHour || "23:59",
      }));
    }
  }, [mentorData]);

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
      setErrorMessage(error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (name === "school" && value.length > 2) {
      searchSchools(value);
    }
  };

  const handleSchoolSelect = (school) => {
    setFormData({
      ...formData,
      school: school["school.name"],
      schoolCity: school["school.city"],
      schoolState: school["school.state"],
    });
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
      const response = await fetch(`${config.apiBaseUrl}/mentors/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preparedData),
      });

      if (response.ok) {
        closeModal();
      } else {
        console.error("Error updating mentor profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating mentor profile:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Edit Mentor Profile
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Industry"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Role"
          name="work_role"
          value={formData.work_role}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="years-experience-label">
            Years of Experience
          </InputLabel>
          <Select
            labelId="years-experience-label"
            name="years_experience"
            value={formData.years_experience}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>Select</em>
            </MenuItem>
            <MenuItem value="1">0 - 2</MenuItem>
            <MenuItem value="2">2 - 5</MenuItem>
            <MenuItem value="3">5 - 10</MenuItem>
            <MenuItem value="4">10+</MenuItem>
            <MenuItem value="5">20+</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="School"
          name="school"
          value={formData.school}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        {schoolSuggestions.length > 0 && (
          <Box className="school-suggestions">
            {schoolSuggestions.slice(0, 20).map((school) => (
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
        <TextField
          label="Bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          required
        />
        <TextField
          label="Preferred Start Hour"
          type="time"
          name="preferredStartHour"
          value={formData.preferredStartHour}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Preferred End Hour"
          type="time"
          name="preferredEndHour"
          value={formData.preferredEndHour}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Box className="form-skills">
          <Button
            type="button"
            onClick={handleDropdownToggle}
            variant="contained"
            color="primary"
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
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </form>
    </Box>
  );
}

export default MentorProfileModal;
