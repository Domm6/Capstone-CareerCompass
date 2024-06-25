import {signInWithEmailAndPassword} from "firebase/auth";
import { useState} from 'react';
import {auth} from "../firebase";
import "./LoginPage.css"
import AuthDetails from "./AuthDetails";

function LoginPage () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = (e) => {
        // login 
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
            console.log(userCredentials)
        }).catch((error) => {
            console.log(error)
        })
    }


    return (
        <>
        <div className="signup-header">
            <h1>Welcome to CareerCompass!</h1>
        </div>
        <div className="login-container">
            <div className="login-body">
                <form onSubmit={login}>
                    <h3>Login</h3>
                    <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" placeholder="password" value={password}  onChange={(e) => setPassword(e.target.value)}/>
                    <button className='login-btn' type='submit'>Login</button>
                </form>
                <AuthDetails></AuthDetails>
            </div>
        </div>
        </>
    )
}

export default LoginPage