import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../UserContext.jsx";
import Request from "../../mentor/mentor-requests/Request.jsx";
import MatchCard from "./MatchCard.jsx";
import MentorMatchCard from "../../mentor/mentor-matches/MentorMatchCard.jsx";
import "../../mentor/mentor-matches/MentorMatches.css";
import config from "../../../../config.js";
import { CircularProgress } from "@mui/material";

function MenteeMatches() {
  const { user } = useContext(UserContext);
  const [menteeData, setMenteeData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch mentee-specific data using user ID from user context
  const fetchMenteeData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.apiBaseUrl}/mentees/${user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch mentee data");
      }
      const data = await response.json();
      setMenteeData(data.mentee);
      setLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  // Fetch list of requests using mentee ID
  const fetchRequests = async (menteeId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${config.apiBaseUrl}/connect-requests/mentee/${menteeId}`
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

  // Function to fetch reviews for a mentee
  const fetchReviewsForMentee = async (menteeId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${config.apiBaseUrl}/mentees/${menteeId}/reviews`
      );
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json();
      setReviews(data.reviews);
      setLoading(false);
      return reviews;
    } catch (error) {
      setErrorMessage(error);
      setLoading(false);
      return [];
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchMenteeData();
    }
  }, [user]);

  useEffect(() => {
    if (menteeData && menteeData.id) {
      fetchRequests(menteeData.id);
      fetchReviewsForMentee(menteeData.id);
    }
  }, [menteeData]);

  // callback function to update page
  const handleReqeustUpdate = (requestId) => {
    setRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== requestId)
    );
  };

  console.log(requests);

  return (
    <>
      {loading ? (
        <div className="loading-spinner">
          <CircularProgress />
        </div>
      ) : (
        <div className="requests-list">
          <h1>Matches</h1>
          {requests
            .filter((request) => request.status === "accepted")
            .map((request) => (
              <MatchCard
                key={request.id}
                mentorName={request.mentorName}
                mentorCompany={request.mentorCompany}
                mentorWorkRole={request.mentorWorkRole}
                mentorId={request.mentorId}
                mentee={menteeData}
                requestId={request.id}
                onRequestUpdate={handleReqeustUpdate}
                reviews={reviews}
              />
            ))}
        </div>
      )}
    </>
  );
}

export default MenteeMatches;
