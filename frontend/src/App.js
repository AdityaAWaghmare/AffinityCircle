import React, { useState } from 'react';
import Onboarding from './Onboarding';
import PrioritySelection from './PrioritySelection';
import HomePage from './HomePage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [userPreferences, setUserPreferences] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home', 'settings', 'edit'

  const handleLogin = (firstTime) => {
    setIsLoggedIn(true);
    setIsFirstTimeUser(firstTime);
  };

  const handlePreferencesComplete = (preferences) => {
    setUserPreferences(preferences);
    setIsFirstTimeUser(false);
  };

  return (
    <div>
      {!isLoggedIn ? (
        <Onboarding onLogin={handleLogin} />
      ) : isFirstTimeUser ? (
        <PrioritySelection onComplete={handlePreferencesComplete} />
      ) : (
        <HomePage
          userPreferences={userPreferences}
        />
      )}
    </div>
  );
};

export default App;