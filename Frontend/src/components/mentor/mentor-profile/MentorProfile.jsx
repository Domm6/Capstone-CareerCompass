import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../UserContext.jsx";
import { useLocation } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import "./MentorProfile.css";
import moment from "moment";
import MentorProfileModal from "./MentorProfileModal.jsx";
import ReviewCard from "./ReviewCard.jsx";
import config from "../../../../config.js";
import ResponsiveAppBar from "../../header/ResponsiveAppBar.jsx";
import ApiService from "../../../../ApiService.js";
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
  const location = useLocation();
  const [mentor, setMentor] = useState(location.state?.mentor || null);
  const { handleSignout } = useContext(UserContext);
  const [reviews, setReviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const apiService = new ApiService();
  const pages = ["Dashboard"];

  const [userData, setUserData] = useState({
    name: mentor ? mentor.User.name : "Loading",
    profileImageUrl: mentor
      ? mentor.User.profileImageUrl || PLACEHOLDER
      : PLACEHOLDER,
    industry: mentor ? mentor.industry : "",
    company: mentor ? mentor.company : "",
    work_role: mentor ? mentor.work_role : "",
    years_experience: mentor ? mentor.years_experience : "",
    school: mentor ? mentor.school : "",
    skills: mentor ? mentor.skills : "",
    bio: mentor ? mentor.bio : "",
    preferredStartHour: mentor
      ? mentor.meetingPreferences.preferredStartHour
      : "",
    preferredEndHour: mentor ? mentor.meetingPreferences.preferredEndHour : "",
  });

  const fetchMentorData = async () => {
    if (user && user.id) {
      setLoading(true);
      try {
        const data = await apiService.fetchMentorData(user.id);
        setUserData({
          name: user.name,
          profileImageUrl: user.profileImageUrl || PLACEHOLDER,
          industry: data.industry,
          company: data.company,
          work_role: data.work_role,
          years_experience:
            experienceMappingReverse[data.years_experience] || "",
          school: data.school,
          bio: data.bio,
          skills: data.skills,
          preferredStartHour: data.meetingPreferences.preferredStartHour,
          preferredEndHour: data.meetingPreferences.preferredEndHour,
        });
      } catch (error) {
        setErrorMessage(error.message);
        setUserData({
          name: "Failed to load user data",
          profileImageUrl: PLACEHOLDER,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // fetch mentor reviews
  const fetchMentorReveiews = async (mentorId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${config.apiBaseUrl}/mentors/${mentorId}/reviews`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const filteredReviews = data.reviews.filter(
          (review) => review.textReview !== null
        );
        setReviews(filteredReviews);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData);
      }
      setLoading(false);
    } catch (error) {
      console.error("Server error, please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mentor) {
      fetchMentorData();
    } else {
      setUserData({
        name: mentor.User.name,
        profileImageUrl: mentor.User.profileImageUrl || PLACEHOLDER,
        industry: mentor.industry,
        company: mentor.company,
        work_role: mentor.work_role,
        years_experience:
          experienceMappingReverse[mentor.years_experience] || "",
        school: mentor.school,
        bio: mentor.bio,
        skills: mentor.skills,
        preferredStartHour: mentor.meetingPreferences.preferredStartHour,
        preferredEndHour: mentor.meetingPreferences.preferredEndHour,
      });

      // fetch mentor reviews
      fetchMentorReveiews(mentor.id);
    }
  }, [user, mentor]);

  const handleCheckboxChange = (skill) => {
    setSelectedSkills((prevSelectedSkills) =>
      prevSelectedSkills.includes(skill)
        ? prevSelectedSkills.filter((s) => s !== skill)
        : [...prevSelectedSkills, skill]
    );
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
        userRole={user.userRole}
        profileImageUrl={user.profileImageUrl}
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
                  <h1>Mentor Profile</h1>
                </div>
                {user.userRole === "mentor" && (
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
                )}
              </div>
              <div className="mp-body">
                <div className="mp-left">
                  <img
                    src={
                      user.profileImageUrl ||
                      userData.profileImageUrl ||
                      PLACEHOLDER
                    }
                    alt="profile picture"
                  />
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
              {user.userRole !== "mentor" && (
                <div className="mp-reviews">
                  <h3>Reviews</h3>
                  <div className="card-reviews">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))
                    ) : (
                      <Typography>No reviews available</Typography>
                    )}
                  </div>
                </div>
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
            </>
          )}
        </Box>
      </Container>
    </>
  );
}

export default MentorProfile;
