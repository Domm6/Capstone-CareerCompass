import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext.jsx";
import config from "../../../config.js";
import moment from "moment";
import "../mentor-matching/MatchModal.css";
import "./MeetingModal.css";
import { Container, Box, Typography, Button, ButtonGroup } from "@mui/material";

function MeetingModal({
  mentor,
  mentee,
  toggleModal,
  acceptMeeting,
  declineMeeting,
  selectedMeeting,
}) {
  // const formattedStartTime = moment(selectedMeeting.scheduledTime).format('MMMM Do YYYY, h:mm:ss a');
  // const formattedEndTime = moment(selectedMeeting.start).add(30, 'minutes').format('MMMM Do YYYY, h:mm:ss a');

  return (
    <>
      <div className="modal" id="match">
        <div className="modal-content">
          <span className="modal-close" onClick={toggleModal}>
            ×
          </span>
          <div className="mm-body">
            <h3>{selectedMeeting.title}</h3>
            <p>Status: {selectedMeeting.status}</p>
            <p>Mentor: {selectedMeeting.mentorName}</p>
            <p>Attendees:</p>
            {selectedMeeting.menteeNames.length > 0 ? (
              <ul>
                {selectedMeeting.menteeNames.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            ) : (
              <p>No attendees</p>
            )}
            <div className="mm-btns">
              <Button
                variant="contained"
                color="primary"
                onClick={() => acceptMeeting(selectedMeeting.id)}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MeetingModal;
