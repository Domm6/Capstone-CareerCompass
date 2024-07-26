import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext.jsx";
import config from "../../../config.js";
import moment from "moment";
import "../mentor-matching/MatchModal.css";
import "./MeetingModal.css";
import { Container, Box, Typography, Button, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";

function MeetingModal({
  mentor,
  mentee,
  toggleModal,
  acceptMeeting,
  declineMeeting,
  selectedMeeting,
}) {
  const formattedDate = moment(selectedMeeting.end).format("MMMM Do YYYY");
  const formattedStartTime = moment(selectedMeeting.start).format("h:mm a");
  const formattedEndTime = moment(selectedMeeting.end).format("h:mm a");
  const navigate = useNavigate();

  return (
    <>
      <Modal open={true} onClose={toggleModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "8px",
          }}
        >
          <Box className="mm-body">
            <Typography variant="h4" gutterBottom>
              {selectedMeeting.title
                ? selectedMeeting.title
                : "No Meeting Title"}
            </Typography>
            <Typography>Status: {selectedMeeting.status}</Typography>
            <Typography>Mentor: {selectedMeeting.mentorName}</Typography>
            <Typography>Date: {formattedDate}</Typography>
            <Typography>
              Time: {formattedStartTime} - {formattedEndTime}
            </Typography>
            <Typography>Attendees:</Typography>
            {selectedMeeting.menteeNames.length > 0 ? (
              <ul>
                {selectedMeeting.menteeNames.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            ) : (
              <Typography>No attendees</Typography>
            )}
            <Box className="mm-btns" mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => acceptMeeting(selectedMeeting.id)}
                sx={{ mr: 1 }}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => declineMeeting(selectedMeeting.id)}
              >
                Decline
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/notes")}
                sx={{ mr: 1 }}
              >
                Notes
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default MeetingModal;
