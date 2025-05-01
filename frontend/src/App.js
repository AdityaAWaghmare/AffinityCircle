import React, {useState}  from 'react';
import LoginPage from './login/LoginPage';
import IntroPage from './onboarding/IntroPage';
import MainPage from './home/MainPage';

const App = () => {
  const [authToken, setAuthToken] = useState(null);
  const [currentPage, setCurrentPage] = useState('login'); // Track the current page

  if (currentPage === 'login') {
    return ( <LoginPage setAuthToken={setAuthToken} setCurrentPage={setCurrentPage} /> ); // Pass the setAuthToken and setCurrentPage functions to LoginPage
  }
  else if (currentPage === 'onboarding') {
    return ( <IntroPage authToken={authToken} setCurrentPage={setCurrentPage} /> ); // Pass the auth token and setCurrentPage to IntroPage
  }
  else if (currentPage === 'home') {
    return ( <MainPage authToken={authToken} setCurrentPage={setCurrentPage} /> ); // Pass the auth token and setCurrentPage to HomePage
  }
};

export default App;