import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const ConnectRequest = sequelize.define(
  "ConnectRequest",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    mentorId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Mentors",
        key: "id",
      },
      allowNull: false,
    },
    menteeId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Mentees",
        key: "id",
      },
      allowNull: false,
    },
    menteeName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    menteeSchool: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    menteeMajor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      defaultValue: "pending",
      allowNull: false,
    },
    mentorName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mentorCompany: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mentorWorkRole: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "ConnectRequests",
    indexes: [
      {
        fields: ["mentorId"],
      },
      {
        fields: ["menteeId"],
      },
    ],
  }
);
