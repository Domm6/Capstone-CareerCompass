import { useState } from "react";
import { UserContext } from "../../../UserContext.jsx";
import config from "../../../../config.js";
import "./Request.css";
import { CircularProgress } from "@mui/material";
import { Button } from "@mui/material";

const PLACEHOLDER =
  "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";

function Request({ name, major, school, requestId, onRequestUpdate, image }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // delete specific request
  const deleteRequest = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${config.apiBaseUrl}/connect-requests/${requestId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        onRequestUpdate(requestId);
      } else {
        setErrorMessage("Failed to delete connect request");
      }
      setLoading(false);
    } catch (error) {
      setErrorMessage("Error deleting connect request");
      setLoading(false);
    }
  };

  // accept specific request
  const acceptRequest = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${config.apiBaseUrl}/connect-requests/${requestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "accepted" }),
        }
      );

      if (response.ok) {
        onRequestUpdate(requestId);
      } else {
        setErrorMessage("Failed to accept connect request");
      }
      setLoading(false);
    } catch (error) {
      setErrorMessage("Error accepting connect request");
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="loading-spinner">
          <CircularProgress />
        </div>
      ) : (
        <div className="request-container">
          <div className="request-left">
            <div className="reqeust-img">
              <img src={image || PLACEHOLDER} alt="profile picture" />
            </div>
            <div className="request-text">
              <h3>{name}</h3>
              <p>{school}</p>
              <p>{major}</p>
            </div>
          </div>
          <div className="request-right">
            <div className="request-actions">
              <Button
                onClick={acceptRequest}
                variant="contained"
                color="primary"
              >
                Accept
              </Button>
              <Button
                onClick={deleteRequest}
                variant="contained"
                color="primary"
              >
                Decline
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Request;
