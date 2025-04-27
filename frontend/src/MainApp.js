import React from 'react';

const MainApp = ({ userPreferences }) => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome Back!</h1>
      <p>This would be your main application content.</p>
      {userPreferences && (
        <div>
          <h3>Your Preferences:</h3>
          <pre>{JSON.stringify(userPreferences, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default MainApp;