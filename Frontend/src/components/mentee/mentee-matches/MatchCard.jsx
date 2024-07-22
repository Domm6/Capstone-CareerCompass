import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../UserContext.jsx";
import config from "../../../../config.js";
import "./MatchCard.css";
import {
  Container,
  Box,
  Typography,
  Button,
  Modal,
  Alert,
} from "@mui/material";

const PLACEHOLDER =
  "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";

function MatchCard({
  mentorName,
  mentorCompany,
  mentorWorkRole,
  requestId,
  mentee,
  mentorId,
  reviews,
  CircularProgress,
}) {
  const { user } = useContext(UserContext);
  const [rating, setRating] = useState(5);
  const [textReview, setTextReview] = useState("");
  const [message, setMessage] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRatingChange = (event) => {
    setRating(parseInt(event.target.value));
  };

  const handleTextReviewChange = (event) => {
    setTextReview(event.target.value);
  };

  const checkReview = () => {
    const reviewed = reviews.some((review) => review.mentorId === mentorId);
    setHasReviewed(reviewed);
    return reviewed;
  };

  const updateRating = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${config.apiBaseUrl}/reviews`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mentorId,
          menteeId: mentee.id,
          rating: rating,
          textReview: textReview,
        }),
      });

      if (response.ok) {
        setMessage("Rating updated successfully!");
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error}`);
      }
      setLoading(false);
    } catch (error) {
      setMessage("Server error, please try again later.");
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${config.apiBaseUrl}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mentorId,
          menteeId: mentee.id,
          rating: rating,
          textReview: textReview,
        }),
      });

      if (response.ok) {
        setMessage("Rating submitted successfully!");
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error}`);
      }
      setLoading(false);
    } catch (error) {
      setMessage("Server error, please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    checkReview();
  }, [reviews]);

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
              <img src={PLACEHOLDER} alt="profile picture" />
            </div>
            <div className="request-text">
              <h3>{mentorName}</h3>
              <p>{mentorCompany}</p>
              <p>{mentorWorkRole}</p>
            </div>
          </div>
          <div className="request-right">
            {message && (
              <Alert severity="success" onClose={() => setMessage("")}>
                {message}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <div className="right-rating">
                <select value={rating} onChange={handleRatingChange}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <input
                  type="text"
                  value={textReview}
                  onChange={handleTextReviewChange}
                  placeholder="Write your review here"
                />
                {hasReviewed ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={updateRating}
                  >
                    Change Rating
                  </Button>
                ) : (
                  <Button variant="contained" color="primary" type="submit">
                    Submit Rating
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default MatchCard;
