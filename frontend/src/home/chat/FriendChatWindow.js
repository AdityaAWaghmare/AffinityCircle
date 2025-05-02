import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import styles from './ChatWindow.module.css';

const FriendChatWindow = ({ authToken, setCurrentPage, userData, friendship, handleUnfriend }) => {
    const [friendProfile, setFriendProfile] = useState(friendship.profile);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [weekOffset, setWeekOffset] = useState(0);
    const [newMessage, setNewMessage] = useState('');
    const [userIdentityRevealStatus, setUserIdentityRevealStatus] = useState(friendship.user_identity_reveal_status);
    const [friendIdentityRevealStatus, setFriendIdentityRevealStatus] = useState(friendship.friend_identity_reveal_status);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const socket = useRef(null);
    const chatBodyRef = useRef(null);

    useEffect(() => {
        socket.current = io(process.env.REACT_APP_API_URL + "/", {
            auth: { token: authToken },
        });

        socket.current.emit('join_friend_chat', { conversation_id: friendship.friendship_id });

        socket.current.on('receive_friend_message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socket.current.on('identity_reveal_requested', ({ requester_id }) => {
            if (requester_id !== userData.user_id) {
                alert(`${friendProfile.display_name} has requested to reveal your identity.`);
                setUserIdentityRevealStatus(2); // Update to pending
            }
        });

        socket.current.on('identity_reveal_response', ({ responder_id, accepted, user_data }) => {
            if (responder_id !== userData.user_id) {
                if (accepted) {
                    alert(`${friendProfile.display_name} has revealed their identity.`);
                    setFriendProfile(user_data)
                    setFriendIdentityRevealStatus(1); // Update to revealed
                } else {
                    alert(`${friendProfile.display_name} has declined your identity reveal request.`);
                    setFriendIdentityRevealStatus(0); // Update to not revealed
                }
            }
        });

        return () => {
            socket.current.disconnect();
        };
    }, [authToken, friendship, userData]);

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

    const requestIdentityReveal = () => {
        socket.current.emit('request_identity_reveal', { conversation_id: friendship.friendship_id });
        setFriendIdentityRevealStatus(2); // Update to pending
        alert('Identity reveal request sent.');
    };

    const respondIdentityReveal = (accept) => {
        socket.current.emit('reveal_identity', {
            conversation_id: friendship.friendship_id,
            accept,
        });
        if (accept) {
            setUserIdentityRevealStatus(1); // Update to revealed
        }
        else {
            setUserIdentityRevealStatus(0); // Update to not revealed
        }
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
            <div className={`${styles.chatHeader} ${dropdownVisible ? styles.expandedHeader : ''}`}>
                <div className={styles.chatHeaderContent}>
                    {/* Left Section: User Details */}
                    <div className={styles.userDetails}>
                        <span className={styles.displayName}>{friendProfile.display_name}</span>
                    </div>

                    {/* Right Section: Dropdown Button */}
                    <button className={styles.dropdownButton} onClick={() => setDropdownVisible(!dropdownVisible)}>
                        {dropdownVisible ? '▲' : '▼'}
                    </button>
                </div>

                {/* Dropdown Content */}
                {dropdownVisible && (
                    <div className={styles.dropdownContent}>
                        {/* Details Container */}
                        <div className={styles.detailsContainer}>
                            <div className={styles.userDetailRow}>
                                <span className={styles.detailTitle}>Bio:</span>
                                <span className={styles.detailValue}>{friendProfile.bio}</span>
                            </div>
                            {friendIdentityRevealStatus === 1 && (
                                <>
                                    <div className={styles.userDetailRow}>
                                        <span className={styles.detailTitle}>Verified Name:</span>
                                        <span className={styles.detailValue}>{friendProfile.verified_name}</span>
                                    </div>
                                    <div className={styles.userDetailRow}>
                                        <span className={styles.detailTitle}>Email:</span>
                                        <span className={styles.detailValue}>{friendProfile.email}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Reveal Buttons Container */}
                        <div className={styles.revealButtonsContainer}>
                            {friendIdentityRevealStatus === 0 && (
                                <button className={styles.actionButton} onClick={requestIdentityReveal}>
                                    Request Identity
                                </button>
                            )}
                            {userIdentityRevealStatus === 0 && (
                                <button className={styles.actionButton} onClick={() => respondIdentityReveal(true)}>
                                    Reveal Identity
                                </button>
                            )}
                            <button className={styles.disactionButton} onClick={() => handleUnfriend(friendship.friendship_id)}>
                                Unfriend
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className={styles.chatBody} ref={chatBodyRef}>
                <div className={styles.loadMore}>
                    <button onClick={loadPreviousWeek} disabled={loading}>
                        Load Previous Week
                    </button>
                </div>
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
            <div className={styles.identityReveal}>
              {userIdentityRevealStatus === 2 && (
                    <div>
                        <button onClick={() => respondIdentityReveal(true)}>Accept Reveal</button>
                        <button onClick={() => respondIdentityReveal(false)}>Decline Reveal</button>
                    </div>
                )}
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