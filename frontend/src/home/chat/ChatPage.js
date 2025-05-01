import React, { useEffect, useState } from 'react';
import styles from './ChatPage.module.css';
import ChatWindow from './ChatWindow';

const ChatPage = ({ authToken }) => {
    const [friends, setFriends] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeChat, setActiveChat] = useState(null); // State to track the active chat

    useEffect(() => {
        const fetchFriendsAndGroups = async () => {
            try {
                const response = await fetch('http://localhost:5000/chat/fetchFriendsAndGroups', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setFriends(data.friends);
                    setGroups(data.groups);
                } else {
                    console.error('Failed to fetch friends and groups');
                }
            } catch (error) {
                console.error('Error fetching friends and groups:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriendsAndGroups();
    }, [authToken]);

    const handleUnfriend = async (friendId) => {
        try {
            const response = await fetch('http://localhost:5000/chat/unfriendUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({ friend_id: friendId })
            });
            if (response.ok) {
                setFriends(friends.filter(friend => friend.friend_id !== friendId));
                alert('Successfully unfriended the user');
            } else {
                console.error('Failed to unfriend user');
            }
        } catch (error) {
            console.error('Error unfriending user:', error);
        }
    };

    const handleLeaveGroup = async (groupId) => {
        try {
            const response = await fetch('http://localhost:5000/chat/leaveGroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({ group_id: groupId })
            });
            if (response.ok) {
                setGroups(groups.filter(group => group.group_id !== groupId));
                alert('Successfully left the group');
            } else {
                console.error('Failed to leave group');
            }
        } catch (error) {
            console.error('Error leaving group:', error);
        }
    };

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    // If an active chat is selected, render the ChatWindow
    if (activeChat) {
        return (
            <ChatWindow
                name={activeChat.name}
                onClose={() => setActiveChat(null)} // Close the chat window
            />
        );
    }

    // Render the main chat list (friends and groups)
    return (
        <>
            {/* Top Bar */}
            <div className={styles.topBar}>
                <h1 className={styles.title}>Chats</h1>
            </div>
    
            {/* Friends Section */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Friends</h2>
                <div className={styles.listContainer}>
                    {friends.map((friend, index) => (
                        <div key={index} className={styles.listItem}>
                            <span onClick={() => setActiveChat({ name: friend.profile.display_name })}>
                                {friend.profile.display_name}
                            </span>
                            <button
                                className={styles.actionButton}
                                onClick={() => handleUnfriend(friend.friend_id)}
                            >
                                Unfriend
                            </button>
                        </div>
                    ))}
                </div>
            </div>
    
            {/* Groups Section */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Groups</h2>
                <div className={styles.listContainer}>
                    {groups.map((group, index) => (
                        <div key={index} className={styles.listItem}>
                            <span onClick={() => setActiveChat({ name: group.group_name })}>
                                {group.group_name}
                            </span>
                            <button
                                className={styles.actionButton}
                                onClick={() => handleLeaveGroup(group.group_id)}
                            >
                                Leave Group
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ChatPage;