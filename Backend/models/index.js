import { User } from './user.js';
import { Mentor } from './mentor.js';
import { Mentee } from './mentee.js';

User.hasOne(Mentor, { foreignKey: 'userId', as: 'mentorProfile' });
User.hasOne(Mentee, { foreignKey: 'userId', as: 'menteeProfile' });

Mentor.belongsTo(User, { foreignKey: 'userId' });
Mentee.belongsTo(User, { foreignKey: 'userId' });

export { User, Mentor, Mentee };
