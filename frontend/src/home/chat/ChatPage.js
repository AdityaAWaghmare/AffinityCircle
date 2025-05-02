import React, { useEffect, useState } from 'react';
import styles from './ChatPage.module.css';
import FriendChatWindow from './FriendChatWindow';
import GroupChatWindow from './GroupChatWindow';

const ChatPage = ({ authToken, setCurrentPage, userData }) => {
    const [friends, setFriends] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeChat, setActiveChat] = useState(null); // State to track the active chat

    useEffect(() => {
        const fetchFriendsAndGroups = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL + '/api/chat/fetchFriendsAndGroups', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setFriends(data.friends);
                    setGroups(data.groups);
                }
                else if (response.status === 401 || response.status === 409) {
                    alert(data.error);
                    setCurrentPage('login');
                }
                else {
                    alert(data.error);
                }
            } catch (error) {
                console.error('Error fetching friends and groups:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriendsAndGroups();
    }, [authToken, setCurrentPage]);

    const handleUnfriend = async (friendId) => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + '/api/chat/unfriendUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({ friend_id: friendId })
            });
            const data = await response.json();
            if (response.ok) {
                setFriends(friends.filter(friend => friend.friend_id !== friendId));
                alert('Successfully unfriended the user');
            }
            else if (response.status === 401 || response.status === 409) {
                alert(data.error);
                setCurrentPage('login');
            }
            else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error unfriending user:', error);
        }
    };

    const handleLeaveGroup = async (groupId) => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + '/api/chat/leaveGroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({ group_id: groupId })
            });
            const data = await response.json();
            if (response.ok) {
                setGroups(groups.filter(group => group.group_id !== groupId));
                alert('Successfully left the group');
            }
            else if (response.status === 401 || response.status === 409) {
                alert(data.error);
                setCurrentPage('login');
            }
            else {
                alert(data.error);
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
        if (activeChat.friendship) {
            return (
                <FriendChatWindow
                    authToken={authToken}
                    setCurrentPage={setCurrentPage}
                    userData={userData}
                    friendship={activeChat.friendship}
                    onClose={() => setActiveChat(null)} // Close the chat window
                />
            );
        }
        else {
            return (
                <GroupChatWindow
                    authToken={authToken}
                    setCurrentPage={setCurrentPage}
                    userData={userData}
                    group={activeChat.group}
                    onClose={() => setActiveChat(null)} // Close the chat window
                />
            );
        }
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
                            <span onClick={() => setActiveChat({ friendship:friend })}>
                            {friend.profile.display_name} {friend.profile.verified_name && `(${friend.profile.verified_name})`}
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
                            <span onClick={() => setActiveChat({ group:group })}>
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