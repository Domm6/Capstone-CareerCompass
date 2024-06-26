import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('CareerCompass', 'postgres', 'Inlandforce%6', {
  host: 'localhost',
  dialect: 'postgres'
});