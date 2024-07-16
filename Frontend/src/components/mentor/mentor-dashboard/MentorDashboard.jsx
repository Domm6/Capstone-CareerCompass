import { useState, useContext } from "react";
import { UserContext } from "../../../UserContext.jsx";
import { Link } from "react-router-dom";
import "./MentorDashboard.css";
import Calendar from "../../calendar/Calendar.jsx";
import Matches from "../mentor-matches/MentorMatches.jsx";
import Requests from "../mentor-requests/Requests.jsx";
import { Container, Box, Typography, Button, ButtonGroup } from "@mui/material";
import ResponsiveAppBar from "../../header/ResponsiveAppBar.jsx";

const pages = ["Profile"];

function MentorDashboard() {
  const [activeComponent, setActiveComponent] = useState("Calendar");
  const { user } = useContext(UserContext);

  return (
    <>
      <ResponsiveAppBar pages={pages} userName={user.name} />{" "}
      <Container maxWidth="xl" className="md-container">
        <Box className="md-top" sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" className="md-top-title">
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
          <Button
            onClick={() => setActiveComponent("Requests")}
            variant="contained"
            color="primary"
          >
            Requests
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
              <Matches />
            </Box>
          )}
          {activeComponent === "Requests" && (
            <Box className="md-body-requests">
              <Requests />
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
}

export default MentorDashboard;
