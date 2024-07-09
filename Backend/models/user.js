import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userRole: {
    type: DataTypes.ENUM('mentee', 'mentor'),
    allowNull: false,
  },
  profileImageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  }
}, {
  tableName: 'Users',
  timestamps: false,
});
