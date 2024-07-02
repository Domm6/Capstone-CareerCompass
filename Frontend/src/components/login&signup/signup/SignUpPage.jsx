import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUpPage.css'
import { UserContext } from '../../../UserContext.jsx';
import config from '../../../../config.js';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('');
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Make the signup API request
      const response = await fetch(`${config.apiBaseUrl}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, userRole }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        const loggedInUser = data.user;

        // Reset Page fields
        setName('')
        setEmail('');
        setPassword('');
        setUserRole('');

        // Update the user context
        updateUser(loggedInUser);

        if (loggedInUser.userRole === 'mentor') {
            navigate('/mentor-profile');
        } else if (loggedInUser.userRole === 'mentee') {
            navigate('/mentee-profile'); 
        } else {
            navigate('/')
        }

      } else {
        // Handle signup failure case
        alert('Signup failed');
      }
    } catch (error) {
      // Handle any network or API request errors
      alert('Signup failed: ' + error);
    }
  };

  return (
    <>
    <div className="signup-header">
        <h1>Welcome to CareerCompass!</h1>
    </div>
    <div className="signup-page-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="user-role">User Role:</label>
            <select           
                value={userRole}
                onChange={(event) => setUserRole(event.target.value)}
                required
            >
                <option value="">Select a Role</option>
                <option value="mentor">Mentor</option>
                <option value="mentee">Mentee</option>
            </select>
        </div>
        <button type="submit">Sign Up</button>
        <p>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </form>
    </div>
    </>
  );
};

export default SignUpPage;