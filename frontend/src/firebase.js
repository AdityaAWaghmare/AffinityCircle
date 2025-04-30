// MyFirebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCycQfXiPtYqT79h7F4BAZPSdi2FOQ5vGI",
    authDomain: "affinity-circle.firebaseapp.com",
    projectId: "affinity-circle",
    storageBucket: "affinity-circle.firebasestorage.app",
    messagingSenderId: "294621730161",
    appId: "1:294621730161:web:185010337394f2fc3892d0",
    measurementId: "G-49XQDJ7FBT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, auth, provider, signInWithPopup, signOut };