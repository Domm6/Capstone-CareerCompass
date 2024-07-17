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
      <Container maxWidth="xl" className="md-container">
        <Box className="md-top" sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" className="md-top-title">
            Mentor Dashboard
          </Typography>
        </Box>
        <Box className="md-nav" sx={{ mb: 4 }}>
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
        </Box>
        <Box className="md-body">
          {activeComponent === "Calendar" && (
            <Box className="md-body-calendar">
              <Calendar />
            </Box>
          )}
          {activeComponent === "Matches" && (
            <Box className="md-body-matches">
              <MenteeMatches></MenteeMatches>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
}

export default MenteeDashboard;
