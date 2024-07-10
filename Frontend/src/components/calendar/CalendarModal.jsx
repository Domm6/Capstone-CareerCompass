import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext.jsx";
import { useNavigate } from "react-router-dom";
import "../mentor/mentor-profile/MentorProfileModal.css";
import moment from "moment-timezone";
import config from "../../../config.js";

function CalendarModal({ toggleModal, onMeetingScheduled, isMentor }) {
  const { user } = useContext(UserContext);
  const [menteesOrMentors, setMenteesOrMentors] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [topic, setTopic] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState("");
  const navigate = useNavigate();

  // Fetch user data (mentor or mentee)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const url = isMentor(user)
          ? `${config.apiBaseUrl}/mentors/${user.id}`
          : `${config.apiBaseUrl}/mentees/${user.id}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserData(isMentor(user) ? data.mentor : data.mentee);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    if (user && user.id) {
      fetchUserData();
    }
  }, [user]);

  // Fetch list of requests using mentor ID
  useEffect(() => {
    const fetchRequests = async (userId) => {
      try {
        const url = isMentor(user)
          ? `${config.apiBaseUrl}/connect-requests/${userId}`
          : `${config.apiBaseUrl}/connect-requests/mentee/${userId}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }
        const data = await response.json();
        const acceptedRequests = data.requests.filter(
          (request) => request.status === "accepted"
        );
        setMenteesOrMentors(
          acceptedRequests.map((request) => ({
            id: isMentor(user) ? request.menteeId : request.mentorId,
            name: isMentor(user) ? request.menteeName : request.mentorName,
          }))
        );
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    if (userData && userData.id) {
      fetchRequests(userData.id);
    }
  }, [userData]);

  // Schedule a meeting
  const handleScheduleMeeting = async (event) => {
    event.preventDefault();

    const scheduledDateTime = moment
      .tz(
        `${scheduledDate}T${scheduledTime}`,
        "YYYY-MM-DDTHH:mm",
        "America/Los_Angeles"
      )
      .format();

    try {
      const response = await fetch(`${config.apiBaseUrl}/meetings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mentorId: isMentor(user) ? userData.id : selectedUser,
          menteeId: user.userRole === "mentee" ? userData.id : selectedUser,
          scheduledTime: scheduledDateTime,
          topic,
        }),
      });

      if (response.ok) {
        onMeetingScheduled();
        toggleModal();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="modal-close" onClick={toggleModal}>
          ×
        </span>
        <h3>Schedule Meeting:</h3>
        <form onSubmit={handleScheduleMeeting}>
          <div className="form-group">
            <label htmlFor="mentee-or-mentor">
              Select {isMentor(user) ? "Mentee" : "Mentor"}
            </label>
            <select
              id="mentee-or-mentor"
              value={selectedUser}
              onChange={(event) => setSelectedUser(event.target.value)}
              required
            >
              <option value="">
                Select {isMentor(user) ? "Mentee" : "Mentor"}
              </option>
              {menteesOrMentors.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              value={scheduledDate}
              onChange={(event) => setScheduledDate(event.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="time">Time:</label>
            <input
              type="time"
              id="time"
              value={scheduledTime}
              onChange={(event) => setScheduledTime(event.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="topic">Topic:</label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default CalendarModal;
