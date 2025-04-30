import React from 'react';
import LoginPage from './login/LoginPage';
import IntroPage from './onboarding/IntroPage';
import HomePage from './home/HomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<IntroPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="*" element={<HomePage />} /> {/* Redirect to LoginPage for any other route */}
      </Routes>
    </Router>
  );
};

export default App;