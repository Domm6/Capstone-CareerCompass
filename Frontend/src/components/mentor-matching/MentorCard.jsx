import { useState } from "react";
import { UserContext } from "../../UserContext.jsx";
import "./MentorCard.css";
import config from "../../../config.js";

const PLACEHOLDER =
  "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";
const STAR_ICON =
  "https://cdn.iconscout.com/icon/free/png-256/free-star-bookmark-favorite-shape-rank-16-28621.png";
const API_KEY = import.meta.env.VITE_LOGO_API;

function MentorCard({ mentor, onCardClick, score }) {
  const { User: user } = mentor; // Access user data from mentor

  return (
    <>
      <div className="mc-container" onClick={() => onCardClick(mentor)}>
        <div className="mc-image">
          <img
            src={user.profileImageUrl || PLACEHOLDER}
            alt="profile picture"
          />
        </div>
        <div className="mc-body">
          <div className="mc-body-left">
            <div className="mc-name">
              <h3>{user.name}</h3>
            </div>
            <div className="mc-role">
              <p>{mentor.work_role}</p>
            </div>
            <div className="mc-company">
              <p>{mentor.company}</p>
            </div>
          </div>
          <div className="mc-body-right">
            <img
              src={`${config.logoDevApiBaseUrl}/${mentor.company}.com?token=${API_KEY}`}
              alt="company logo"
              onError={(error) => {
                error.target.onerror = null;
                error.target.src = PLACEHOLDER;
              }}
            />
            <div className="mc-body-right-rating">
              <p>{mentor.averageRating}</p>
              <img src={STAR_ICON} alt="mentor rating" />
            </div>
          </div>
        </div>
        <div className="mc-profile">
          <h3>About {user.name}:</h3>
          <p>{mentor.bio}</p>
        </div>
        <div className="mc-socre">
          {score && <p>{score.toFixed(2)}% Match</p>}
        </div>
      </div>
    </>
  );
}

export default MentorCard;
