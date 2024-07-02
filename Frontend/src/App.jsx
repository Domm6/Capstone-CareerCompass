import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import './App.css';
import HomePage from './components/home-page/HomePage'
import LoginPage from './components/login&signup/login/LoginPage'
import SignUpPage from './components/login&signup/signup/SignUpPage'
import MentorProfile from './components/mentor/mentor-profile/MentorProfile';
import MenteeProfile from './components/mentee/mentee-profile/MenteeProfile';
import MentorDashboard from './components/mentor/mentor-dashboard/MentorDashboard';
import MenteeDashboard from './components/mentee/mentee-dashboard/MenteeDashboard';
import Match from './components/mentor-matching/Match';

function App() {
  const [user, setUser] = useState(() => {
    // Retrieve the user data from storage or set it to null if not found
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  useEffect(() => {
    // Save the user data to storage whenever the user state changes
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <div className='App'>
      <UserContext.Provider value={{ user, updateUser }}>
      <Router>
        <Routes>
          <Route path="/" element={user ? <HomePage /> : <LoginPage />} />
          <Route path="/login" element={<LoginPage></LoginPage>}></Route>
          <Route path="/signup" element={<SignUpPage></SignUpPage>}></Route>
          <Route path="/mentor-profile" element={<MentorProfile></MentorProfile>}></Route>
          <Route path="/mentee-profile" element={<MenteeProfile></MenteeProfile>}></Route>
          <Route path="/mentor-dashboard" element={<MentorDashboard></MentorDashboard>}></Route>
          <Route path="/mentee-dashboard" element={<MenteeDashboard></MenteeDashboard>}></Route>
          <Route path="/matching" element={<Match></Match>}></Route>
        </Routes>
      </Router>
      </UserContext.Provider>
    </div>
  )
}

export default App
