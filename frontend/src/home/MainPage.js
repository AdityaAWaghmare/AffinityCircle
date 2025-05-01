import React, { useState } from 'react';
import ChatPage from './chat/ChatPage';
import HomePage from './home/HomePage';
import styles from './MainPage.module.css'; // Import the CSS module for styling

const MainPage = ({ authToken, setCurrentPage }) => {
    const [currentSection, setCurrentSection] = useState('home'); // Track the current section

    const handleSectionChange = (section) => {
        setCurrentSection(section);
        window.scrollTo(0, 0); // Reset the scrollbar to the top
    };

    return (
        <div className={styles.wrapper}>
            {currentSection === 'home' && <HomePage authToken={authToken} setCurrentSection={setCurrentSection} />}
            {currentSection === 'chat' && <ChatPage authToken={authToken} setCurrentSection={setCurrentSection} />}

            {/* Bottom Navigation */}
            <div className={styles.navBar}>
                <button
                    className={`${styles.navButton} ${currentSection === 'home' ? styles.active : ''}`}
                    onClick={() => handleSectionChange('home')}
                >
                    Home
                </button>
                <button
                    className={`${styles.navButton} ${currentSection === 'chat' ? styles.active : ''}`}
                    onClick={() => handleSectionChange('chat')}
                >
                    Chats
                </button>
            </div>
        </div>
    );
}

export default MainPage;