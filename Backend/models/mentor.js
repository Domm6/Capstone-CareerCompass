import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const Mentor = sequelize.define('Mentor', {
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
    type: DataTypes.STRING,
    allowNull: false,
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
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Mentors',
  timestamps: false,
});
