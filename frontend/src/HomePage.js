import React, { useState } from 'react';
import Chats from './Chats';
import Settings from './Settings';
import EditPreference from './EditPreference';

const HomePage = () => {
  const [currentScreen, setCurrentScreen] = useState('home');

  const recommendedUsers = [
    {
      username: "CoolVenom.55",
      match: "95",
      bio: "Tech geek by day, adventurer by night. "
    },
    {
      username: "GloomyBlue.3",
      match: "95",
      bio: "22, she/her. AI lover and gamer. "
    },
    {
      username: "ShinyGray.77",
      match: "95",
      bio: "Fitness fan and coding enthusiast. Let's"
    }
  ];

  const renderContent = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <>
            <div style={styles.header}>
              <h1 style={styles.greeting}>What's good?</h1>
              <div style={styles.avatar}>ME</div>
            </div>
            <div style={styles.recommendations}>
              <h2 style={styles.sectionTitle}>Recommended for you</h2>
              {recommendedUsers.map((user, index) => (
                <div key={index} style={styles.userCard}>
                  <div style={styles.userHeader}>
                    <h3 style={styles.username}>{user.username}</h3>
                    <span style={styles.matchPercentage}>{user.match}</span>
                  </div>
                  <p style={styles.userBio}>{user.bio}</p>
                </div>
              ))}
            </div>
          </>
        );
      case 'chats':
        return <Chats />;
      case 'settings':
        return <Settings />;
      case 'EditP':
        return <EditPreference />
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {renderContent()}
      <nav style={styles.navBar}>
        <button
          style={{ ...styles.navButton, ...(currentScreen === 'home' ? styles.activeButton : {}) }}
          onClick={() => setCurrentScreen('home')}
        >
          Home
        </button>
        <button
          style={{ ...styles.navButton, ...(currentScreen === 'chats' ? styles.activeButton : {}) }}
          onClick={() => setCurrentScreen('chats')}
        >
          Chats
        </button>
        <button
          style={{ ...styles.navButton, ...(currentScreen === 'settings' ? styles.activeButton : {}) }}
          onClick={() => setCurrentScreen('settings')}
        >
          Settings
        </button>
      </nav>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'system-ui, sans-serif',
    width: '95%',
    margin: '0 auto',
    padding: 30,
    paddingBottom: 120,
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
    position: 'relative',
    paddingBottom: '70px', // Ensure space for the fixed navbar
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 36,
  },
  greeting: {
    fontSize: 40,
    margin: 0,
    color: '#1B1B1B',
    fontWeight: 700,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    background: '#396CFF',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 26,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  diagonalAvatarBox: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 70,
    height: 70,
    background: 'transparent',
    color: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    borderRadius: '12px',
    transform: 'rotate(45deg)',
    boxShadow: 'none',
  },
  diagonalAvatarText: {
    transform: 'rotate(-45deg)',
  },
  recommendations: {
    marginBottom: 50,
  },
  sectionTitle: {
    fontSize: 34,
    marginBottom: 24,
    color: '#1B1B1B',
    fontWeight: 600,
  },
  userCard: {
    width: '90%',
    height: '90px',
    background: '#fff',
    borderRadius: 12,
    padding: '12px 12px',
    marginBottom: 14,
    boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
  },
  userHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  username: {
    margin: 0,
    fontSize: 28,
    color: '#333',
    fontWeight: 600,
  },
  matchPercentage: {
    background: '#396CFF',
    color: 'white',
    padding: '6px 12px',
    borderRadius: 24,
    fontSize: 23,
    fontWeight: 500,
  },
  userBio: {
    margin: 0,
    color: '#555',
    fontSize: 25,
    lineHeight: 1.5,
  },
  navBar: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    height: 50, // Increased height for larger size
    left: 0,
    right: 0,
    background: '#fff',
    borderTop: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '20px 0', // Increased padding for larger size
    maxWidth: 500,
    margin: '0 auto',
    zIndex: 999,
    boxShadow: '0 -3px 12px rgba(0,0,0,0.05)',
  },
  navButton: {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: 28, // Increased font size for better visibility
    color: '#777',
    fontWeight: 600,
  },
  activeButton: {
    color: '#396CFF',
    borderBottom: '3px solid #396CFF',
    paddingBottom: 4,
  }
};

export default HomePage;
