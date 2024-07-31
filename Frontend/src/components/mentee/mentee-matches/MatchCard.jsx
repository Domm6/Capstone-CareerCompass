import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../UserContext.jsx";
import { useNavigate } from "react-router-dom";
import config from "../../../../config.js";
import "./MatchCard.css";
import ApiService from "../../../../ApiService.js";
import {
  Container,
  Box,
  Typography,
  Button,
  Modal,
  Alert,
  CircularProgress,
} from "@mui/material";

const experienceMappingReverse = {
  1: "0-2",
  2: "2-5",
  3: "5-10",
  4: "10+",
  5: "20+",
};

const PLACEHOLDER =
  "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";
const API_KEY = import.meta.env.VITE_LOGO_API;

function MatchCard({
  mentorName,
  mentorImage,
  mentorCompany,
  mentorWorkRole,
  requestId,
  mentee,
  mentorId,
  reviews: initialReviews,
}) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [textReview, setTextReview] = useState("");
  const [message, setMessage] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState(initialReviews);
  const [errorMessage, setErrorMessage] = useState("");
  const apiService = new ApiService();

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
        const updatedReview = await response.json();
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.mentorId === mentorId && review.menteeId === mentee.id
              ? updatedReview
              : review
          )
        );
        checkReview(); // Re-check review status
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
        const newReview = await response.json();
        setReviews((prevReviews) => [...prevReviews, newReview]);
        checkReview(); // Re-check review status
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

  const handleViewProfile = async () => {
    setLoading(true);
    try {
      const mentor = await apiService.fetchMentorDataMentorId(mentorId);
      navigate("/public-mentor-profile", { state: { mentor } });
    } catch (error) {
      setErrorMessage("Failed to fetch mentee data.");
    } finally {
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
        <div className="request-container" id="mentor-request-container">
          <div className="request-left">
            <div className="reqeust-img">
              <img
                src={mentorImage || PLACEHOLDER}
                alt="profile picture"
                onClick={handleViewProfile}
                id="mentor-match-img"
              />
            </div>
            <div className="request-text">
              <h3>{mentorName}</h3>
              <div className="request-text-company">
                <p>{mentorCompany}</p>
                <img
                  src={`${config.logoDevApiBaseUrl}/${mentorCompany}.com?token=${API_KEY}`}
                  alt="company logo"
                  onError={(error) => {
                    error.target.onerror = null;
                    error.target.src = PLACEHOLDER;
                  }}
                />
              </div>
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
                <select
                  value={rating}
                  onChange={handleRatingChange}
                  id="rating-select"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <textarea
                  className="review-textarea"
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
