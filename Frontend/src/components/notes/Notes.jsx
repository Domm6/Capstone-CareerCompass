import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../UserContext.jsx";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  CircularProgress,
  Alert,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import "./Notes.css";
import ResponsiveAppBar from "../header/ResponsiveAppBar.jsx";
import config from "../../../config.js";

const pages = ["Dashboard", "Profile"];
const PLACEHOLDER =
  "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";

function Notes() {
  const { user } = useContext(UserContext);
  const [meetings, setMeetings] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [relatedUsers, setRelatedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [activeRelatedUser, setActiveRelatedUser] = useState(null);
  const [mentor, setMentor] = useState(location.state?.mentor || null);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNotesLink, setNewNotesLink] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [visibleMeetingsCount, setVisibleMeetingsCount] = useState(3);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        let response;
        if (user.userRole === "mentor") {
          response = await fetch(`${config.apiBaseUrl}/mentors/${user.id}`);
        } else if (user.userRole === "mentee") {
          response = await fetch(`${config.apiBaseUrl}/mentees/${user.id}`);
        } else {
          throw new Error("Invalid user role");
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch ${user.userRole} data`);
        }

        const data = await response.json();
        setProfileData(user.userRole === "mentor" ? data.mentor : data.mentee);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to fetch profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id) {
      fetchProfileData();
    }
  }, [user]);

  // Fetch mentor or mentee meetings using mentorId or menteeId
  useEffect(() => {
    const fetchMeetings = async () => {
      if (!profileData || !activeRelatedUser) return;

      setLoading(true);
      try {
        let response;
        if (user.userRole === "mentor") {
          response = await fetch(
            `${config.apiBaseUrl}/meetings/mentor/${profileData.id}`
          );
        } else if (user.userRole === "mentee") {
          response = await fetch(
            `${config.apiBaseUrl}/meetings/mentee/${profileData.id}`
          );
        } else {
          throw new Error("Invalid user role");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch meetings");
        }

        const data = await response.json();

        // Filter meetings based on activeRelatedUser
        const filteredMeetings = data.filter((meeting) => {
          if (user.userRole === "mentor") {
            return meeting.mentees.some(
              (mentee) => mentee.menteeId === activeRelatedUser.id
            );
          } else if (user.userRole === "mentee") {
            return meeting.mentorId === activeRelatedUser.id;
          }
          return false;
        });

        // Sort meetings by date, most recent first
        const sortedMeetings = filteredMeetings.sort(
          (a, b) => new Date(b.scheduledTime) - new Date(a.scheduledTime)
        );

        setMeetings(sortedMeetings);
      } catch (err) {
        console.error("Error fetching meetings:", err);
        setError("Failed to fetch meetings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (profileData && activeRelatedUser) {
      fetchMeetings();
    }
  }, [profileData, activeRelatedUser, user.userRole]);

  // Fetch related users (mentees or mentors) based on user role
  useEffect(() => {
    const fetchRelatedUsers = async () => {
      if (!profileData) return;

      setLoading(true);
      try {
        let response;
        if (user.userRole === "mentor") {
          response = await fetch(
            `${config.apiBaseUrl}/connect-requests/${profileData.id}`
          );
        } else if (user.userRole === "mentee") {
          response = await fetch(
            `${config.apiBaseUrl}/connect-requests/mentee/${profileData.id}`
          );
        } else {
          throw new Error("Invalid user role");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch related users");
        }
        const data = await response.json();
        const acceptedRequests = data.requests.filter(
          (request) => request.status === "accepted"
        );

        setRelatedUsers(
          acceptedRequests.map((request) =>
            user.userRole === "mentor"
              ? {
                  id: request.menteeId,
                  name: request.menteeName,
                  image: request.menteeImage,
                }
              : {
                  id: request.mentorId,
                  name: request.mentorName,
                  image: request.mentorImage,
                }
          )
        );
      } catch (err) {
        console.error("Error fetching related users:", err);
        setError("Failed to fetch related users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (profileData) {
      fetchRelatedUsers();
    }
  }, [profileData, user.userRole]);

  useEffect(() => {
    if (relatedUsers.length > 0 && !activeRelatedUser) {
      setActiveRelatedUser(relatedUsers[0]);
    }
  }, [relatedUsers]);

  // Function to handle card click
  const handleRelatedUserClick = (relatedUser) => {
    setActiveRelatedUser(relatedUser);
  };

  const handleOpenModal = (meeting) => {
    setSelectedMeeting(meeting);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMeeting(null);
  };

  const updateMeeting = async (meetingId, notesUrl) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${config.apiBaseUrl}/meetings/${meetingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notesUrl }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update meeting with notes URL");
      }

      const updatedMeeting = await response.json();
      setMeetings((prevMeetings) =>
        prevMeetings.map((meeting) =>
          meeting.id === updatedMeeting.id ? updatedMeeting : meeting
        )
      );

      setIsModalOpen(false);
      setLoading(false);
    } catch (error) {
      console.error("Error updating meeting with notes URL:", error);
      setError(
        "Failed to update meeting with notes URL. Please try again later."
      );
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setVisibleMeetingsCount((prevCount) => prevCount + 3);
  };

  return (
    <>
      <ResponsiveAppBar
        pages={pages}
        userName={user.name}
        userRole={user.userRole}
        profileImageUrl={user.profileImageUrl}
      />
      <div className="notes-title">
        <h1>Meeting Notes</h1>
      </div>
      <div className="notes-body">
        <div className="notes-left">
          {relatedUsers.length > 0 ? (
            relatedUsers.map((relatedUser) => (
              <div
                className={`notes-mentor ${
                  activeRelatedUser?.id === relatedUser.id ? "active" : ""
                }`}
                key={relatedUser.id}
                onClick={() => handleRelatedUserClick(relatedUser)}
              >
                <img
                  src={relatedUser.image || PLACEHOLDER}
                  id="notes-img"
                  alt="related user"
                />
                <p>{relatedUser.name}</p>
              </div>
            ))
          ) : (
            <p id="notes-left-text">
              {user.userRole === "mentee" ? "No Mentors" : "No Mentees"}
            </p>
          )}
        </div>
        <div className="notes-right">
          {loading ? (
            <div className="loading-spinner">
              <CircularProgress />
            </div>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : meetings.length === 0 ? (
            <p id="notes-left-text">No meetings</p>
          ) : (
            meetings.slice(0, visibleMeetingsCount).map((meeting) => (
              <div className="meeting-notes" key={meeting.id}>
                <div className="meeting-top">
                  <div className="meeting-top-left">
                    <h3>
                      {new Date(meeting.scheduledTime).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </h3>
                  </div>
                  <div className="meeting-top-right">
                    <h3>{meeting.topic}</h3>
                  </div>
                </div>
                <div className="meeting-notes-text">
                  {meeting.notesUrl ? (
                    <iframe
                      src={meeting.notesUrl}
                      frameBorder="0"
                      title="Meeting Notes"
                    ></iframe>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenModal(meeting)}
                      >
                        Add Notes
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
          {visibleMeetingsCount < meetings.length && (
            <Button
              id="notes-btn"
              variant="contained"
              color="primary"
              onClick={handleLoadMore}
            >
              Load More
            </Button>
          )}
        </div>
        <Modal open={isModalOpen} onClose={handleCloseModal} id="notes-modal">
          <div className="modal-content">
            <h2>Add Meeting Notes</h2>
            <TextField
              label="Notes URL"
              variant="outlined"
              fullWidth
              value={newNotesLink}
              onChange={(event) => setNewNotesLink(event.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => updateMeeting(selectedMeeting.id, newNotesLink)}
            >
              Add Notes
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default Notes;
