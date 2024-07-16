import { useState, useContext } from "react";
import { UserContext } from "../../../UserContext";
import "./MenteeDashboard.css";
import Calendar from "../../calendar/Calendar";
import Requests from "../../mentor/mentor-requests/Requests";
import { Link } from "react-router-dom";
import MenteeMatches from "../mentee-matches/MenteeMatches";
import MeetingModal from "../../meeting/MeetingModal";
import ResponsiveAppBar from "../../header/ResponsiveAppBar";
import { Container, Box, Typography, Button } from "@mui/material";

function MenteeDashboard() {
  const { user } = useContext(UserContext);
  const [activeComponent, setActiveComponent] = useState("Calendar");
  const pages = ["Dashboard", "Profile", "Find Mentors"];

  return (
    <>
      <ResponsiveAppBar
        pages={pages}
        userName={user.name}
        userRole="mentee"
      ></ResponsiveAppBar>
      <div className="md-container">
        <div className="md-top">
          <h1>Mentee Dashboard</h1>
        </div>
        <div className="md-nav">
          <Button
            onClick={() => setActiveComponent("Calendar")}
            variant="contained"
            color="primary"
          >
            Calendar
          </Button>
          <Button
            onClick={() => setActiveComponent("Matches")}
            variant="contained"
            color="primary"
          >
            Matches
          </Button>
        </div>
        <div className="md-body">
          {activeComponent == "Calendar" && <Calendar></Calendar>}
          {activeComponent == "Matches" && <MenteeMatches></MenteeMatches>}
        </div>
      </div>
    </>
  );
}

export default MenteeDashboard;
