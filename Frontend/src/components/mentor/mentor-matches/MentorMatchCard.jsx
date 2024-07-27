import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../mentee/mentee-matches/MatchCard.css";
import "./MentorMatchCard.css";
import ApiService from "../../../../ApiService.js";

const PLACEHOLDER =
  "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";

function MentorMatchCard({
  menteeName,
  menteeSchool,
  menteeMajor,
  requestId,
  menteeImage,
  menteeId,
}) {
  const navigate = useNavigate();
  const apiService = new ApiService();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleViewProfile = async () => {
    setLoading(true);
    try {
      const menteeData = await apiService.fetchMenteeDataMenteeId(menteeId);
      // console.log(menteeData);
      // console.log(menteeData.User.name);
      const mentee = {
        name: menteeData.User.name,
        school: menteeData.school,
        schoolState: menteeData.schoolState,
        schoolCity: menteeData.schoolCity,
        major: menteeData.major,
        bio: menteeData.bio,
        career_goals: menteeData.career_goals,
        skills: menteeData.skills,
        meetingPreferences: menteeData.meetingPreferences,
        profileImageUrl: menteeImage || PLACEHOLDER,
      };
      console.log(mentee);
      navigate("/public-mentee-profile", { state: { mentee } });
    } catch (error) {
      setErrorMessage("Failed to fetch mentee data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div
          className="request-container"
          id="mentor-request-container"
          onClick={handleViewProfile}
        >
          <div className="request-left">
            <div className="reqeust-img">
              <img src={menteeImage || PLACEHOLDER} alt="profile picture" />
            </div>
            <div className="request-text">
              <h3>{menteeName}</h3>
              <p>{menteeSchool}</p>
              <p>{menteeMajor}</p>
            </div>
          </div>
          <div className="request-right"></div>
        </div>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </>
  );
}

export default MentorMatchCard;
