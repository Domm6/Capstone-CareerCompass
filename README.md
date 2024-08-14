# CareerCompass

[Project Plan Link](https://docs.google.com/document/d/1fK66Y3GIK12eqAS148DwcOe7q6lIE-Wumrvvb4dYV98/edit?usp=sharing)

[Demo](https://drive.google.com/file/d/10tbapRCC6aW0s2vb-iNTM606m1-y5kRb/view?usp=sharing)


## Overview

The Career Guidance and Mentorship Platform, CareerCompass, is designed to support individuals in navigating their career journeys by providing access to career information, mentorship opportunities, and interactive tools. This platform helps users understand different career paths, improve their job application materials, and connect with experienced mentors for personalized guidance. By addressing the lack of accessible career resources and mentorship, particularly for underrepresented groups in tech, this platform aims to empower users to make informed career decisions and achieve their professional goals.

**Category:** Career Development, Social Networking

**Story:** The Career Guidance and Mentorship Platform aims to provide comprehensive support for individuals navigating their career paths. Users can explore various career pathways, gain insights into required skills, and connect with mentors who can offer guidance and support. By integrating features such as mentor matching, scheduling mentoring sessions, and collaborative note-taking, the platform seeks to empower users to make informed career decisions and achieve their professional goals.

**Market:** The primary market for this app includes college students, recent graduates, and early-career professionals seeking guidance and mentorship. This platform also targets underrepresented groups in tech, providing them with the resources and support they need to succeed in their careers.

**Habit:** Users are expected to engage with the platform regularly, particularly during key career development stages, such as exploring new career opportunities and seeking mentorship. The career pathway exploration and mentorship matching features will encourage frequent usage as users continuously seek guidance and support.

**Scope:** The initial scope of the Career Guidance and Mentorship Platform includes user registration and profile creation, enabling seekers to highlight their career goals and mentors to showcase their expertise. This supports effective mentor-mentee matching based on relevant criteria. Scheduling functionalities allow for convenient arrangement of mentoring sessions. Optional features enhance the platform by allowing feedback and reviews to improve user experience, integrating Material UI for a cohesive and visually appealing interface, and developing reusable UI components for maintainability. Additionally, a mentor dashboard and public-facing profiles with reviews provide comprehensive management and visibility of mentoring activities, while a collaborative notes feature enables real-time documentation during sessions.

## Product Spec

### User Roles
- **Seeker:** A user who is seeking career guidance and mentorship.
- **Mentor:** A user who is providing career advice and mentorship.

### User Personas
**Seeker Personas**

- **Alex Johnson:** A 22-year-old recent college graduate from Chicago, IL, primarily using a laptop for job applications and career research but occasionally accesses the app on a smartphone. Needs guidance on improving resume and interview preparation.
- **Maria Rodriguez:** A 28-year-old software engineer from San Diego, CA, looking to transition into a management role. Uses both smartphone and laptop for career development and seeks insights and advice from experienced tech managers.

**Mentor Personas**

- **James Carter:** A 45-year-old senior project manager from New York, NY, with 20 years of experience in the tech industry. Uses a laptop for mentoring sessions and wants to help young professionals navigate their careers.
- **Linda Nguyen:** A 35-year-old UX designer from Austin, TX, passionate about mentoring women in tech. Uses a smartphone for quick interactions and a laptop for detailed mentoring sessions.

### User Stories

**Required**

- **User Registration:**
  - Seekers and mentors can create accounts to access career guidance and offer expertise.
- **Profile Creation:**
  - Seekers and mentors create detailed profiles to facilitate effective matching.
- **Mentor Matching:**
  - Seekers are matched with mentors based on career goals; mentors are matched with seekers based on their needs and expertise.
- **Scheduling Mentoring Sessions:**
  - Seekers and mentors can schedule mentoring sessions at convenient times.

**Optional**

- **Feedback and Reviews:**
  - Seekers can provide feedback on mentoring sessions; mentors can receive feedback to improve their approach.
- **Incorporate Material UI:**
  - Material UI integrated for a cohesive and visually appealing interface with customizable and reusable components.
- **Mentor Dashboard:**
  - Mentors can manage their mentoring activities and track interactions.
- **Public Facing Mentor Profile with Reviews:**
  - Mentees can view public-facing mentor profiles, including reviews.
- **Collaborative Notes Feature:**
  - Real-time collaborative note-taking for mentors and mentees during sessions.

## Screen Archetypes

## Data Model

**User Table**
- id (Primary Key)
- name (String)
- email (String, unique)
- password (String, hashed)
- user_role (String, enum: 'mentee', 'mentor')

**Mentee Table**
- id (Primary Key)
- user_id (Foreign Key referencing User.id)
- school (String)
- schoolCity (String)
- schoolState (String)
- major (String)
- bio (String)
- skills (Array of Strings)
- career_goals (String)
- meetingPreferences (Embedded Document)
- preferredStartHour (String)
- preferredEndHour (String)

**Mentor Table**
- id (Primary Key)
- user_id (Foreign Key referencing User.id)
- company (String)
- industry (String)
- work_role (String)
- years_experience (Integer)
- bio (String)
- skills (Array of Strings)
- meetingPreferences (Embedded Document)
- preferredStartHour (String)
- preferredEndHour (String)

**Meeting Table**
- id (Primary Key)
- mentor_id (Foreign Key referencing Mentor.id)
- mentee_id (Foreign Key referencing Mentee.id)
- date (Date)
- start_time (String)
- end_time (String)
- location (String)
- agenda (String)

**Review Table**
- id (Primary Key)
- mentor_id (Foreign Key referencing Mentor.id)
- mentee_id (Foreign Key referencing Mentee.id)
- rating (Integer, 1-5)
- textReview (String)
- date (Date)

**ConnectRequest Table**
- id (Primary Key)
- mentor_id (Foreign Key referencing Mentor.id)
- mentee_id (Foreign Key referencing Mentee.id)
- status (String, enum: 'pending', 'accepted', 'rejected')
- request_date (Date)
- response_date (Date)

**MenteeMeeting Table**
- id (Primary Key)
- mentee_id (Foreign Key referencing Mentee.id)
- meeting_id (Foreign Key referencing Meeting.id)

**MentorshipMatch Table**
- id (Primary Key)
- mentor_id (Foreign Key referencing Mentor.id)
- mentee_id (Foreign Key referencing Mentee.id)
- match_date (Date)

## Server Endpoints

**User Endpoints**
- **User Registration:** POST /users/signup
- **User Login:** POST /users/login
- **User Signout:** POST /users/signout
- **Get User Profile:** GET /users/:id
- **Update User Profile Image:** PUT /users/:id
- **Delete User:** DELETE /users/:id

**Mentor Endpoints**
- **Update Mentor Profile:** PUT /mentors/:id
- **Fetch Mentor Profile:** GET /mentors/:id
- **Fetch All Mentor Profiles:** GET /mentors

**Mentee Endpoints**
- **Update Mentee Profile:** PUT /mentees/:id
- **Fetch Mentee Profile:** GET /mentees/:id
- **Fetch Mentee Profile by Mentee ID:** GET /mentees/menteeId/:id
- **Fetch All Mentee Profiles:** GET /mentees

**Connect Request Endpoints**
- **Create Connect Request:** POST /connect-requests
- **Delete Connect Request:** DELETE /connect-requests/:id
- **Accept Connect Request:** PATCH /connect-requests/:requestId
- **Get All Connect Requests:** GET /connect-requests
- **Get Mentor's Connect Requests:** GET /connect-requests/:mentorId
- **Get Mentee's Connect Requests:** GET /connect-requests/mentee/:menteeId

**Meeting Endpoints**
- **Create Meeting:** POST /meetings
- **Check for Meeting Conflicts:** POST /meetings/conflict
- **Update Meeting Status:** PATCH /meetings/:meetingId
- **Delete Meeting:** DELETE /meeting/:meetingId
- **Get Mentee's Meetings:** GET /meetings/mentee/:menteeId
- **Get Mentor's Meetings:** GET /meetings/mentor/:mentorId

**Review Endpoints**
- **Create Review:** POST /reviews
- **Update Review:** PUT /reviews
- **Get Reviews for a Mentor:** GET /mentors/:id/reviews
- **Get Reviews for a Mentee:** GET /mentees/:id/reviews

## Navigation

**Project Requirements**
The project fulfills each of the base requirements through the following implementations:

**Technical Challenges:**
- Integrating

 a calendar system for setting and planning meetings.
- Matching mentors and mentees based on their aligning industries and roles.

**Database & API Integration:**
- Using a relational database (PostgreSQL) to manage user data, profiles, mentorship matches, sessions, and messages.
- Integrating external APIs, such as Google Calendar API for scheduling and imgbb API for image uploads.

**User Authentication:**
- Supporting user registration and login, allowing users to create and access their accounts securely.

**Visuals & Interactions:**
- Multiple views for different functionalities such as user registration, profile creation, mentor matching, and messaging.
- Custom tooltip interactions on hover over elements such as buttons and cards for complex visual styling.

## Technical Challenges

### Technical Challenge #1: Mentor Matching Recommendations
- **What:** Show recommended mentors to mentees using a ranking logic to pick the top suggested mentors.

### Technical Challenge #2: Advanced Session Scheduling
- **What:** Design an advanced interaction mechanism in the mentoring session scheduling system, including meeting preferences and group sessions.

## Database Integration
- Using PostgreSQL as the database management system for its robustness and scalability.
- Interacting with the database using Sequelize ORM for efficient database operations.

## External APIs
- **Logo API:** Fetches and displays company logos for mentors.
- **School API:** Allows users to search and select their schools, providing additional information.
- **Image Upload API (imgbb):** Used to upload and store images, primarily profile pictures for mentors.

## Authentication
- Handled using sessions, Sequelize, and bcrypt for secure user management.
- Sessions maintain user login states and are destroyed upon logout, with data managed via Sequelize and the PostgreSQL database.
- Protected routes ensure only authenticated users can access certain parts of the application.

## Visuals and Interactions

**Interesting Cursor Interaction:**
- Interactive hover effects on mentor cards in the "Find Mentors" section.

**UI Component with Custom Visual Styling:**
- Clean and modern mentor card designs with custom animations for an enhanced interactive experience.

**Loading State:**
- Integrated loading circles using Material-UI's CircularProgress component to inform users when data is being fetched.
