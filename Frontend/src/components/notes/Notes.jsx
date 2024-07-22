import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../UserContext.jsx";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  ButtonGroup,
  CircularProgress,
} from "@mui/material";
import "./Notes.css";
import ResponsiveAppBar from "../header/ResponsiveAppBar.jsx";
import config from "../../../config.js";

const pages = ["Profile"];
const PLACEHOLDER =
  "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";

function Notes() {
  const { user } = useContext(UserContext);
  const [meetings, setMeetings] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [mentor, setMentor] = useState(location.state?.mentor || null);
  const [error, setError] = useState("");

  // fetch either mentor or mentee info based on user.userRole

  // fetch mentor or mentee meetings using mentorId or menteeId
  // filter meetings into groups based on names included

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

    const fetchMeetings = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${config.apiBaseUrl}/meetings/mentor/${profileData.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch meetings");
        }
        const data = await response.json();
        console.log(data);
        setMeetings(data);
      } catch (err) {
        console.error("Error fetching meetings:", err);
        setError("Failed to fetch meetings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id) {
      fetchProfileData();
      fetchMeetings();
    }
  }, [user]);

  //   console.log(meetings);
  //   console.log(user);
  console.log(profileData);

  // display each meeting

  // use meeting Url to embed a google doc

  return (
    <>
      <ResponsiveAppBar pages={pages} userName={user.name} userRole="mentor" />
      <div className="notes-title">
        <h1>Meeting Notes</h1>
      </div>
      <div className="notes-body">
        {loading ? (
          <div className="loading-spinner">
            <CircularProgress />
          </div>
        ) : (
          meetings.map((meeting) => (
            <div className="notes-meeting" key={meeting.id}>
              <div className="notes-left">
                <div className="notes-mentor">
                  <img src={PLACEHOLDER} id="notes-img" alt="mentor" />
                  <p>John Doe</p>
                </div>
              </div>
              <div className="notes-right">
                <div className="meeting-notes">
                  <h3>
                    {new Date(meeting.scheduledTime).toLocaleDateString()}
                  </h3>
                  <div className="meeting-notes-text">
                    {meeting.notesUrl ? (
                      <iframe
                        src={meeting.notesUrl}
                        title="Meeting Notes"
                      ></iframe>
                    ) : (
                      <p>No notes available for this meeting.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Notes;
