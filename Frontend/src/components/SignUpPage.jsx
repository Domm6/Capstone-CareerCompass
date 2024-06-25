import {createUserWithEmailAndPassword} from "firebase/auth";
import { useState} from 'react';
import {auth} from "../firebase";
import "./SignUpPage.css"
import AuthDetails from "./AuthDetails";

function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signUp = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
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
            <div className="signup-container">
                <div className="signup-body">
                    <form onSubmit={signUp}>
                        <h3>Create Account</h3>
                        <div className="signup-details">
                            <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            <input type="password" placeholder="password" value={password}  onChange={(e) => setPassword(e.target.value)}/>
                            <button className='signup-btn' type='submit'>Signup</button>
                        </div>
                    </form>
                    <AuthDetails></AuthDetails>
                </div>
            </div>
        </>
    )
}

export default SignUpPage