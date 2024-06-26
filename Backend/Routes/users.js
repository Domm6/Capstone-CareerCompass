import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { Op } from 'sequelize';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const SALT_ROUNDS = 10;

// Route for user registration
router.post('/users/signup', async (req, res) => {

  const { name, password, email, userRole } = req.body;


  try {
    // Check if email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      userRole
    });

    // Set the user in the session
    req.session.user = newUser;

    // Return the user data in the response
    res.json({ user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Route for user login
router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare the password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Set the user in the session
    req.session.user = user;

    // Return the user data in the response
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }

});

  // router to get userinfo
  router.get('/users/:id', async(req,res) => {

    try{
      const userId = req.params.id;
      const user = await User.findByPk(userId, {
        attributes: ['id', 'name', 'email', 'profileImageUrl', 'userRole']
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found'});
      }
      res.json(user)
    } catch {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Error fetching uer information'});
    }

  })


export default router;