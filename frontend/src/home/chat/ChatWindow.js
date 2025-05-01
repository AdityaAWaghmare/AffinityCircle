import React from 'react';
import styles from './ChatWindow.module.css';

const ChatWindow = ({ name, onClose }) => {
    return (
        <div className={styles.chatWindow}>
            {/* Chat Header */}
            <div className={styles.chatHeader}>
                <h2 className={styles.chatTitle}>{name}</h2>
                <button className={styles.closeButton} onClick={onClose}>
                    ✕
                </button>
            </div>

            {/* Chat Body */}
            <div className={styles.chatBody}>
                <div className={styles.messages}>
                    <p className={styles.message}>Welcome to the chat!</p>
                    <p className={`${styles.message} ${styles.sent}`}>This is a sent message.</p>
                    <p className={`${styles.message} ${styles.received}`}>This is a received message.</p>
                </div>
            </div>

            {/* Chat Input */}
            <div className={styles.chatFooter}>
                <input
                    type="text"
                    className={styles.messageInput}
                    placeholder="Type a message..."
                />
                <button className={styles.sendButton}>Send</button>
            </div>
        </div>
    );
};

export default ChatWindow;