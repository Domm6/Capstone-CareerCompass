import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const Mentor = sequelize.define(
  "Mentor",
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
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    work_role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    years_experience: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    skills: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    totalRating: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    averageRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
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
    tableName: "Mentors",
    timestamps: false,
  }
);
