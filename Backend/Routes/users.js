import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { Op } from 'sequelize';
import { Mentor } from '../models/mentor.js';
import { PrismaClient } from '@prisma/client';
import { Mentee } from '../models/index.js';
import { Meeting } from '../models/index.js';
import { ConnectRequest } from '../models/connect-request.js';

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

    // Create a Mentor profile if the userRole is 'mentor' or Mentee if profile is 'mentee'
    if (userRole === 'mentor') {
      await Mentor.create({
        userId: newUser.id,
        school: '',
        company: '',
        work_role: '',
        years_experience: 0,
        industry: '',
        skills: '',
        bio: ''
      });
    } else {
      await Mentee.create({
        userId: newUser.id,
        school: '',
        major: '',
        career_goals: '',
        skills: '',
        bio: ''
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

// Route to update mentee profile
router.put('/mentees/:id', async (req, res) => {
  const mentorId = req.params.id;
  const { school, bio, major, career_goals, skills } = req.body;

  try {
    // Find the mentor by ID
    const mentee = await Mentee.findOne({ where: { userId: mentorId } });

    if (!mentee) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    // Update the mentor's profile with the new data
    await mentee.update({
      school,
      bio,
      major,
      career_goals,
      skills
    });

      // Return the updated mentor data in the response
      res.json({ mentee });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
});

// Route to fetch mentee profile based on user ID
router.get('/mentees/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the mentor by user ID
    const mentee = await Mentee.findOne({ where: { userId } });

    if (!mentee) {
      return res.status(404).json({ error: 'Mentee not found' });
    }

    // Return the mentor data in the response
    res.json({ mentee });
  } catch (error) {
    console.error('Error fetching mentor profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to fetch mentee profiles
router.get('/mentees', async (req, res) => {
  try {

    // Find all mentors and include associated user data
    const mentees = await Mentee.findAll({
      include: {
        model: User,
        attributes: ['name', 'profileImageUrl']
      }
    });

    // Return the mentors data in the response
    res.json({ mentees });
  } catch (error) {
    console.error('Error fetching mentor profiles:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// route create connection requests
router.post('/connect-requests', async (req, res) => {
  const { menteeName, menteeSchool, menteeMajor, mentorId, menteeId, status, mentorName, mentorCompany, mentorWorkRole  } = req.body;

  try {
    // Check if a connect request already exists
    const existingRequest = await ConnectRequest.findOne({
      where: { mentorId, menteeId }
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'Connect request already exists' });
    }

    // Create new connect request
    const connectRequest = await ConnectRequest.create({
      mentorId,
      menteeId,
      menteeName,
      menteeSchool,
      menteeMajor,
      mentorName,
      mentorCompany,
      mentorWorkRole,
      status
    });

    res.status(201).json({ connectRequest });
  } catch (error) {
    console.error('Error creating connect request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// route to decline (delete) a connect request by requestId
router.delete('/connect-requests/:requestId', async (req, res) => {
  const { requestId } = req.params;

  try {
    // Find the connect request by requestId
    const connectRequest = await ConnectRequest.findByPk(requestId);

    if (!connectRequest) {
      return res.status(404).json({ error: 'Connect request not found' });
    }

    // Delete the connect request
    await connectRequest.destroy();

    res.status(200).json({ message: 'Connect request deleted successfully' });
  } catch (error) {
    console.error('Error deleting connect request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// route to accept request
router.patch('/connect-requests/:requestId', async (req,res) => {
  const {requestId} = req.params
  const {status} = req.body

  try {
    // Find the connect request by requestId
    const connectRequest = await ConnectRequest.findByPk(requestId);

    if (!connectRequest) {
      return res.status(404).json({ error: 'Connect request not found' });
    } 

    // Update the mentor's profile with the new data
    await connectRequest.update({
      status
    });

    // Return the updated mentor data in the response
    res.json({ connectRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }

})

// route to get connect requests
router.get('/connect-requests', async (req, res) => {
  try {
    // Find all connect requests and include associated mentor and mentee data
    const connectRequests = await ConnectRequest.findAll({
      include: [
        {
          model: Mentor,
          attributes: ['id', 'userId', 'school', 'bio', 'company', 'work_role', 'years_experience', 'industry', 'skills'],
          include: {
            model: User,
            attributes: ['id', 'name', 'email', 'profileImageUrl']
          }
        },
        {
          model: Mentee,
          attributes: ['id', 'userId', 'bio', 'school', 'major', 'career_goals', 'skills'],
          include: {
            model: User,
            attributes: ['id', 'name', 'email', 'profileImageUrl']
          }
        }
      ]
    });

    // Return the connect requests data in the response
    res.json({ connectRequests });
  } catch (error) {
    console.error('Error fetching connect requests:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// route to get mentors specific requests
router.get('/connect-requests/:mentorId', async (req, res) => {
  const { mentorId } = req.params;

  try {
    const requests = await ConnectRequest.findAll({
      where: { mentorId }
    });

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching connect requests' });
  }

});

// route to get mentee specific requests
router.get('/connect-requests/mentee/:menteeId', async (req, res) => {
  const { menteeId } = req.params;

  try {
    const requests = await ConnectRequest.findAll({
      where: { menteeId }
    });

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching connect requests' });
  }

});

// get a mentors meeting
router.get('/meetings/mentor/:mentorId', async (req, res) => {
  const { mentorId } = req.params;

  try {
    const meetings = await Meeting.findAll({
      where: { mentorId }
    });

    res.json({ meetings });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching meetings' });
  }
})

// get a mentees meetings
router.get('/meetings/mentee/:menteeId', async (req, res) => {
  const { menteeId } = req.params;

  try {
    const meetings = await Meeting.findAll({
      where: { menteeId }
    });

    res.json({ meetings });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching meetings' });
  }
})

// check for conflicts
router.post('/meetings/conflict', async (req, res) => {
  const { mentorId, menteeId, scheduledTime } = req.body;
  const startTime = new Date(scheduledTime).toISOString();
  const endTime = new Date(new Date(scheduledTime).getTime() + 30 * 60 * 1000).toISOString(); // 30 minute meeting

  try {
    // Check if there is a conflict
    const conflict = await Meeting.findOne({
      where: {
        [Op.or]: [
          {
            mentorId,
            [Op.and]: [
              { scheduledTime: { [Op.lte]: endTime } },
              { endTime: { [Op.gte]: startTime } }
            ]
          },
          {
            menteeId,
            [Op.and]: [
              { scheduledTime: { [Op.lte]: endTime } },
              { endTime: { [Op.gte]: startTime } }
            ]
          }
        ]
      }
    });

    res.json({ conflict: !!conflict });
  } catch (error) {
    res.status(500).json({ error: 'Error checking for conflicts' });
  }
});

// create new meeting
router.post('/meetings', async (req, res) => {
  const { mentorId, menteeId, scheduledTime, topic } = req.body;
  const startTime = new Date(scheduledTime).toISOString();
  const endTime = new Date(new Date(scheduledTime).getTime() + 30 * 60 * 1000).toISOString(); // 30 minute meeting

  try {
    // Check if there is a conflict
    const conflict = await Meeting.findOne({
      where: {
        [Op.or]: [
          {
            mentorId,
            [Op.and]: [
              { scheduledTime: { [Op.lte]: endTime } },
              { endTime: { [Op.gte]: startTime } }
            ]
          },
          {
            menteeId,
            [Op.and]: [
              { scheduledTime: { [Op.lte]: endTime } },
              { endTime: { [Op.gte]: startTime } }
            ]
          }
        ]
      }
    });

    if (conflict) {
      return res.status(400).json({ error: 'Scheduling conflict detected' });
    }

    // Create the new meeting
    const newMeeting = await Meeting.create({
      mentorId,
      menteeId,
      scheduledTime: startTime,
      endTime: endTime,
      topic
    });

    res.status(201).json(newMeeting);
  } catch (error) {
    res.status(500).json({ error: 'Error scheduling meeting' });
  }
});

export default router;