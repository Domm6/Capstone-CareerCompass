import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../UserContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import "./MentorProfile.css";
import MentorProfileModal from "./MentorProfileModal.jsx";
import config from "../../../../config.js";

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
  // const logoApiKey = process.env.REACT_APP_LOGO_API_KEY; getting error process not defined

  const fetchLogo = () => {
    // use api to fetch logo
  };

  const [userData, setUserData] = useState({
    name: "Loading",
    profileImageUrl: PLACEHOLDER,
    industry: "",
    company: "",
    work_role: "",
    years_experience: "",
    school: "",
    skills: "",
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
      <div className="mp-header">
        <h1>CareerCompass</h1>
        <div className="mp-nav">
          <Link to="/mentor-dashboard">Dashboard</Link>
        </div>
      </div>
      <div className="mp-container">
        <div className="mp-top">
          <div className="mp-top-left">
            <h1>Mentor Profile</h1>
          </div>
          <div className="mp-top-right">
            <button onClick={handleModalToggle}>Edit</button>
          </div>
        </div>
        <div className="mp-body">
          <div className="mp-left">
            <img src={userData.profileImageUrl} alt="profile picture" />
            <h3>{userData.name}</h3>
          </div>
          <div className="mp-right">
            <p>Industry: {userData.industry}</p>
            <div className="mp-right-company">
              <p>Company: {userData.company}</p>
              <img
                src={`https://img.logo.dev/${userData.company}.com?token=pk_DCOxK2D7TA68fkEDQQ2_fQ`}
              />
            </div>
            <p>Role: {userData.work_role}</p>
            <p>Years of Experience: {userData.years_experience} years</p>
            <p>School: {userData.school}</p>
            <p>Skills: {userData.skills}</p>
            <p>Bio: {userData.bio}</p>
          </div>
        </div>
        {isModalOpen && (
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
        )}
        <button onClick={() => navigate("/mentor-dashboard")} id="save-button">
          Save
        </button>
      </div>
    </>
  );
}

export default MentorProfile;
