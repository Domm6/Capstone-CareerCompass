import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const MentorshipMatch = sequelize.define(
  "MentorshipMatch",
  {
    mentorId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Mentors",
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
    tableName: "MentorshipMatch",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["mentorId", "menteeId"],
      },
    ],
  }
);
