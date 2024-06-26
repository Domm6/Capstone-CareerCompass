import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { Op } from 'sequelize';
import { Mentor } from '../models/mentor.js';
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

    // Create a Mentor profile if the userRole is 'mentor'
    if (userRole === 'mentor') {
      await Mentor.create({
        userId: newUser.id,
        school: '',
        company: '',
        work_role: '',
        years_experience: 0,
        industry: '',
        skills: ''
      });
    }

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
      return res.status(401).json({ error: 'No user with email found' });
    }

    // Compare the password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid password' });
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

// Route to update mentor profile
router.put('/mentors/:id', async (req, res) => {
  const mentorId = req.params.id;
  const { school, bio, company, work_role, years_experience, industry, skills } = req.body;

  try {
    // Find the mentor by ID
    const mentor = await Mentor.findOne({ where: { userId: mentorId } });

    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    // Update the mentor's profile with the new data
    await mentor.update({
      school,
      bio,
      company,
      work_role,
      years_experience,
      industry,
      skills
    });

      // Return the updated mentor data in the response
      res.json({ mentor });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
});

// Route to fetch mentor profile based on user ID
router.get('/mentors/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the mentor by user ID
    const mentor = await Mentor.findOne({ where: { userId } });

    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    // Return the mentor data in the response
    res.json({ mentor });
  } catch (error) {
    console.error('Error fetching mentor profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to fetch mentor profiles
router.get('/mentors', async (req, res) => {
  try {

    // Find all mentors and include associated user data
    const mentors = await Mentor.findAll({
      include: {
        model: User,
        attributes: ['name', 'profileImageUrl']
      }
    });

    // Return the mentors data in the response
    res.json({ mentors });
  } catch (error) {
    console.error('Error fetching mentor profiles:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



export default router;