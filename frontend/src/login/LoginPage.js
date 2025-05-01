import React from 'react';
import { auth, provider, signInWithPopup } from '../firebase'; // Import from firebase.js
import style from './LoginPage.module.css'; // adjust path as needed
import '../global.css'; // Import global CSS

const LoginPage = ( { setAuthToken, setCurrentPage } ) => {

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, provider);
            const result = await auth.currentUser.getIdTokenResult(true);
            const token = result.token; // Get the auth token
            const claims = result.claims; // Get the `acuid` claim

            setAuthToken(token);

            if (claims.acuid) {
                setCurrentPage('home'); // Render HomePage if `acuid` exists
            } else {
                setCurrentPage('onboarding'); // Render OnboardingPage if `acuid` does not exist
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