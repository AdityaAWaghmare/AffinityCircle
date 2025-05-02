import React, { useEffect, useState } from 'react';
import styles from './HomePage.module.css';
import { signOut, auth } from '../../firebase'; // Import signOut and auth

const HomePage = ({ authToken, setCurrentPage, userData, setUserData }) => {
    const [recommendations, setRecommendations] = useState({
        FriendRecommendations: [],
        FriendRequest: [],
        GroupRecommendation: []
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editableUserData, setEditableUserData] = useState({
        display_name: '',
        bio: '',
        hobby_rating: [0, 0, 0, 0, 0]
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL + '/api/user/fetchProfile', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    setUserData(data);
                } 
                else if (response.status === 401 || response.status === 409) {
                    alert(data.error);
                    setCurrentPage('login');
                }
                else {
                    alert(data.error);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchRecommendations = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL + '/api/rs/fetchRecommendations', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setRecommendations(data);
                }
                else if (response.status === 401 || response.status === 409) {
                    alert(data.error);
                    setCurrentPage('login');
                }
                else {
                    alert(data.error);
                }
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };

        fetchUserData();
        fetchRecommendations();
    }, [authToken, setCurrentPage, setUserData]);

    const handleAcceptFriendRecommendation = async (receiverId) => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + '/api/rs/acceptFriendRecommendation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({ reciever_id: receiverId })
            });
            const data = await response.json();
            if (response.ok) {
                setRecommendations((prev) => ({
                    ...prev,
                    FriendRecommendations: prev.FriendRecommendations.filter(user => user.user_id !== receiverId)
                }));
            }
            else if (response.status === 401 || response.status === 409) {
                alert(data.error);
                setCurrentPage('login');
            }
            else {
                alert(data.error);
            }

        } catch (error) {
            console.error('Error accepting friend recommendation:', error);
        }
    };

    const handleRejectFriendRecommendation = async (receiverId) => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + '/api/rs/rejectFriendRecommendation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({ reciever_id: receiverId })
            });
            const data = await response.json();
            if (response.ok) {
                setRecommendations((prev) => ({
                    ...prev,
                    FriendRecommendations: prev.FriendRecommendations.filter(user => user.user_id !== receiverId)
                }));
            }
            else if (response.status === 401 || response.status === 409) {
                alert(data.error);
                setCurrentPage('login');
            }
            else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error rejecting friend recommendation:', error);
        }
    };

    const handleAcceptFriendRequest = async (senderId) => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + '/api/rs/acceptFriendRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({ sender_id: senderId })
            });
            const data = await response.json();
            if (response.ok) {
                setRecommendations((prev) => ({
                    ...prev,
                    FriendRequest: prev.FriendRequest.filter(request => request.user_id !== senderId)
                }));
            }
            else if (response.status === 401 || response.status === 409) {
                alert(data.error);
                setCurrentPage('login');
            }
            else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleRejectFriendRequest = async (senderId) => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + '/api/rs/rejectFriendRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({ sender_id: senderId })
            });
            const data = await response.json();
            if (response.ok) {
                setRecommendations((prev) => ({
                    ...prev,
                    FriendRequest: prev.FriendRequest.filter(request => request.user_id !== senderId)
                }));
            }
            else if (response.status === 401 || response.status === 409) {
                alert(data.error);
                setCurrentPage('login');
            }
            else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };

    const handleAcceptGroupRecommendation = async (groupId) => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + '/api/rs/acceptGroupRecommendation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({ group_id: groupId })
            });
            const data = await response.json();
            if (response.ok) {
                setRecommendations((prev) => ({
                    ...prev,
                    GroupRecommendation: prev.GroupRecommendation.filter(group => group.group_id !== groupId)
                }));
            }
            else if (response.status === 401 || response.status === 409) {
                alert(data.error);
                setCurrentPage('login');
            }
            else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error accepting group recommendation:', error);
        }
    };

    const handleRejectGroupRecommendation = async (groupId) => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + '/api/rs/rejectGroupRecommendation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({ group_id: groupId })
            });
            const data = await response.json();
            if (response.ok) {
                setRecommendations((prev) => ({
                    ...prev,
                    GroupRecommendation: prev.GroupRecommendation.filter(group => group.group_id !== groupId)
                }));
            }
            else if (response.status === 401 || response.status === 409) {
                alert(data.error);
                setCurrentPage('login');
            }
            else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error rejecting group recommendation:', error);
        }
    };

    const handleSaveDetails = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + '/api/user/saveProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    display_name: editableUserData.display_name,
                    bio: editableUserData.bio,
                    hobby_rating: editableUserData.hobby_rating
                })
            });
            const data = await response.json();
            if (response.ok) {
                setUserData((prev) => ({
                    ...prev,
                    display_name: editableUserData.display_name,
                    bio: editableUserData.bio,
                    hobby_rating: editableUserData.hobby_rating
                }));
                setIsModalOpen(false);
                alert('Profile updated successfully!');
            }
            else if (response.status === 401 || response.status === 409) {
                alert(data.error);
                setCurrentPage('login');
            }
            else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating your profile.');
        }
    };

    const categories = [
        "Fitness",
        "Music",
        "Study habits",
        "Animal interest",
        "Languages"
    ];

    return (
        <>
            {/* Top Bar */}
            <div className={styles.topBar}>
                <h1 className={styles.title}>Home</h1>
                <div
                    className={styles.userIcon}
                    onClick={() => {
                        setEditableUserData({
                            display_name: userData?.display_name || '',
                            bio: userData?.bio || '',
                            hobby_rating: userData?.hobby_rating || [0, 0, 0, 0, 0]
                        });
                        setIsModalOpen(true);
                    }}
                >
                    {userData?.display_name}
                </div>
            </div>

            {/* Modal for Editing User Details */}
            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        {/* Close Icon */}
                        <span
                            className={styles.closeIcon}
                            onClick={() => setIsModalOpen(false)}
                        >
                            &times;
                        </span>

                        <h2>Edit Profile</h2>

                        {/* Non-editable fields */}
                        <div className={styles.inputGroup}>
                            <label>Email</label>
                            <input
                                type="text"
                                value={userData?.email || ''}
                                readOnly
                                className={styles.readOnlyInput}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Verified Name</label>
                            <input
                                type="text"
                                value={userData?.verified_name || ''}
                                readOnly
                                className={styles.readOnlyInput}
                            />
                        </div>

                        {/* Editable fields */}
                        <div className={styles.inputGroup}>
                            <label>Display Name</label>
                            <input
                                type="text"
                                value={editableUserData.display_name}
                                onChange={(e) =>
                                    setEditableUserData((prev) => ({
                                        ...prev,
                                        display_name: e.target.value
                                    }))
                                }
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Bio</label>
                            <textarea
                                value={editableUserData.bio}
                                onChange={(e) =>
                                    setEditableUserData((prev) => ({
                                        ...prev,
                                        bio: e.target.value
                                    }))
                                }
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Hobby Ratings</label>
                            {editableUserData.hobby_rating.map((rating, index) => (
                                <div key={index} className={styles.sliderGroup}>
                                    <label>{categories[index]}</label> {/* Use category names */}
                                    <input
                                        type="range"
                                        min="0"
                                        max="10"
                                        value={rating}
                                        onChange={(e) =>
                                            setEditableUserData((prev) => {
                                                const newRatings = [...prev.hobby_rating];
                                                newRatings[index] = parseInt(e.target.value, 10);
                                                return { ...prev, hobby_rating: newRatings };
                                            })
                                        }
                                    />
                                    <span>{rating}</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.buttonGroup}>
                            <button onClick={handleSaveDetails}>Save</button>
                            <button
                                onClick={() => {
                                    signOut(auth)
                                        .then(() => {
                                            alert('Signed out successfully!');
                                            window.location.reload(); // Optional: Reload the page or redirect
                                        })
                                        .catch((error) => {
                                            console.error('Error signing out:', error);
                                            alert('Failed to sign out. Please try again.');
                                        });
                                }}
                                className={styles.signOutButton}
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Recommendations Section */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Friend Recommendations</h2>
                <div className={styles.cardContainer}>
                    {recommendations.FriendRecommendations.map((user, index) => (
                        <div key={index} className={styles.card}>
                            <h3>{user.display_name}</h3>
                            <p>{user.bio}</p>
                            <p>{user.similarity_score*100}%</p>
                            <div className={styles.buttonContainer}>
                                <button
                                    className={styles.button}
                                    onClick={() => handleAcceptFriendRecommendation(user.user_id)}
                                >
                                    ✔
                                </button>
                                <button
                                    className={styles.button}
                                    onClick={() => handleRejectFriendRecommendation(user.user_id)}
                                >
                                    ✖
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Friend Requests</h2>
                <div className={styles.cardContainer}>
                    {recommendations.FriendRequest.map((request, index) => (
                        <div key={index} className={styles.card}>
                            <h3>{request.display_name}</h3>
                            <p>{request.bio}</p>
                            <p>{request.similarity_score*100}%</p>
                            <div className={styles.buttonContainer}>
                                <button
                                    className={styles.button}
                                    onClick={() => handleAcceptFriendRequest(request.user_id)}
                                >
                                    ✔
                                </button>
                                <button
                                    className={styles.button}
                                    onClick={() => handleRejectFriendRequest(request.user_id)}
                                >
                                    ✖
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Group Recommendations</h2>
                <div className={styles.cardContainer}>
                    {recommendations.GroupRecommendation.map((group, index) => (
                        <div key={index} className={styles.card}>
                            <h3>{group.group_name}</h3>
                            <p>{group.similarity_score*100}%</p>
                            <div className={styles.buttonContainer}>
                                <button
                                    className={styles.button}
                                    onClick={() => handleAcceptGroupRecommendation(group.group_id)}
                                >
                                    ✔
                                </button>
                                <button
                                    className={styles.button}
                                    onClick={() => handleRejectGroupRecommendation(group.group_id)}
                                >
                                    ✖
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default HomePage;