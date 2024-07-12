import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../UserContext.jsx";
import config from "../../../config.js";
import moment from "moment-timezone";
import "./Calendar.css";
import CalendarModal from "./CalendarModal.jsx";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import MeetingModal from "../meeting/MeetingModal.jsx";

function Calendar() {
  const { user } = useContext(UserContext);
  const [meetings, setMeetings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

  // check if mentor
  const isMentor = (user) => user.userRole === "mentor";

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

  const fetchMeetings = async (userId) => {
    try {
      const url = isMentor(user)
        ? `${config.apiBaseUrl}/meetings/mentor/${userId}`
        : `${config.apiBaseUrl}/meetings/mentee/${userId}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch meetings");
      }
      const data = await response.json();

      const meetings = data.map((meeting) => {
        const start = moment.utc(meeting.scheduledTime).local().format();
        const end = meeting.endTime
          ? moment.utc(meeting.endTime).local().format()
          : moment
              .utc(meeting.scheduledTime)
              .add(30, "minutes")
              .local()
              .format();

        return {
          id: meeting.id,
          title: meeting.topic,
          status: meeting.status,
          backgroundColor: getMeetingColor(meeting.status),
          start: start,
          end: end,
        };
      });

      setMeetings(meetings);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  useEffect(() => {
    if (userData && userData.id) {
      fetchMeetings(userData.id);
    }
  }, [userData]);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleMeetingModalToggle = () => {
    setIsMeetingModalOpen(!isMeetingModalOpen);
  };

  const handleMeetingScheduled = () => {
    if (userData && userData.id) {
      fetchMeetings(userData.id);
    }
  };

  const handleMeetingClick = (info) => {
    setSelectedMeeting(info.event);
    setIsMeetingModalOpen(true);
  };

  // decline (delete) meetings
  const declineMeeting = async (meetingId) => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/meeting/${meetingId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete meeting");
      }
      const data = await response.json();
      if (userData && userData.id) {
        fetchMeetings(userData.id);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
    handleMeetingModalToggle();
  };

  // accept meetings
  const acceptMeeting = async (meetingId) => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/meetings/${meetingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "accepted" }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error accepting meeting`);
      }

      const data = await response.json();

      // Refresh meetings after accept
      if (userData && userData.id) {
        fetchMeetings(userData.id);
      }
    } catch (error) {
      setErrorMessage("Error accepting meeting");
    }
    handleMeetingModalToggle();
  };

  const getMeetingColor = (status) => {
    if (status === "accepted") {
      return "green";
    } else if (status === "pending") {
      return "orange";
    } else if (status === "declined") {
      return "red";
    } else {
      return "blue";
    }
  };

  return (
    <>
      {isMentor(user) && (
        <div className="add-meeting-btn">
          <button onClick={handleModalToggle}>Add Meeting</button>
        </div>
      )}
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          events={meetings}
          timeZone="PST"
          eventClick={handleMeetingClick}
        />
      </div>
      {isModalOpen && (
        <CalendarModal
          toggleModal={handleModalToggle}
          onMeetingScheduled={handleMeetingScheduled}
          isMentor={isMentor}
        ></CalendarModal>
      )}
      {isMeetingModalOpen && (
        <MeetingModal
          toggleModal={handleMeetingModalToggle}
          selectedMeeting={selectedMeeting}
          acceptMeeting={acceptMeeting}
          declineMeeting={declineMeeting}
        ></MeetingModal>
      )}
    </>
  );
}

export default Calendar;
