import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../UserContext.jsx";
import Request from "./Request.jsx";
import "./Requests.css";
import config from "../../../../config.js";
import ApiService from "../../../../ApiService.js";
import { CircularProgress } from "@mui/material";

function Requests() {
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
          <h1>Requests</h1>
          {requests.filter((request) => request.status === "pending").length ===
          0 ? (
            <p>No requests</p>
          ) : (
            requests
              .filter((request) => request.status === "pending")
              .map((request) => (
                <Request
                  key={request.id}
                  name={request.menteeName}
                  image={request.menteeImage}
                  school={request.menteeSchool}
                  major={request.menteeMajor}
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

export default Requests;
