import express from "express";
import bcrypt from "bcrypt";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "../models/user.js";
import { Op } from "sequelize";
import { Mentor } from "../models/mentor.js";
import { PrismaClient } from "@prisma/client";
import { Mentee } from "../models/index.js";
import { Meeting } from "../models/index.js";
import { Review } from "../models/review.js";
import { ConnectRequest } from "../models/connect-request.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
const SALT_ROUNDS = 10;

const uploadDirectory = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

// Serve static files from the uploads directory
router.use("/uploads", express.static(uploadDirectory));

// directory to save images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// update user profile image
router.put("/user/:id", upload.single("profileImage"), async (req, res) => {
  try {
    const userId = req.params.id;

    const updatedUser = {};

    if (req.file) {
      updatedUser.profileImageUrl = `/uploads/${req.file.filename}`;
    }

    await User.update(updatedUser, { where: { id: userId } });

    const user = await User.findByPk(userId); // Fetch updated user to return

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// router to get userinfo
router.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "profileImageUrl", "userRole"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching uer information" });
  }
});

// Route for user registration
router.post("/users/signup", async (req, res) => {
  const { name, password, email, userRole } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      userRole,
    });

    // Create a Mentor profile if the userRole is 'mentor' or Mentee if profile is 'mentee'
    if (userRole === "mentor") {
      await Mentor.create({
        userId: newUser.id,
        school: "",
        company: "",
        work_role: "",
        years_experience: 0,
        industry: "",
        skills: "",
        bio: "",
      });
    } else {
      await Mentee.create({
        userId: newUser.id,
        school: "",
        major: "",
        career_goals: "",
        skills: "",
        bio: "",
      });
    }

    // Set the user in the session
    req.session.user = newUser;

    // Return the user data in the response
    res.json({ user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to delete a user
router.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the associated profile (Mentor or Mentee)
    if (user.userRole === "mentor") {
      const mentor = await Mentor.findOne({ where: { userId: user.id } });
      if (mentor) {
        await ConnectRequest.destroy({ where: { mentorId: mentor.id } });
        await Mentor.destroy({ where: { userId: user.id } });
      }
    } else {
      const mentee = await Mentee.findOne({ where: { userId: user.id } });
      if (mentee) {
        await ConnectRequest.destroy({ where: { menteeId: mentee.id } });
        await Mentee.destroy({ where: { userId: user.id } });
      }
    }

    // Delete the user
    await User.destroy({ where: { id: userId } });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route for user login
router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "No user with email found" });
    }

    // Compare the password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Set the user in the session
    req.session.user = user;

    // Return the user data in the response
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// route for user sign out
router.post("/users/signout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ error: "Failed to sign out" });
    }
    res.clearCookie("connect.sid", { path: "/" });
    return res.status(200).json({ message: "Successfully signed out" });
  });
});

// Route to update mentor profile
router.put("/mentors/:id", async (req, res) => {
  const mentorId = req.params.id;
  const {
    school,
    bio,
    company,
    work_role,
    years_experience,
    industry,
    skills,
    schoolState,
    schoolCity,
    preferredStartHour,
    preferredEndHour,
  } = req.body;

  try {
    // Find the mentor by ID
    const mentor = await Mentor.findOne({ where: { userId: mentorId } });

    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    // Update the mentor's profile with the new data
    await mentor.update({
      school,
      schoolState,
      schoolCity,
      bio,
      company,
      work_role,
      years_experience,
      industry,
      skills,
      meetingPreferences: {
        preferredStartHour,
        preferredEndHour,
      },
    });

    // Return the updated mentor data in the response
    res.json({ mentor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to fetch mentor profile based on user ID
router.get("/mentors/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the mentor by user ID
    const mentor = await Mentor.findOne({ where: { userId } });

    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    // Return the mentor data in the response
    res.json({ mentor });
  } catch (error) {
    console.error("Error fetching mentor profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to fetch mentor profiles
router.get("/mentors", async (req, res) => {
  try {
    // Find all mentors and include associated user data
    const mentors = await Mentor.findAll({
      include: {
        model: User,
        attributes: ["name", "profileImageUrl"],
      },
    });

    // Return the mentors data in the response
    res.json({ mentors });
  } catch (error) {
    console.error("Error fetching mentor profiles:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to update mentee profile
router.put("/mentees/:id", async (req, res) => {
  const mentorId = req.params.id;
  const {
    school,
    bio,
    major,
    career_goals,
    skills,
    schoolState,
    schoolCity,
    preferredStartHour,
    preferredEndHour,
  } = req.body;

  try {
    // Find the mentor by ID
    const mentee = await Mentee.findOne({ where: { userId: mentorId } });

    if (!mentee) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    // Update the mentor's profile with the new data
    await mentee.update({
      school,
      schoolState,
      schoolCity,
      bio,
      major,
      career_goals,
      skills,
      meetingPreferences: {
        preferredStartHour,
        preferredEndHour,
      },
    });

    // Return the updated mentor data in the response
    res.json({ mentee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to fetch mentee profile based on user ID
router.get("/mentees/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the mentor by user ID
    const mentee = await Mentee.findOne({ where: { userId } });

    if (!mentee) {
      return res.status(404).json({ error: "Mentee not found" });
    }

    // Return the mentor data in the response
    res.json({ mentee });
  } catch (error) {
    console.error("Error fetching mentor profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to fetch mentee profile based on user ID
router.get("/mentees/menteeId/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Find the mentor by user ID
    const mentee = await Mentee.findOne({ where: { id } });

    if (!mentee) {
      return res.status(404).json({ error: "Mentee not found" });
    }

    // Return the mentor data in the response
    res.json({ mentee });
  } catch (error) {
    console.error("Error fetching mentor profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to fetch mentee profiles
router.get("/mentees", async (req, res) => {
  try {
    // Find all mentors and include associated user data
    const mentees = await Mentee.findAll({
      include: {
        model: User,
        attributes: ["name", "profileImageUrl"],
      },
    });

    // Return the mentors data in the response
    res.json({ mentees });
  } catch (error) {
    console.error("Error fetching mentor profiles:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// route create connection requests
router.post("/connect-requests", async (req, res) => {
  const {
    menteeName,
    menteeSchool,
    menteeMajor,
    mentorId,
    menteeId,
    status,
    mentorName,
    mentorCompany,
    mentorWorkRole,
  } = req.body;

  try {
    // Check if a connect request already exists
    const existingRequest = await ConnectRequest.findOne({
      where: { mentorId, menteeId },
    });

    if (existingRequest) {
      return res.status(400).json({ error: "Connect request already exists" });
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
      status,
    });

    res.status(201).json({ connectRequest });
  } catch (error) {
    console.error("Error creating connect request:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// route to delete connect-requests
router.delete("/connect-requests/:id", async (req, res) => {
  const requestId = req.params.id;

  try {
    // Find the connect request by ID
    const connectRequest = await ConnectRequest.findByPk(requestId);

    if (!connectRequest) {
      return res.status(404).json({ error: "Connect request not found" });
    }

    // Delete the connect request
    await connectRequest.destroy();

    res.status(200).json({ message: "Connect request deleted successfully" });
  } catch (error) {
    console.error("Error deleting connect request:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// route to decline (delete) a connect request by requestId
router.delete("/connect-requests/:requestId", async (req, res) => {
  const { requestId } = req.params;

  try {
    // Find the connect request by requestId
    const connectRequest = await ConnectRequest.findByPk(requestId);

    if (!connectRequest) {
      return res.status(404).json({ error: "Connect request not found" });
    }

    // Delete the connect request
    await connectRequest.destroy();

    res.status(200).json({ message: "Connect request deleted successfully" });
  } catch (error) {
    console.error("Error deleting connect request:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// route to accept request
router.patch("/connect-requests/:requestId", async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  try {
    // Find the connect request by requestId
    const connectRequest = await ConnectRequest.findByPk(requestId);

    if (!connectRequest) {
      return res.status(404).json({ error: "Connect request not found" });
    }

    // Update the mentor's profile with the new data
    await connectRequest.update({
      status,
    });

    // Return the updated mentor data in the response
    res.json({ connectRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// route to get connect requests
router.get("/connect-requests", async (req, res) => {
  try {
    // Find all connect requests and include associated mentor and mentee data
    const connectRequests = await ConnectRequest.findAll({
      include: [
        {
          model: Mentor,
          attributes: [
            "id",
            "userId",
            "school",
            "bio",
            "company",
            "work_role",
            "years_experience",
            "industry",
            "skills",
          ],
          include: {
            model: User,
            attributes: ["id", "name", "email", "profileImageUrl"],
          },
        },
        {
          model: Mentee,
          attributes: [
            "id",
            "userId",
            "bio",
            "school",
            "major",
            "career_goals",
            "skills",
          ],
          include: {
            model: User,
            attributes: ["id", "name", "email", "profileImageUrl"],
          },
        },
      ],
    });

    // Return the connect requests data in the response
    res.json({ connectRequests });
  } catch (error) {
    console.error("Error fetching connect requests:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// route to get mentors specific requests
router.get("/connect-requests/:mentorId", async (req, res) => {
  const { mentorId } = req.params;

  try {
    const requests = await ConnectRequest.findAll({
      where: { mentorId },
    });

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: "Error fetching connect requests" });
  }
});

// route to get mentee specific requests
router.get("/connect-requests/mentee/:menteeId", async (req, res) => {
  const { menteeId } = req.params;

  try {
    const requests = await ConnectRequest.findAll({
      where: { menteeId },
    });

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: "Error fetching connect requests" });
  }
});

// route to get mentee specific meetings
router.get("/meetings/mentee/:menteeId", async (req, res) => {
  const { menteeId } = req.params;

  try {
    const meetings = await Meeting.findAll({
      include: [
        {
          model: Mentor,
          attributes: ["id"],
          include: [{ model: User, attributes: ["name"] }],
        },
        {
          model: Mentee,
          attributes: ["id"],
          where: { id: menteeId }, // Corrected the where clause to filter by id
          include: [{ model: User, attributes: ["name"] }],
        },
      ],
    });

    const response = meetings.map((meeting) => ({
      id: meeting.id,
      mentorId: meeting.mentorId,
      mentorName: meeting.Mentor.User.name,
      scheduledTime: meeting.scheduledTime,
      endTime: meeting.endTime,
      topic: meeting.topic,
      status: meeting.status,
      createdAt: meeting.createdAt,
      updatedAt: meeting.updatedAt,
      mentees: meeting.Mentees.map((mentee) => ({
        menteeId: mentee.id,
        menteeName: mentee.User.name,
      })),
    }));

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error fetching meetings" });
  }
});

// get a mentors meeting
router.get("/meetings/mentor/:mentorId", async (req, res) => {
  const { mentorId } = req.params;

  try {
    const meetings = await Meeting.findAll({
      where: { mentorId },
      include: [
        {
          model: Mentor,
          attributes: ["id"],
          include: [{ model: User, attributes: ["name"] }],
        },
        {
          model: Mentee,
          attributes: ["id"],
          include: [{ model: User, attributes: ["name"] }],
        },
      ],
    });

    const response = meetings.map((meeting) => ({
      id: meeting.id,
      mentorId: meeting.mentorId,
      mentorName: meeting.Mentor.User.name,
      scheduledTime: meeting.scheduledTime,
      endTime: meeting.endTime,
      topic: meeting.topic,
      status: meeting.status,
      createdAt: meeting.createdAt,
      updatedAt: meeting.updatedAt,
      mentees: meeting.Mentees.map((mentee) => ({
        menteeId: mentee.id,
        menteeName: mentee.User.name,
      })),
    }));

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error fetching meetings" });
  }
});

// check for conflicts
router.post("/meetings/conflict", async (req, res) => {
  const { mentorId, menteeId, scheduledTime } = req.body;
  const startTime = new Date(scheduledTime).toISOString();
  const endTime = new Date(
    new Date(scheduledTime).getTime() + 30 * 60 * 1000
  ).toISOString(); // 30 minute meeting

  try {
    // Check if there is a conflict
    const conflict = await Meeting.findOne({
      where: {
        [Op.or]: [
          {
            mentorId,
            [Op.and]: [
              { scheduledTime: { [Op.lte]: endTime } },
              { endTime: { [Op.gte]: startTime } },
            ],
          },
          {
            menteeId,
            [Op.and]: [
              { scheduledTime: { [Op.lte]: endTime } },
              { endTime: { [Op.gte]: startTime } },
            ],
          },
        ],
      },
    });

    res.json({ conflict: !!conflict });
  } catch (error) {
    res.status(500).json({ error: "Error checking for conflicts" });
  }
});

// create new meeting
router.post("/meetings", async (req, res) => {
  const MEETING_DURATION_MINUTES = 30;
  const MILLISECONDS_IN_MINUTE = 60 * 1000;

  const { mentorId, menteeIds, scheduledTime, topic } = req.body;
  const startTime = new Date(scheduledTime).toISOString();
  const endTime = new Date(
    new Date(scheduledTime).getTime() +
      MEETING_DURATION_MINUTES * MILLISECONDS_IN_MINUTE
  ).toISOString(); // 30 minute meeting

  try {
    // Create the new meeting
    const newMeeting = await Meeting.create({
      mentorId,
      scheduledTime: startTime,
      endTime: endTime,
      topic,
    });

    // Add mentees to the meeting by setting mentee IDs
    await newMeeting.setMentees(menteeIds);

    // Fetch the meeting with associated mentor and mentees
    const meetingWithDetails = await Meeting.findOne({
      where: { id: newMeeting.id },
      include: [
        {
          model: Mentor,
          attributes: ["id"],
          include: [{ model: User, attributes: ["name"] }],
        },
        {
          model: Mentee,
          attributes: ["id"],
          include: [{ model: User, attributes: ["name"] }],
        },
      ],
    });

    // Prepare the response with mentor and mentee details
    const response = {
      id: meetingWithDetails.id,
      mentorId: meetingWithDetails.mentorId,
      mentorName: meetingWithDetails.Mentor.User.name,
      scheduledTime: meetingWithDetails.scheduledTime,
      endTime: meetingWithDetails.endTime,
      topic: meetingWithDetails.topic,
      status: meetingWithDetails.status,
      createdAt: meetingWithDetails.createdAt,
      updatedAt: meetingWithDetails.updatedAt,
      mentees: meetingWithDetails.Mentees.map((mentee) => ({
        menteeId: mentee.id,
        menteeName: mentee.User.name,
      })),
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: "Error scheduling meeting" });
  }
});

// update meeting status (accept)
router.patch("/meetings/:meetingId", async (req, res) => {
  const { meetingId } = req.params;
  const { status } = req.body;

  try {
    const meeting = await Meeting.findByPk(meetingId);

    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    meeting.status = status;

    await meeting.save();

    res.json(meeting);
  } catch (error) {
    console.error("Error updating meeting status", error);
    res.status(500).json({ error: "server error" });
  }
});

// delete meeting (decline)
router.delete("/meeting/:meetingId", async (req, res) => {
  const { meetingId } = req.params;

  try {
    const meeting = await Meeting.findByPk(meetingId);

    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    await meeting.destroy();
    res.status(200).json({ message: "Meeting deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
});

// create new reveiw
router.post("/reviews", async (req, res) => {
  const { mentorId, menteeId, rating } = req.body;

  try {
    // create new review
    const review = await Review.create({ mentorId, menteeId, rating });

    // update mentors rating
    const mentor = await Mentor.findByPk(mentorId);

    // Update mentor ratings
    mentor.totalRating += rating;
    mentor.ratingCount += 1;
    mentor.averageRating = mentor.totalRating / mentor.ratingCount;

    await mentor.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// get reviews for a mentor
router.get("/mentors/:id/reviews", async (req, res) => {
  const mentorId = req.params.id;

  try {
    const reviews = await Review.findAll({ where: { mentorId } });
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
