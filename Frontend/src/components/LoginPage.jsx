import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './LoginPage.css'

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { updateUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/users/login`, {
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
        // alert('Login failed: ' + error);
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
          <label htmlFor="email">email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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