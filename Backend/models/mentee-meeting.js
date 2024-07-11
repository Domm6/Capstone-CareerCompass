import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const MenteeMeeting = sequelize.define(
  "MenteeMeeting",
  {
    meetingId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Meeting",
        key: "id",
      },
    },
    menteeId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Mentees",
        key: "id",
      },
    },
  },
  {
    tableName: "MenteeMeetings",
  }
);
