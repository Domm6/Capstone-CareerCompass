import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../UserContext";
import { Link } from "react-router-dom";
import "./ReviewCard.css";

const STAR_ICON =
  "https://cdn.iconscout.com/icon/free/png-256/free-star-bookmark-favorite-shape-rank-16-28621.png";

function ReviewCard({ review }) {
  return (
    <>
      <div className="mc-container" id="rc">
        <div className="rc-body">
          <div className="rc-left">
            <p>{review.rating}</p>
            <img src={STAR_ICON} alt="" id="rc-img" />
          </div>
          <div className="rc-right">
            <p>{review.textReview}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReviewCard;
