import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import styles from './ChatWindow.module.css';

const FriendChatWindow = ({ authToken, setCurrentPage, userData, friendship, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [weekOffset, setWeekOffset] = useState(0);
    const [newMessage, setNewMessage] = useState('');
    const socket = useRef(null);
    const chatBodyRef = useRef(null);

    useEffect(() => {
        socket.current = io(process.env.REACT_APP_API_URL + "/", {
            auth: { token: authToken },
        });

        socket.current.emit('join_friend_chat', { conversation_id: friendship.friendship_id });

        socket.current.on('receive_friend_message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            window.scrollTo(0, document.body.scrollHeight); // Reset the scrollbar to the bottom
        });

        return () => {
            socket.current.disconnect();
        };
    }, [authToken, friendship]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const now = new Date();
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + weekOffset * 7));
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            const response = await fetch(process.env.REACT_APP_API_URL + '/api/chat/friend/fetchMessages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    conversation_id: friendship.friendship_id,
                    from_time: startOfWeek.toISOString(),
                    to_time: endOfWeek.toISOString(),
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessages((prevMessages) => [...data, ...prevMessages]);
            } else {
                alert(data.error);
                if (response.status === 401 || response.status === 409) setCurrentPage('login');
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [weekOffset]);

    const loadPreviousWeek = () => {
        setWeekOffset((prevOffset) => prevOffset - 1);
    };

    const sendMessage = () => {
        if (newMessage.trim() === '') return;

        const messageData = {
            conversation_id: friendship.friendship_id,
            content: newMessage,
        };

        socket.current.emit('send_friend_message', messageData);
        setNewMessage('');
    };

    useEffect(() => {
        // Scroll to the bottom whenever messages change
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTo({
                top: chatBodyRef.current.scrollHeight,
                behavior: 'smooth', // Smooth scrolling for better UX
            });
        }
    }, [messages]);

    return (
        <div className={styles.chatWindow}>
            <div className={styles.chatHeader}>
                <h2 className={styles.chatTitle}>{friendship.display_name}</h2>
                <button className={styles.closeButton} onClick={onClose}>
                    ✕
                </button>
            </div>
            <div className={styles.loadMore}>
                <button onClick={loadPreviousWeek} disabled={loading}>
                    Load Previous Week
                </button>
            </div>
            <div className={styles.chatBody} ref={chatBodyRef}>
                <div className={styles.messages}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`${styles.messageContainer} ${
                                message.sender_id === userData.user_id ? styles.sent : styles.received
                            }`}
                        >
                            <div className={styles.messageBubble}>
                                <div className={styles.messageHeader}>
                                    <span className={styles.messageSender}>
                                        {message.sender_id === userData.user_id
                                            ? 'You'
                                            : friendship.display_name}
                                    </span>
                                </div>
                                <p className={styles.messageContent}>{message.content}</p>
                                <div className={styles.messageFooter}>
                                    <span className={styles.messageTimestamp}>
                                        {new Date(message.sent_at).toLocaleString([], {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {loading && <p>Loading...</p>}
            </div>
            <div className={styles.chatFooter}>
                <input
                    type="text"
                    className={styles.messageInput}
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button className={styles.sendButton} onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default FriendChatWindow;