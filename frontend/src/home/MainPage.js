import React, { useState } from 'react';
import ChatPage from './chat/ChatPage';
import HomePage from './home/HomePage';
import styles from './MainPage.module.css'; // Import the CSS module for styling

const MainPage = ({ authToken, setCurrentPage }) => {
    const [currentSection, setCurrentSection] = useState('home'); // Track the current section
    const [userData, setUserData] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0); // Use a key to force re-render

    const refreshSection = () => {
        setRefreshKey((prevKey) => prevKey + 1); // Increment the key to force re-render
    };

    const handleSectionChange = (section) => {
        setCurrentSection(section);
        window.scrollTo(0, 0); // Reset the scrollbar to the top
    };

    return (
        <div className={styles.wrapper}>
            {currentSection === 'home' && (
                <HomePage
                    key={`home-${refreshKey}`} // Add a unique key to force re-render
                    authToken={authToken}
                    setCurrentPage={setCurrentPage}
                    userData={userData}
                    setUserData={setUserData}
                />
            )}
            {currentSection === 'chat' && (
                <ChatPage
                    key={`chat-${refreshKey}`} // Add a unique key to force re-render
                    authToken={authToken}
                    setCurrentPage={setCurrentPage}
                    userData={userData}
                    refreshSection={refreshSection} // Pass the refresh
                />
            )}

            {/* Bottom Navigation */}
            <div className={styles.navBar}>
                <button
                    className={`${styles.navButton} ${currentSection === 'home' ? styles.active : ''}`}
                    onClick={() => {
                        handleSectionChange('home');
                        refreshSection();
                    }}
                >
                    Home
                </button>
                <button
                    className={`${styles.navButton} ${currentSection === 'chat' ? styles.active : ''}`}
                    onClick={() => {
                        handleSectionChange('chat');
                        refreshSection();
                    }}
                >
                    Chats
                </button>
            </div>
        </div>
    );
};

export default MainPage;