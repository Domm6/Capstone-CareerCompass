import { User } from "./user.js";
import { Mentor } from "./mentor.js";
import { Mentee } from "./mentee.js";
import { MentorshipMatch } from "./mentorship-match.js";
import { Meeting } from "./Meeting.js";
import { ConnectRequest } from "./connect-request.js";
import { Review } from "./review.js";
import { MenteeMeeting } from "./mentee-meeting.js";

User.hasOne(Mentor, { foreignKey: "userId", as: "mentorProfile" });
User.hasOne(Mentee, { foreignKey: "userId", as: "menteeProfile" });

Mentor.belongsTo(User, { foreignKey: "userId" });
Mentee.belongsTo(User, { foreignKey: "userId" });

Mentor.belongsToMany(Mentee, {
  through: MentorshipMatch,
  foreignKey: "mentorId",
  as: "mentees",
});
Mentee.belongsToMany(Mentor, {
  through: MentorshipMatch,
  foreignKey: "menteeId",
  as: "mentors",
});
Meeting.belongsTo(Mentor, { foreignKey: "mentorId" });
Meeting.belongsToMany(Mentee, {
  through: MenteeMeeting,
  foreignKey: "meetingId",
});
Mentee.belongsToMany(Meeting, {
  through: MenteeMeeting,
  foreignKey: "menteeId",
});

Mentor.hasMany(ConnectRequest, {
  foreignKey: "mentorId",
  as: "connectRequests",
});
Mentee.hasMany(ConnectRequest, {
  foreignKey: "menteeId",
  as: "connectRequests",
});

ConnectRequest.belongsTo(Mentor, { foreignKey: "mentorId" });
ConnectRequest.belongsTo(Mentee, { foreignKey: "menteeId" });

Mentor.hasMany(Review, { foreignKey: "mentorId", as: "reviews" });
Mentee.hasMany(Review, { foreignKey: "menteeId", as: "reviews" });
Review.belongsTo(Mentor, { foreignKey: "mentorId" });
Review.belongsTo(Mentee, { foreignKey: "menteeId" });

export {
  User,
  Mentor,
  Mentee,
  MentorshipMatch,
  Meeting,
  Review,
  MenteeMeeting,
};
