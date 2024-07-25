import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../UserContext.jsx";
import { useNavigate } from "react-router-dom";
import "./MenteeProfileModal.css";
import config from "../../../../config.js";
import axios from "axios";
import ApiService from "../../../../ApiService.js";
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
const UPLOAD_IMAGE_API_KEY = import.meta.env.VITE_PROFILE_PICTURE_API;

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
  const apiService = new ApiService();

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
      setLoading(true);

      let imageUrl = null;

      // Upload profile image to imgbb if a new one is selected
      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        try {
          const imageResponse = await axios.post(
            `https://api.imgbb.com/1/upload?key=${UPLOAD_IMAGE_API_KEY}`,
            formData
          );

          if (imageResponse.status !== 200) {
            console.error(
              "Error uploading profile image:",
              imageResponse.statusText
            );
            setLoading(false);
            return;
          }

          console.log(imageResponse);

          imageUrl = imageResponse.data.data.display_url;
          preparedData.profileImageUrl = imageUrl;
        } catch (uploadError) {
          console.error("Error uploading profile image:", uploadError);
          alert(
            `Image upload failed: ${uploadError.response.data.error.message}`
          );
          setLoading(false);
          return;
        }
      }

      // Update mentee profile details
      const menteeResponse = await fetch(
        `${config.apiBaseUrl}/mentees/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(preparedData),
        }
      );

      if (!menteeResponse.ok) {
        console.error(
          "Error updating mentee profile:",
          menteeResponse.statusText
        );
        setLoading(false);
        return;
      }

      const updatedUser = await menteeResponse.json();
      updateUser(updatedUser);

      // If image was uploaded, update the user profile with the image URL
      if (imageUrl) {
        const userResponse = await fetch(
          `${config.apiBaseUrl}/users/${user.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ profileImageUrl: imageUrl }),
          }
        );

        if (!userResponse.ok) {
          console.error(
            "Error updating user profile:",
            userResponse.statusText
          );
          setLoading(false);
          return;
        }

        const updatedUserProfile = await userResponse.json();
        updateUser(updatedUserProfile);
      }
      closeModal();
    } catch (error) {
      console.error("Error updating mentee profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
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
