import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext.jsx";
import { useNavigate } from "react-router-dom";
import "../mentor/mentor-profile/MentorProfileModal.css";
import "./CalendarModal.css";
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
    // Parse the selected date
    const selectedDateMoment = moment(selectedDate, "YYYY-MM-DD");

    // Fetch and parse mentor's preferred hours
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

    // Fetch mentor's meetings
    const mentorMeetings = await fetchMentorMeetings(mentorId);

    // Filter mentor meetings by the selected date
    const filteredMentorMeetings = mentorMeetings.filter((meeting) => {
      const meetingDate = moment(meeting.scheduledTime).format("YYYY-MM-DD");
      return meetingDate === selectedDateMoment.format("YYYY-MM-DD");
    });

    // Sort mentor meetings by start time
    const sortedMentorMeetings = filteredMentorMeetings.sort(
      (a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime)
    );

    // Calculate mentor's free time slots within preferred hours
    const mentorFreeSlots = [];
    let lastEndTime = preferredStartTime;

    sortedMentorMeetings.forEach((meeting) => {
      const meetingStartTime = moment(meeting.scheduledTime);
      const meetingEndTime = moment(meeting.endTime);

      if (
        meetingStartTime.isAfter(lastEndTime) &&
        meetingStartTime.isBefore(preferredEndTime)
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

    // Add the last slot from the end of the last meeting to the end of the preferred time
    if (lastEndTime.isBefore(preferredEndTime)) {
      mentorFreeSlots.push({
        start: lastEndTime.clone(),
        end: preferredEndTime.clone(),
      });
    }

    // Initialize arrays to store mentees' data and meetings
    const menteesData = [];
    const menteesMeetings = [];

    // Loop through selected mentees
    for (const menteeId of selectedMentees) {
      // Fetch mentee's data and store preferred hours
      const menteeData = await fetchMenteeData(menteeId);
      menteesData.push({
        menteeId: menteeId,
        preferredStartHour: menteeData.meetingPreferences.preferredStartHour,
        preferredEndHour: menteeData.meetingPreferences.preferredEndHour,
      });

      // Fetch mentee's meetings and store
      const menteeMeetings = await fetchMenteeMeetings(menteeId);
      menteesMeetings.push({
        menteeId: menteeId,
        meetings: menteeMeetings.filter((meeting) => {
          const meetingDate = moment(meeting.scheduledTime).format(
            "YYYY-MM-DD"
          );
          return meetingDate === selectedDateMoment.format("YYYY-MM-DD");
        }),
      });
    }

    // Function to find common free slots
    const findCommonFreeSlots = (freeSlots, meetings) => {
      const commonSlots = [];
      freeSlots.forEach((slot) => {
        let isFree = true;
        meetings.forEach((meeting) => {
          const meetingStartTime = moment(meeting.scheduledTime);
          const meetingEndTime = moment(meeting.endTime);

          if (
            meetingStartTime.isBefore(slot.end) &&
            meetingEndTime.isAfter(slot.start)
          ) {
            isFree = false;
          }
        });
        if (isFree) {
          commonSlots.push(slot);
        }
      });
      return commonSlots;
    };

    // Find common free slots for all mentees
    let commonFreeSlots = mentorFreeSlots;
    menteesMeetings.forEach((mentee) => {
      commonFreeSlots = findCommonFreeSlots(commonFreeSlots, mentee.meetings);
    });

    // Split slots into 30-minute intervals
    const splitInto30MinuteSlots = (slots) => {
      const THIRTY_MIN_SLOT = 30;
      const result = [];
      slots.forEach((slot) => {
        let currentTime = slot.start.clone();
        while (currentTime.isBefore(slot.end)) {
          const endTime = moment.min(
            currentTime.clone().add(THIRTY_MIN_SLOT, "minutes"),
            slot.end
          );
          if (endTime.isAfter(currentTime)) {
            result.push({
              start: currentTime.format("HH:mm"),
              end: endTime.format("HH:mm"),
            });
          }
          currentTime.add(THIRTY_MIN_SLOT, "minutes");
        }
      });
      return result;
    };

    const formattedCommonFreeSlots = splitInto30MinuteSlots(commonFreeSlots);

    // Return the common free slots
    return formattedCommonFreeSlots;
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
                <button
                  key={index}
                  onClick={() => handleScheduleMeeting(timeSlot)}
                >
                  {moment(timeSlot.start, "HH:mm").format("h:mm A")} -{" "}
                  {moment(timeSlot.end, "HH:mm").format("h:mm A")}
                </button>
              ))
            ) : (
              <p>
                No suggested times available. Please select a mentees and a
                date.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarModal;
