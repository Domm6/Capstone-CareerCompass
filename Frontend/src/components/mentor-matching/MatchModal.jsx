import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext.jsx";
import config from "../../../config.js";
import { useNavigate } from "react-router-dom";
import "./MatchModal.css";
import {
  Container,
  Box,
  Typography,
  Button,
  ButtonGroup,
  Modal,
  CircularProgress,
} from "@mui/material";

const PLACEHOLDER =
  "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";

// experience map
const experienceMappingReverse = {
  1: "0-2",
  2: "2-5",
  3: "5-10",
  4: "10+",
  5: "20+",
};

function MatchModal({ mentor, closeModal, mentee }) {
  const { user } = useContext(UserContext); // Access the user context
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const reqData = {
      mentorId: mentor.id,
      menteeId: mentee.id,
      menteeName: user.name,
      menteeSchool: mentee.school,
      menteeMajor: mentee.major,
      mentorName: mentor.User.name,
      mentorCompany: mentor.company,
      mentorWorkRole: mentor.work_role,
      status: "pending",
    };

    try {
      setLoading(true);
      const response = await fetch(`${config.apiBaseUrl}/connect-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqData),
      });

      if (response.ok) {
        // Close the modal after a successful update
        closeModal();
      } else {
        const data = await response.json();
        setErrorMessage(data.error || "Error creating connect request");
      }
      setLoading(false);
    } catch (error) {
      setErrorMessage("Error creating connect request");
      console.error("Error creating connect request:", error);
      setLoading(false);
    }
  };

  const handleViewProfile = () => {
    navigate("/public-mentor-profile", { state: { mentor } });
    closeModal();
  };

  return (
    <>
      <Modal open={true} onClose={closeModal}>
        <Box
          className="modal-content"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "75%",
            height: "75%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            overflow: "auto",
          }}
        >
          <Box
            className="modal-close"
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          ></Box>
          {loading ? (
            <Box
              className="loading-spinner"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box
              className="mp-container"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                className="mp-body"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box className="mp-left" sx={{ mr: 2 }}>
                  <img
                    src={mentor.User.profileImageUrl || PLACEHOLDER}
                    alt="profile picture"
                    style={{ borderRadius: "50%", width: 100, height: 100 }}
                  />
                  <Typography variant="h5">{mentor.User.name}</Typography>
                </Box>
                <Box className="mp-right" sx={{ textAlign: "left" }}>
                  <Typography>Industry: {mentor.industry}</Typography>
                  <Typography>Company: {mentor.company}</Typography>
                  <Typography>Role: {mentor.work_role}</Typography>
                  <Typography>
                    Years of Experience:{" "}
                    {experienceMappingReverse[mentor.years_experience]} years
                  </Typography>
                  <Typography>School: {mentor.school}</Typography>
                  <Typography>Skills: {mentor.skills}</Typography>
                  <Typography>
                    Bio: {mentor.bio || "No Bio Available"}
                  </Typography>
                  <Typography>Rating: {mentor.averageRating}</Typography>
                </Box>
              </Box>
              <div className="match-btns">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  sx={{ mt: 2 }}
                >
                  Connect
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleViewProfile}
                >
                  View Profile
                </Button>
              </div>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
}

export default MatchModal;
