import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const Review = sequelize.define(
  "Review",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    mentorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    menteeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Reviews",
  }
);
