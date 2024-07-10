import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext.jsx";
import config from "../../config.js";
import moment from "moment";
import "./mentor-matching/MatchModal.css";
import "./MeetingModal.css";

function MeetingModal({
  mentor,
  mentee,
  toggleModal,
  acceptMeeting,
  declineMeeting,
  selectedMeeting,
}) {
  // this will be used for future implamentation
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
            <p>Attendees</p>
            <p>Date and Time</p>
            <div className="mm-btns">
              <button onClick={() => acceptMeeting(selectedMeeting.id)}>
                Accept
              </button>
              <button onClick={() => declineMeeting(selectedMeeting.id)}>
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MeetingModal;
