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
import { ContentPasteOffSharp } from "@mui/icons-material";

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
              ? { id: request.menteeId, name: request.menteeName }
              : { id: request.mentorId, name: request.mentorName }
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

  const updateMeeting = () => {
    // call update meeting api endpoint

    setIsModalOpen(false);
  };

  return (
    <>
      <ResponsiveAppBar
        pages={pages}
        userName={user.name}
        userRole={user.userRole}
      />
      <div className="notes-title">
        <h1>Meeting Notes</h1>
      </div>
      <div className="notes-body">
        <div className="notes-left">
          {relatedUsers.map((relatedUser) => (
            <div
              className={`notes-mentor ${
                activeRelatedUser?.id === relatedUser.id ? "active" : ""
              }`}
              key={relatedUser.id}
              onClick={() => handleRelatedUserClick(relatedUser)}
            >
              <img src={PLACEHOLDER} id="notes-img" alt="mentor" />
              <p>{relatedUser.name}</p>
            </div>
          ))}
        </div>
        <div className="notes-right">
          {loading ? (
            <div className="loading-spinner">
              <CircularProgress />
            </div>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : meetings.length === 0 ? (
            <>
              <Modal open={isModalOpen} onClose={handleCloseModal}>
                <div className="modal-content">
                  <h2>Add New Meeting</h2>
                  <TextField
                    label="Meeting Link"
                    variant="outlined"
                    fullWidth
                    // value={newMeetingLink}
                    onChange={(e) => setNewMeetingLink(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    // onClick={handleAddMeeting}
                  >
                    Add Meeting
                  </Button>
                </div>
              </Modal>
            </>
          ) : (
            meetings.map((meeting) => (
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
                      <p>No notes available for this meeting.</p>
                    </>
                  )}
                </div>
              </div>
            ))
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
            <Button variant="contained" color="primary" onClick={updateMeeting}>
              Add Notes
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default Notes;
