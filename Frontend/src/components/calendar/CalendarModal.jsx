import React, { startTransition, useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext.jsx";
import { useNavigate } from "react-router-dom";
import "../mentor/mentor-profile/MentorProfileModal.css";
import "./CalendarModal.css";
import { Container, Box, Typography, Button, ButtonGroup } from "@mui/material";

import moment from "moment-timezone";
import config from "../../../config.js";

function CalendarModal({ toggleModal, onMeetingScheduled, isMentor }) {
  const { user } = useContext(UserContext);
  const [menteesOrMentors, setMenteesOrMentors] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [suggestedTimes, setSuggestedTimes] = useState([]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [topic, setTopic] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState("");
  const [mentorsMeetings, setMentorsMeetings] = useState([]);
  const navigate = useNavigate();

  const fetchUserData = async (user, isMentor) => {
    const url = isMentor(user)
      ? `${config.apiBaseUrl}/mentors/${user.id}`
      : `${config.apiBaseUrl}/mentees/${user.id}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const data = await response.json();
    return isMentor(user) ? data.mentor : data.mentee;
  };

  const fetchRequests = async (userId, isMentor) => {
    const url = isMentor(user)
      ? `${config.apiBaseUrl}/connect-requests/${userId}`
      : `${config.apiBaseUrl}/connect-requests/mentee/${userId}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch requests");
    }
    const data = await response.json();
    return data.requests.filter((request) => request.status === "accepted");
  };

  const fetchMentorMeetings = async (mentorId) => {
    const response = await fetch(
      `${config.apiBaseUrl}/meetings/mentor/${mentorId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch meetings");
    }
    const data = await response.json();
    return data;
  };

  const fetchMenteeMeetings = async (menteeId) => {
    const response = await fetch(
      `${config.apiBaseUrl}/meetings/mentee/${menteeId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch meetings");
    }
    const data = await response.json();
    return data;
  };

  const fetchMenteeData = async (menteeId) => {
    const response = await fetch(
      `${config.apiBaseUrl}/mentees/menteeId/${menteeId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch meetings");
    }
    const data = await response.json();
    return data.mentee;
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        if (user && user.id) {
          const fetchedUserData = await fetchUserData(user, isMentor);
          setUserData(fetchedUserData);

          if (isMentor(user)) {
            const requests = await fetchRequests(fetchedUserData.id, isMentor);
            setMenteesOrMentors(
              requests.map((request) => ({
                id: isMentor(user) ? request.menteeId : request.mentorId,
                name: isMentor(user) ? request.menteeName : request.mentorName,
              }))
            );

            const meetings = await fetchMeetings(fetchedUserData.id);
            setMentorsMeetings(meetings);
          }
        }
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    initialize();
  }, [user, isMentor]);

  useEffect(() => {
    const fetchSuggestedTimes = async () => {
      if (userData && selectedUsers.length > 0 && scheduledDate) {
        const suggestedTimes = await getSuggestedTimes(
          userData.id,
          selectedUsers,
          scheduledDate
        );
        setSuggestedTimes(suggestedTimes);
      } else {
        setSuggestedTimes([]); // Clear suggested times when no users are selected
      }
    };

    fetchSuggestedTimes();
  }, [userData, selectedUsers, scheduledDate]);

  const handleScheduleMeeting = async (timeSlot) => {
    const scheduledDateTime = moment
      .tz(
        `${scheduledDate}T${timeSlot.start}`,
        "YYYY-MM-DDTHH:mm",
        "America/Los_Angeles"
      )
      .format();

    try {
      const response = await fetch(`${config.apiBaseUrl}/meetings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mentorId: isMentor(user) ? userData.id : selectedUsers,
          menteeIds: user.userRole === "mentee" ? userData.id : selectedUsers,
          scheduledTime: scheduledDateTime,
          topic,
        }),
      });

      if (response.ok) {
        onMeetingScheduled();
        toggleModal();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedUsers((prevSelectedUsers) => {
      const updatedSelectedUsers = checked
        ? [...prevSelectedUsers, parseInt(value)]
        : prevSelectedUsers.filter((id) => id !== parseInt(value));

      if (updatedSelectedUsers.length === 0) {
        setSuggestedTimes([]); // Clear suggested times when no users are selected
      }

      return updatedSelectedUsers;
    });
  };

  const getSuggestedTimes = async (mentorId, selectedMentees, selectedDate) => {
    const THIRTY_MIN_MEETING = 30;
    const selectedDateMoment = moment(selectedDate, "YYYY-MM-DD");

    // fetch and format mentors preferred hours
    const { preferredStartHour, preferredEndHour } =
      userData.meetingPreferences;
    const preferredStartTime = moment(
      `${selectedDate} ${preferredStartHour}`,
      "YYYY-MM-DD HH:mm"
    );
    const preferredEndTime = moment(
      `${selectedDate} ${preferredEndHour}`,
      "YYYY-MM-DD HH:mm"
    );

    // arrays holding mentees data and meetings
    const menteesData = [];
    const menteesMeetings = {};

    // Fetch mentees' data and meetings
    for (const menteeId of selectedMentees) {
      const menteeData = await fetchMenteeData(menteeId);
      menteesData.push({
        menteeId: menteeId,
        preferredStartHour: menteeData.meetingPreferences.preferredStartHour,
        preferredEndHour: menteeData.meetingPreferences.preferredEndHour,
      });

      const menteeMeetings = await fetchMenteeMeetings(menteeId);
      menteesMeetings[menteeId] = menteeMeetings.filter((meeting) => {
        const meetingDate = moment(meeting.scheduledTime).format("YYYY-MM-DD");
        return meetingDate === selectedDateMoment.format("YYYY-MM-DD");
      });
    }

    // calc the overlapping time range
    const overlapStartTime = menteesData.reduce((latestStartTime, mentee) => {
      const menteeStartTime = moment(
        `${selectedDate} ${mentee.preferredStartHour}`,
        "YYYY-MM-DD HH:mm"
      );
      return menteeStartTime.isAfter(latestStartTime)
        ? menteeStartTime
        : latestStartTime;
    }, preferredStartTime);

    const overlapEndTime = menteesData.reduce((earliestEndTime, mentee) => {
      const menteeEndTime = moment(
        `${selectedDate} ${mentee.preferredEndHour}`,
        "YYYY-MM-DD HH:mm"
      );
      return menteeEndTime.isBefore(earliestEndTime)
        ? menteeEndTime
        : earliestEndTime;
    }, preferredEndTime);

    // fetch mentors meetings
    const mentorMeetings = await fetchMentorMeetings(mentorId);

    // add fixed lunch break from 12:00 - 1:00
    const lunchStart = moment(`${selectedDate} 12:00`, "YYYY-MM-DD HH:mm");
    const lunchEnd = moment(`${selectedDate} 13:00`, "YYYY-MM-DD HH:mm");

    mentorMeetings.push({
      id: "lunch",
      mentorId: mentorId,
      mentorName: "Lunch Break",
      scheduledTime: lunchStart.format(),
      endTime: lunchEnd.format(),
    });

    // filter mentor meetings by the selected date
    const filteredMentorMeetings = mentorMeetings.filter((meeting) => {
      const meetingDate = moment(meeting.scheduledTime).format("YYYY-MM-DD");
      return meetingDate === selectedDateMoment.format("YYYY-MM-DD");
    });

    // Sort mentor meetings by start time
    const sortedMentorMeetings = filteredMentorMeetings.sort(
      (a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime)
    );

    // calc mentor's free time slots within the overlapping time range
    const mentorFreeSlots = [];
    let lastEndTime = overlapStartTime;

    sortedMentorMeetings.forEach((meeting) => {
      const meetingStartTime = moment(meeting.scheduledTime);
      const meetingEndTime = moment(meeting.endTime);

      if (
        meetingStartTime.isAfter(lastEndTime) &&
        meetingStartTime.isBefore(overlapEndTime)
      ) {
        mentorFreeSlots.push({
          start: lastEndTime.clone(),
          end: meetingStartTime.clone(),
        });
      }

      if (meetingEndTime.isAfter(lastEndTime)) {
        lastEndTime = meetingEndTime;
      }
    });

    if (lastEndTime.isBefore(overlapEndTime)) {
      mentorFreeSlots.push({
        start: lastEndTime.clone(),
        end: overlapEndTime.clone(),
      });
    }

    // function to break slots into 30 min intervals
    const breakIntoIntervals = (slot) => {
      const intervals = [];
      let currentStart = slot.start.clone();

      while (currentStart.isBefore(slot.end)) {
        const currentEnd = currentStart
          .clone()
          .add(THIRTY_MIN_MEETING, "minutes");
        if (currentEnd.isAfter(slot.end)) break;
        intervals.push({
          start: currentStart.clone(),
          end: currentEnd.clone(),
        });
        currentStart.add(THIRTY_MIN_MEETING, "minutes");
      }

      return intervals;
    };

    // break mentor free slots into 30 min intervals
    const allIntervals = mentorFreeSlots.flatMap((slot) =>
      breakIntoIntervals(slot)
    );

    // filter intervals to remove conflicts with mentees meetings
    const finalFreeSlots = allIntervals.filter((interval) => {
      return selectedMentees.every((menteeId) => {
        const hasConflict = menteesMeetings[menteeId].some((meeting) => {
          const meetingStartTime = moment(meeting.scheduledTime);
          const meetingEndTime = moment(meeting.endTime);

          const conflict =
            interval.start.isBefore(meetingEndTime) &&
            interval.end.isAfter(meetingStartTime);

          return conflict;
        });

        return !hasConflict;
      });
    });

    // return suggested times
    return finalFreeSlots.map((slot) => ({
      start: slot.start.format("HH:mm"),
      end: slot.end.format("HH:mm"),
    }));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="modal-close" onClick={toggleModal}>
          ×
        </span>
        <h3>Schedule Meeting:</h3>
        <div className="calendar-modal-container">
          <form className="calendar-form">
            <div className="form-group">
              <label>Select {isMentor(user) ? "Mentees" : "Mentor"}:</label>
              <div className="checkbox-list">
                {menteesOrMentors.map((person) => (
                  <div key={person.id} className="checkbox-item">
                    <p>{person.name}</p>
                    <input
                      type="checkbox"
                      value={person.id}
                      checked={selectedUsers.includes(person.id)}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                value={scheduledDate}
                onChange={(event) => setScheduledDate(event.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="topic">Topic:</label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
              />
            </div>
          </form>
          <div className="calendar-suggested-times">
            <label>Suggested Times</label>
            {suggestedTimes.length > 0 ? (
              suggestedTimes.map((timeSlot, index) => (
                <div key={index} className="time-slot">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleScheduleMeeting(timeSlot)}
                  >
                    {moment(timeSlot.start, "HH:mm").format("h:mm A")} -{" "}
                    {moment(timeSlot.end, "HH:mm").format("h:mm A")}
                  </Button>
                </div>
              ))
            ) : (
              <p>
                No suggested times available. Please select a mentee and a date.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarModal;
