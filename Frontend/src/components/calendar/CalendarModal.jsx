import React, { startTransition, useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext.jsx";
import { useNavigate } from "react-router-dom";
import "../mentor/mentor-profile/MentorProfileModal.css";
import "./CalendarModal.css";
import ApiService from "../../../ApiService.js";
import {
  Container,
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormControl,
  CircularProgress,
} from "@mui/material";
import moment from "moment-timezone";
import config from "../../../config.js";

function CalendarModal({ toggleModal, onMeetingScheduled, isMentor }) {
  const { user } = useContext(UserContext);
  const [menteesOrMentors, setMenteesOrMentors] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [suggestedTimes, setSuggestedTimes] = useState([]);
  const [alternateTimes, setAlternateTimes] = useState([]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [topic, setTopic] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState("");
  const [mentorsMeetings, setMentorsMeetings] = useState([]);
  const [notesUrl, setNotesUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUserData = async (user, isMentor) => {
    const url = isMentor(user)
      ? `${config.apiBaseUrl}/mentors/${user.id}`
      : `${config.apiBaseUrl}/mentees/${user.id}`;

    setLoading(true);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
      setLoading(false);
    }
    const data = await response.json();
    setLoading(false);
    return isMentor(user) ? data.mentor : data.mentee;
  };

  const fetchRequests = async (userId, isMentor) => {
    const url = isMentor(user)
      ? `${config.apiBaseUrl}/connect-requests/${userId}`
      : `${config.apiBaseUrl}/connect-requests/mentee/${userId}`;

    setLoading(true);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch requests");
      setLoading(false);
    }
    const data = await response.json();
    setLoading(false);
    return data.requests.filter((request) => request.status === "accepted");
  };

  const fetchMentorMeetings = async (mentorId) => {
    setLoading(true);
    const response = await fetch(
      `${config.apiBaseUrl}/meetings/mentor/${mentorId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch meetings");
    }
    const data = await response.json();
    setLoading(false);
    return data;
  };

  const fetchMenteeMeetings = async (menteeId) => {
    setLoading(true);
    const response = await fetch(
      `${config.apiBaseUrl}/meetings/mentee/${menteeId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch meetings");
    }
    const data = await response.json();
    setLoading(false);
    return data;
  };

  const fetchMenteeData = async (menteeId) => {
    setLoading(true);
    const response = await fetch(
      `${config.apiBaseUrl}/mentees/menteeId/${menteeId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch meetings");
    }
    const data = await response.json();
    setLoading(false);
    return data.mentee;
  };

  const formatTimeSlot = (startTime) => {
    const start = moment(startTime, "HH:mm");
    const end = moment(start).add(30, "minutes"); // Assuming 30 minutes duration
    return { start: start.format("HH:mm"), end: end.format("HH:mm") };
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
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
        setLoading(false);
      } catch (error) {
        setErrorMessage(error.message);
        setLoading(false);
      }
    };

    initialize();
  }, [user, isMentor]);

  useEffect(() => {
    const fetchSuggestedTimes = async () => {
      if (userData && selectedUsers.length > 0 && scheduledDate) {
        const { suggestedTimes, alternateTimes } = await getSuggestedTimes(
          userData.id,
          selectedUsers,
          scheduledDate
        );
        setSuggestedTimes(suggestedTimes);
        setAlternateTimes(alternateTimes);
      } else {
        setSuggestedTimes([]); // Clear suggested times when no users are selected
        setAlternateTimes([]); // Clear alternate times
      }
    };

    fetchSuggestedTimes();
  }, [userData, selectedUsers, scheduledDate]);

  const handleScheduleMeeting = async (time) => {
    const timeSlot = formatTimeSlot(time);

    const scheduledDateTime = moment
      .tz(
        `${scheduledDate}T${timeSlot.start}`,
        "YYYY-MM-DDTHH:mm",
        "America/Los_Angeles"
      )
      .format();

    try {
      setLoading(true);
      const response = await fetch(`${config.apiBaseUrl}/meetings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mentorId: isMentor(user) ? userData.id : selectedUsers,
          menteeIds: user.userRole === "mentee" ? userData.id : selectedUsers,
          scheduledTime: scheduledDateTime,
          topic: topic.trim() ? topic : "No Title",
          notesUrl,
        }),
      });

      if (response.ok) {
        onMeetingScheduled();
        toggleModal();
        setLoading(false);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        setLoading(false);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
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

    // Filter mentor meetings by the selected date and overlapping time range
    const filteredMentorMeetings = mentorMeetings.filter((meeting) => {
      const meetingStartTime = moment(meeting.scheduledTime);
      const meetingEndTime = moment(meeting.endTime);

      const isSameDate = meetingStartTime.isSame(selectedDateMoment, "day");
      const isInOverlap =
        meetingStartTime.isBetween(
          overlapStartTime,
          overlapEndTime,
          null,
          "[)"
        ) &&
        meetingEndTime.isBetween(overlapStartTime, overlapEndTime, null, "(]");

      return isSameDate && isInOverlap;
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
        // adjust the start time to the nearest multiple of 10 minutes
        let adjustedStart = lastEndTime.clone();
        if (adjustedStart.minutes() % 10 !== 0) {
          adjustedStart.add(10 - (adjustedStart.minutes() % 10), "minutes");
        }

        // only add the slot if the adjusted start time is before the meeting start time
        if (adjustedStart.isBefore(meetingStartTime)) {
          mentorFreeSlots.push({
            start: adjustedStart,
            end: meetingStartTime.clone(),
          });
        }
      }

      if (meetingEndTime.isAfter(lastEndTime)) {
        lastEndTime = meetingEndTime;
      }
    });

    if (lastEndTime.isBefore(overlapEndTime)) {
      // Adjust the start time to the nearest multiple of 10 minutes
      let adjustedStart = lastEndTime.clone();
      if (adjustedStart.minutes() % 10 !== 0) {
        adjustedStart.add(10 - (adjustedStart.minutes() % 10), "minutes");
      }

      // Only add the slot if the adjusted start time is before the overlap end time
      if (adjustedStart.isBefore(overlapEndTime)) {
        mentorFreeSlots.push({
          start: adjustedStart,
          end: overlapEndTime.clone(),
        });
      }
    }

    // Subtract mentee meetings from mentor's free slots and break mentors slots into smaller slots
    const subtractMeetings = (freeSlots, meetings, meetingCount) => {
      // result slots
      const resultSlots = [];

      // go through the mentee's meetings first to update the meetingCount dictionary
      meetings.forEach((meeting) => {
        const meetingStart = moment(meeting.scheduledTime);
        const meetingEnd = moment(meeting.endTime);
        const meetingTimeKey = `${meetingStart.format(
          "HH:mm"
        )}-${meetingEnd.format("HH:mm")}`;
        meetingCount[meetingTimeKey] = (meetingCount[meetingTimeKey] || 0) + 1;
      });

      // go through each free slot for the mentor
      freeSlots.forEach((slot) => {
        let currentStart = slot.start;

        // go through the mentee's meeting again to adjust the free slots
        meetings.forEach((meeting) => {
          const meetingStart = moment(meeting.scheduledTime);
          const meetingEnd = moment(meeting.endTime);

          // check if the meeting overlaps with the current free slot
          if (
            meetingStart.isBefore(slot.end) &&
            meetingEnd.isAfter(slot.start)
          ) {
            // check if there is a portion of the free slot before the meeting starts, and add it to the result
            if (currentStart.isBefore(meetingStart)) {
              resultSlots.push({
                start: currentStart.clone(),
                end: meetingStart.clone(),
              });
            }

            // move start time to end of the meeting
            currentStart = meetingEnd.clone();
          }
        });

        // check if portion of free slot after the meeting ends, and add to free slots
        if (currentStart.isBefore(slot.end)) {
          resultSlots.push({
            start: currentStart.clone(),
            end: slot.end.clone(),
          });
        }
      });

      return resultSlots;
    };

    let finalFreeSlots = mentorFreeSlots;
    const meetingCount = {};

    selectedMentees.forEach((menteeId) => {
      finalFreeSlots = subtractMeetings(
        finalFreeSlots,
        menteesMeetings[menteeId],
        meetingCount
      );
    });

    // Function to break slots into 30 min intervals
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

    // Break final free slots into 30 min intervals
    const allIntervals = finalFreeSlots.flatMap((slot) =>
      breakIntoIntervals(slot)
    );

    // Collect all intervals in meetingCount dictionary
    allIntervals.forEach((slot) => {
      const intervalKey = `${slot.start.format("HH:mm")}-${slot.end.format(
        "HH:mm"
      )}`;
      meetingCount[intervalKey] = meetingCount[intervalKey] || 0;
    });

    // Sort the intervals by meeting count to find the least used times
    const sortedMeetingCount = Object.entries(meetingCount)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 5)
      .map(([time]) => {
        const [start, end] = time.split("-");
        return { start, end };
      });

    // Return suggested times and alternate times
    return {
      suggestedTimes: allIntervals.map((slot) => ({
        start: slot.start.format("HH:mm"),
        end: slot.end.format("HH:mm"),
      })),
      alternateTimes: sortedMeetingCount,
    };
  };

  return (
    <Modal open={true} onClose={toggleModal}>
      <Box className="modal-box">
        <Typography variant="h6" gutterBottom>
          Schedule Meeting
        </Typography>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <div className="calendar-modal-container">
            <form className="calendar-form">
              <FormControl fullWidth margin="normal">
                <Typography>
                  Select {isMentor(user) ? "Mentees" : "Mentor"}:
                </Typography>
                <FormGroup>
                  {menteesOrMentors.map((person) => (
                    <FormControlLabel
                      key={person.id}
                      control={
                        <Checkbox
                          value={person.id}
                          checked={selectedUsers.includes(person.id)}
                          onChange={handleCheckboxChange}
                        />
                      }
                      label={person.name}
                    />
                  ))}
                </FormGroup>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Date"
                  type="date"
                  value={scheduledDate}
                  onChange={(event) => setScheduledDate(event.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Time"
                  type="time"
                  value={scheduledTime}
                  onChange={(event) => setScheduledTime(event.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Topic"
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                />
              </FormControl>
              <TextField
                label="Google Doc URL for Notes"
                value={notesUrl}
                onChange={(event) => setNotesUrl(event.target.value)}
                fullWidth
                margin="normal"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => handleScheduleMeeting(scheduledTime)}
              >
                Schedule Meeting
              </Button>
            </form>
            <div className="calendar-times">
              <Box className="calendar-suggested-times" mt={2}>
                <Typography>Suggested Times</Typography>
                {suggestedTimes.length > 0 ? (
                  suggestedTimes.map((timeSlot, index) => (
                    <Box key={index} mt={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleScheduleMeeting(timeSlot.start)}
                      >
                        {moment(timeSlot.start, "HH:mm").format("h:mm A")} -{" "}
                        {moment(timeSlot.end, "HH:mm").format("h:mm A")}
                      </Button>
                    </Box>
                  ))
                ) : (
                  <Typography>
                    No suggested times available. Please select a mentee and a
                    date.
                  </Typography>
                )}
              </Box>
              <Box className="calendar-alternate-times" mt={2}>
                <Typography>
                  Alternate Times (Times with the least conflicting meetings)
                </Typography>
                {alternateTimes.length > 0 ? (
                  alternateTimes.map((timeSlot, index) => (
                    <Box key={index} mt={1}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleScheduleMeeting(timeSlot.start)}
                      >
                        {moment(timeSlot.start, "HH:mm").format("h:mm A")} -{" "}
                        {moment(timeSlot.end, "HH:mm").format("h:mm A")}
                      </Button>
                    </Box>
                  ))
                ) : (
                  <Typography>No alternate times available.</Typography>
                )}
              </Box>
            </div>
          </div>
        )}
      </Box>
    </Modal>
  );
}

export default CalendarModal;
