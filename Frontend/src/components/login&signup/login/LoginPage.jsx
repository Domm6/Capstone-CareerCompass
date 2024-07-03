import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../UserContext';
import './LoginPage.css'
import config from '../../../../config';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { updateUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${config.apiBaseUrl}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        const loggedInUser = data.user;

        updateUser(loggedInUser);

        if (loggedInUser.userRole === 'mentor') {
            navigate('/mentor-profile');
        } else if (loggedInUser.userRole === 'mentee') {
            navigate('/mentee-profile'); 
        } else {
            navigate('/')
        }
      } else {
        setErrorMessage("Wrong email or password, please try again");
      }
    } catch (error) {
        setErrorMessage(`Login failed: ${error.message}`);
    }
  };

  return (
    <>
    <div className="signup-header">
        <h1>Welcome to CareerCompass!</h1>
    </div>
    <div className='login-form-container'>
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
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
        <button type="submit">Login</button>
        <p>
          New to the app? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
    </>
  );
};

export default LoginPage;