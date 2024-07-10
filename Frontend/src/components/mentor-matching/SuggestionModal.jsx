import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext.jsx";
import { useNavigate } from "react-router-dom";
import "../mentor/mentor-profile/MentorProfileModal.css";
import config from "../../../config.js";
import MentorCard from "./MentorCard.jsx";
import MatchModal from "./MatchModal.jsx";
import "./SuggestionModal.css";

function SuggestionModal({
  closeSuggestionModal,
  mentors,
  handleCardClick,
  mentee,
  closeMatchModal,
}) {
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="modal-close" onClick={closeSuggestionModal}>
          ×
        </span>
        <h3>Top Suggestions</h3>
        <div className="scroll-container">
          {mentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              score={mentor.score}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      </div>
      {isMatchModalOpen && (
        <MatchModal
          mentor={selectedMentor}
          closeModal={closeMatchModal}
          mentee={mentee}
        />
      )}
    </div>
  );
}

export default SuggestionModal;
