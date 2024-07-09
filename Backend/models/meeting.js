import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const Meeting = sequelize.define('Meeting', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  mentorId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Mentors',
      key: 'id',
    },
  },
  menteeId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Mentees',
      key: 'id',
    },
  },
  scheduledTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending',
    allowNull: false,
  },
  topic: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'Meetings',
});
