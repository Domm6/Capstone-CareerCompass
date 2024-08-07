import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const Mentee = sequelize.define(
  "Mentee",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    school: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    schoolState: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    schoolCity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    major: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    career_goals: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    skills: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    meetingPreferences: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        preferredStartHour: "00:00",
        preferredEndHour: "23:59",
      },
    },
  },
  {
    tableName: "Mentees",
    timestamps: false,
  }
);
