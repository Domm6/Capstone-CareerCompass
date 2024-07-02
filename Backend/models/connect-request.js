import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const ConnectRequest = sequelize.define('ConnectRequest', {
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
    allowNull: false,
  },
  menteeId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Mentees',
      key: 'id',
    },
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  school: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  major: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending',
    allowNull: false,
  }
}, {
  tableName: 'ConnectRequests',
  indexes: [
    {
      fields: ['mentorId'],
    },
    {
      fields: ['menteeId'],
    },
  ],
});
