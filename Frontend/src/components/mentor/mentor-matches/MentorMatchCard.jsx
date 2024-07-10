import { useState } from "react";
import { UserContext } from "../../../UserContext.jsx";
import config from "../../../../config.js";
import "../../mentee/mentee-matches/MatchCard.css";

const PLACEHOLDER =
  "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";

function MentorMatchCard({ menteeName, menteeSchool, menteeMajor, requestId }) {
  return (
    <>
      <div className="request-container">
        <div className="request-left">
          <div className="reqeust-img">
            <img src={PLACEHOLDER} alt="profile picture" />
          </div>
          <div className="request-text">
            <h3>{menteeName}</h3>
            <p>{menteeSchool}</p>
            <p>{menteeMajor}</p>
          </div>
        </div>
        <div className="request-right"></div>
      </div>
    </>
  );
}

export default MentorMatchCard;
