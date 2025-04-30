import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider, signInWithPopup } from '../firebase'; // Import from firebase.js
import style from './LoginPage.module.css'; // adjust path as needed
import '../global.css'; // Import global CSS

const LoginPage = () => {
    const navigate = useNavigate();
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken')); // Retrieve token from localStorage lazily

    useEffect(() => {
        if (authToken) {
            const tokenExpiration = localStorage.getItem('tokenExpiration');
            const isTokenExpired = tokenExpiration && new Date().getTime() > parseInt(tokenExpiration, 10);

            if (isTokenExpired) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('tokenExpiration');
                setAuthToken(null);
            } else {
                if (localStorage.getItem('acuid')) {
                    navigate('/home'); // Redirect to home if `acuid` exists
                }
            }
        }
    }, [authToken, navigate]);

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, provider);
            const result = await auth.currentUser.getIdTokenResult(true);
            const token = result.token; // Get the auth token
            const claims = result.claims; // Get the `acuid` claim
            const expirationTime = result.expirationTime; // Token expiration time

            setAuthToken(token);
            localStorage.setItem('authToken', token);
            localStorage.setItem('tokenExpiration', new Date(expirationTime).getTime());

            if (claims.acuid) {
                localStorage.setItem('acuid', claims.acuid); // Store `acuid` in localStorage
                navigate('/home'); // Redirect to home if `acuid` exists
            }
            else {
                navigate('/onboarding'); // Redirect to onboarding if `acuid` does not exist
            }

        } catch (error) {
            console.error('Error during Google Sign-In:', error);
        }
    };

    return (
        <div className={style.pagecontainer}>
            <div>
                <button className={style.googlebutton} onClick={handleGoogleSignIn}>Sign in with Google</button>
            </div>
        </div>
    );
};

export default LoginPage;