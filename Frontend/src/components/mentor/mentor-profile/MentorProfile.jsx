import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../UserContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import "./MentorProfile.css";
import moment from "moment";
import MentorProfileModal from "./MentorProfileModal.jsx";
import config from "../../../../config.js";
import ResponsiveAppBar from "../../header/ResponsiveAppBar.jsx";
import { Container, Box, Typography, Button, Modal } from "@mui/material";

const PLACEHOLDER =
  "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";
const API_KEY = import.meta.env.VITE_LOGO_API;

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

const experienceMappingReverse = {
  1: "0-2",
  2: "2-5",
  3: "5-10",
  4: "10+",
  5: "20+",
};

function MentorProfile() {
  const { user } = useContext(UserContext);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { handleSignout } = useContext(UserContext);
  const pages = ["Dashboard"];

  const [userData, setUserData] = useState({
    name: "Loading",
    profileImageUrl: PLACEHOLDER,
    industry: "",
    company: "",
    work_role: "",
    years_experience: "",
    school: "",
    skills: "",
    preferredStartHour: "",
    preferredEndHour: "",
  });

  const fetchMentorData = () => {
    if (user && user.id) {
      fetch(`${config.apiBaseUrl}/mentors/${user.id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setUserData({
            name: user.name,
            profileImageUrl: user.profileImageUrl || PLACEHOLDER,
            industry: data.mentor.industry,
            company: data.mentor.company,
            work_role: data.mentor.work_role,
            years_experience:
              experienceMappingReverse[data.mentor.years_experience] || "",
            school: data.mentor.school,
            bio: data.mentor.bio,
            skills: data.mentor.skills,
            preferredStartHour:
              data.mentor.meetingPreferences.preferredStartHour,
            preferredEndHour: data.mentor.meetingPreferences.preferredEndHour,
          });
        })
        .catch((error) => {
          console.error("Error fetching mentor data:", error);
          setUserData({
            name: "Failed to load user data",
            profileImageUrl: PLACEHOLDER,
          });
        });
    }
  };

  useEffect(() => {
    fetchMentorData();
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
        pages={pages}
        userName={user.name}
        userRole="mentor"
      />{" "}
      <Container>
        <Box sx={{ my: 2 }}>
          <div className="mp-top">
            <div className="mp-top-left">
              <Typography variant="h4">Mentor Profile</Typography>
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
            </div>
          </div>
          <div className="mp-body">
            <div className="mp-left">
              <img src={userData.profileImageUrl} alt="profile picture" />
              <Typography variant="h4">{userData.name}</Typography>
            </div>
            <div className="mp-right">
              <Typography>Industry: {userData.industry}</Typography>
              <div className="mp-right-company">
                <Typography>Company: {userData.company}</Typography>
                <img
                  src={`https://img.logo.dev/${userData.company}.com?token=${API_KEY}`}
                  alt={`${userData.company} logo`}
                />
              </div>
              <Typography>Role: {userData.work_role}</Typography>
              <Typography>
                Years of Experience: {userData.years_experience} years
              </Typography>
              <Typography>School: {userData.school}</Typography>
              <Typography>Skills: {userData.skills}</Typography>
              <Typography>Bio: {userData.bio}</Typography>
              <Typography>
                Preferred Start Hour:{" "}
                {moment(userData.preferredStartHour, "HH:mm").format("h:mm A")}
              </Typography>
              <Typography>
                Preferred End Hour:{" "}
                {moment(userData.preferredEndHour, "HH:mm").format("h:mm A")}
              </Typography>
            </div>
          </div>
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
              <MentorProfileModal
                mentorData={userData}
                handleDropdownToggle={handleDropdownToggle}
                dropdownOpen={dropdownOpen}
                selectedSkills={selectedSkills}
                handleCheckboxChange={handleCheckboxChange}
                skillsList={skillsList}
                closeModal={() => {
                  handleModalToggle();
                  fetchMentorData();
                }}
              />
            </Box>
          </Modal>
          {/* {isModalOpen && (
            <MentorProfileModal
              mentorData={userData}
              handleDropdownToggle={handleDropdownToggle}
              dropdownOpen={dropdownOpen}
              selectedSkills={selectedSkills}
              handleCheckboxChange={handleCheckboxChange}
              skillsList={skillsList}
              closeModal={() => {
                handleModalToggle();
                fetchMentorData();
              }}
            />
          )} */}
        </Box>
      </Container>
    </>
  );
}

export default MentorProfile;
