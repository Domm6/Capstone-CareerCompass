import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../UserContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import moment from "moment";
import "./MenteeProfile.css";
import MenteeProfileModal from "./MenteeProfileModal.jsx";
import config from "../../../../config.js";
import ResponsiveAppBar from "../../header/ResponsiveAppBar.jsx";
import {
  Container,
  Box,
  Typography,
  Button,
  Modal,
  CircularProgress,
} from "@mui/material";

const PLACEHOLDER =
  "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";

// now is immutable
const skillsEnum = Object.freeze({
  COMMUNICATION: "Communication",
  TEAMWORK: "Teamwork",
  PROBLEM_SOLVING: "Problem-Solving",
  TIME_MANAGEMENT: "Time Management",
  LEADERSHIP: "Leadership",
  ADAPTABILITY: "Adaptability",
  CRITICAL_THINKING: "Critical Thinking",
  PROJECT_MANAGEMENT: "Project Management",
  CREATIVITY: "Creativity",
  TECHNICAL_WRITING: "Technical Writing",
  CUSTOMER_SERVICE: "Customer Service",
  PUBLIC_SPEAKING: "Public Speaking",
  DATA_ANALYSIS: "Data Analysis",
  STRATEGIC_PLANNING: "Strategic Planning",
  NEGOTIATION: "Negotiation",
  CONFLICT_RESOLUTION: "Conflict Resolution",
  FINANCIAL_MANAGEMENT: "Financial Management",
  MARKETING: "Marketing",
  SALES: "Sales",
  RESEARCH: "Research",
  PROGRAMMING: "Programming",
  NETWORKING: "Networking",
  GRAPHIC_DESIGN: "Graphic Design",
  CONTENT_CREATION: "Content Creation",
  SEO: "SEO",
  SOCIAL_MEDIA_MANAGEMENT: "Social Media Management",
  UX_UI_DESIGN: "UX/UI Design",
  CYBERSECURITY: "Cybersecurity",
  CLOUD_COMPUTING: "Cloud Computing",
  DATABASE_MANAGEMENT: "Database Management",
  MACHINE_LEARNING: "Machine Learning",
  ARTIFICIAL_INTELLIGENCE: "Artificial Intelligence",
  SUPPLY_CHAIN_MANAGEMENT: "Supply Chain Management",
  QUALITY_ASSURANCE: "Quality Assurance",
  PRODUCT_DEVELOPMENT: "Product Development",
  BUSINESS_ANALYSIS: "Business Analysis",
  HUMAN_RESOURCES: "Human Resources",
  TRAINING_AND_DEVELOPMENT: "Training and Development",
  LEGAL_KNOWLEDGE: "Legal Knowledge",
  FOREIGN_LANGUAGES: "Foreign Languages",
});

const skillsList = Object.values(skillsEnum);

function MenteeProfile() {
  const { user } = useContext(UserContext);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { handleSignout } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    name: "Loading",
    profileImageUrl: PLACEHOLDER,
    bio: "",
    major: "",
    career_goals: "",
    school: "",
    skills: "",
    preferredStartHour: "",
    preferredEndHour: "",
  });

  const fetchMenteeData = () => {
    if (user && user.id) {
      setLoading(true);
      fetch(`${config.apiBaseUrl}/mentees/${user.id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
          }
          setLoading(false);
          return response.json();
        })
        .then((data) => {
          setUserData({
            name: user.name,
            profileImageUrl: user.profileImageUrl || PLACEHOLDER,
            major: data.mentee.major,
            school: data.mentee.school,
            bio: data.mentee.bio,
            career_goals: data.mentee.career_goals,
            skills: data.mentee.skills,
            preferredStartHour:
              data.mentee.meetingPreferences?.preferredStartHour || "00:00",
            preferredEndHour:
              data.mentee.meetingPreferences?.preferredEndHour || "23:59",
          });
        })
        .catch((error) => {
          console.error("Error fetching mentee data:", error);
          setUserData({
            name: "Failed to load user data",
            profileImageUrl: PLACEHOLDER,
          });
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchMenteeData();
  }, [user]);

  const handleCheckboxChange = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(
        selectedSkills.filter((currentSkill) => currentSkill !== skill)
      );
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <ResponsiveAppBar
        handleSignout={handleSignout}
        pages={["Dashboard", "Find Mentors"]}
        userName={user.name}
        profileImageUrl={user.profileImageUrl}
        userRole="mentee"
      />
      <Container>
        <Box sx={{ my: 2 }}>
          {loading ? (
            <div className="loading-spinner">
              <CircularProgress />
            </div>
          ) : (
            <>
              <div className="mp-top">
                <div className="mp-top-left">
                  <Typography variant="h4">Mentee Profile</Typography>
                </div>
                <div className="mp-top-right">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSignout}
                  >
                    Log Out
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleModalToggle}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/notes")}
                    sx={{ mr: 1 }}
                  >
                    Notes
                  </Button>
                </div>
              </div>
              <div className="mp-body">
                <div className="mp-left">
                  <img src={userData.profileImageUrl} alt="profile picture" />
                  <Typography variant="h4">{userData.name}</Typography>
                </div>
                <div className="mp-right">
                  <Typography>School: {userData.school}</Typography>
                  <Typography>Major: {userData.major}</Typography>
                  <Typography>Career Goals: {userData.career_goals}</Typography>
                  <Typography>Skills: {userData.skills}</Typography>
                  <Typography>Bio: {userData.bio}</Typography>
                  <Typography>
                    Preferred Start Hour:{" "}
                    {moment(userData.preferredStartHour, "HH:mm").format(
                      "h:mm A"
                    )}
                  </Typography>
                  <Typography>
                    Preferred End Hour:{" "}
                    {moment(userData.preferredEndHour, "HH:mm").format(
                      "h:mm A"
                    )}
                  </Typography>
                </div>
              </div>
            </>
          )}
          <Modal open={isModalOpen} onClose={handleModalToggle}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "50%",
                height: "75%",
                bgcolor: "background.paper",
                border: "1px solid #000",
                borderRadius: "8px",
                boxShadow: 24,
                p: 4,
                overflow: "auto",
              }}
            >
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
            </Box>
          </Modal>
        </Box>
      </Container>
    </>
  );
}

export default MenteeProfile;
