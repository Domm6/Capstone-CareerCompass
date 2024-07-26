import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../UserContext.jsx";
import Request from "../mentor-requests/Request.jsx";
import MatchCard from "../../mentee/mentee-matches/MatchCard.jsx";
import "./MentorMatches.css";
import config from "../../../../config.js";
import MentorMatchCard from "./MentorMatchCard.jsx";
import ApiService from "../../../../ApiService.js";
import { CircularProgress } from "@mui/material";

function MentorMatches() {
  const { user } = useContext(UserContext);
  const [mentorData, setMentorData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const apiService = new ApiService();

  // Fetch mentor-specific data using user ID from user context
  const fetchMentorData = async () => {
    setLoading(true);
    const data = await apiService.fetchMentorData(user.id);
    setMentorData(data);
    setLoading(false);
  };

  // Fetch list of requests using mentor ID
  const fetchRequests = async (mentorId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${config.apiBaseUrl}/connect-requests/${mentorId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }
      const data = await response.json();
      setRequests(data.requests);
      setLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchMentorData();
    }
  }, [user]);

  useEffect(() => {
    if (mentorData && mentorData.id) {
      fetchRequests(mentorData.id);
    }
  }, [mentorData]);

  // callback function to update page
  const handleReqeustUpdate = (requestId) => {
    setRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== requestId)
    );
  };

  return (
    <>
      {loading ? (
        <div className="loading-spinner">
          <CircularProgress />
        </div>
      ) : (
        <div className="requests-list">
          <h1>Matches</h1>
          {requests.filter((request) => request.status === "accepted")
            .length === 0 ? (
            <p>No matches</p>
          ) : (
            requests
              .filter((request) => request.status === "accepted")
              .map((request) => (
                <MentorMatchCard
                  key={request.id}
                  menteeName={request.menteeName}
                  menteeImage={request.menteeImage}
                  menteeSchool={request.menteeSchool}
                  menteeMajor={request.menteeMajor}
                  requestId={request.id}
                  onRequestUpdate={handleReqeustUpdate}
                />
              ))
          )}
        </div>
      )}
    </>
  );
}

export default MentorMatches;
