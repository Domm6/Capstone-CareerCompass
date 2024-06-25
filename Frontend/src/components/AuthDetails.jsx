import {onAuthStateChanged, signOut} from "firebase/auth"
import { useEffect, useState} from 'react';
import {auth} from "../firebase";

function AuthDetails () {
    const [authUser, setAuthUser] = useState(null)
    
    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if(user) {
                setAuthUser(user)
            } else {
                setAuthUser(null)
            }
        })

        return () => {
            listen();
        }
    }, [])


    const userSignOut = () => {
        signOut(auth).then(() => {
            console.log('Signout successful')
        }).catch(error => console.log(error))
    }

    return (
        <div className="auth-details-container">
            {authUser ? (
            <>
                <p>{`Signed In as ${authUser.email}`}</p>
                <button onClick={userSignOut}>Sign Out</button>
            </>
            ) : (
            <p>Signed Out</p>
            )}
      </div>
    )
}

export default AuthDetails