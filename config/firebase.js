import { getAuth, onAuthStateChanged } from "firebase/auth";

export const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    const displayName = user.displayName;
    console.log("User's display name:", displayName);
  } else {
    // User is signed out
    // ...
  }
});
