import React, { useState, useEffect } from 'react';
import { getValidToken } from '../login/handleToken';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
  const navigate = useNavigate();

  // Check if the token is valid
  const { authToken, acuid } = getValidToken();
  if (!authToken) {
    alert('Please login before proceeding.');
    navigate('/login');
  }

  if (!acuid) {
    alert('Please finish onboarding first.');
    navigate('/login');
  }

  const [friendRecommendations, setFriendRecommendations] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [groupRecommendations, setGroupRecommendations] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/recommendPage/FetchRecommendations', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('here is the data', data);
        const { FriendRecommendations, FriendRequest, GroupRecommendation } = data;

        setFriendRecommendations(FriendRecommendations);
        setFriendRequests(FriendRequest);
        setGroupRecommendations(GroupRecommendation);
        // setUsername(Username);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        alert('Cannot reach the server. Please try again later.');
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.greeting}>Welcome, {username}!</h1>
      </div>
      <div className={styles.recommendations}>
        <h2 className={styles.sectionTitle}>Friend Recommendations</h2>
        {friendRecommendations.map((user, index) => (
          <div key={index} className={styles.userCard}>
            <h3 className={styles.username}>{user.username}</h3>
            <p className={styles.userBio}>{user.bio}</p>
          </div>
        ))}
      </div>
      <div className={styles.recommendations}>
        <h2 className={styles.sectionTitle}>Friend Requests</h2>
        {friendRequests.map((request, index) => (
          <div key={index} className={styles.userCard}>
            <h3 className={styles.username}>{request.username}</h3>
            <p className={styles.userBio}>{request.bio}</p>
          </div>
        ))}
      </div>
      <div className={styles.recommendations}>
        <h2 className={styles.sectionTitle}>Group Recommendations</h2>
        {groupRecommendations.map((group, index) => (
          <div key={index} className={styles.userCard}>
            <h3 className={styles.username}>{group.groupName}</h3>
            <p className={styles.userBio}>{group.description}</p>
          </div>
        ))}
      </div>
      <nav className={styles.navBar}>
        <button
          className={`${styles.navButton}`}
          onClick={() => {
            navigate('/');
          }}
        >
          Home
        </button>
        <button
          className={`${styles.navButton}`}
          onClick={() => {
            navigate('/chats');
          }}
        >
          Chats
        </button>
      </nav>
    </div>
  );
};

export default HomePage;