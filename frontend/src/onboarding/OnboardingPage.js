import React, { useState } from 'react';
import styles from './Onboarding.module.css';

const OnboardingPage = ({authToken, setCurrentPage}) => {

  const categories = [
    "Fitness",
    "Music",
    "Study habits",
    "Animal interest",
    "Languages"
  ];

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [selections, setSelections] = useState(
    categories.reduce((acc, category) => {
      acc[category] = null;
      return acc;
    }, {})
  );

  const handleSubmit = async () => {
    // Extract only the ratings from the selections object
    const hobbyRatings = Object.values(selections).map(rating => rating === null ? 0 : rating);

    const payload = {
      display_name: displayName,
      bio: bio,
      hobby_rating: hobbyRatings // Send only the ratings array
    };

    try {
      const response = await fetch( 'http://localhost:5000/new/createUserProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Submitted:', data);
        alert('Profile created successfully! Please log in again to access your profile.');
        setCurrentPage('login'); // Redirect to login page
      } else {
        if (response.status === 403) {
          alert('Only campus emails are allowed. Please use your campus email to sign up.');
          setCurrentPage('login'); // Redirect to login page
        }
        else {
          alert('Failed to submit. Please try again.');
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred.');
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Sync your signals</h2>
      <p className={styles.subtext}>
        Let's dial in what makes your Den tick. Adjust the sliders to set your priorities (0–10).
      </p>

      {/* Display Name Input */}
      <div className={styles.inputGroup}>
        <label className={styles.label}>Display Name</label>
        <input
          type="text"
          className={styles.inputField}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter your display name"
        />
      </div>

      {/* Bio Textarea */}
      <div className={styles.inputGroup}>
        <label className={styles.label}>About You</label>
        <textarea
          className={styles.textArea}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us a bit about yourself"
        />
      </div>

      {categories.map(category => (
        <div key={category} className={styles.card}>
          <div className={styles.categoryHeader}>
            <h3
              className={`${styles.categoryTitle} ${selections[category] === null ? styles.disabled : styles.enabled}`}
              onClick={() =>
                setSelections(prev => ({
                  ...prev,
                  [category]: prev[category] === null ? 0 : null
                }))
              }
            >
              {category}
            </h3>
            <p
              className={`${styles.categoryValue} ${selections[category] === null ? styles.disabled : styles.enabled}`}
            >
              Priority: {selections[category] === null ? 'Disabled' : selections[category]}
            </p>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={selections[category] === null ? 0 : selections[category]}
            onChange={(e) =>
              setSelections(prev => ({
                ...prev,
                [category]: parseInt(e.target.value, 10)
              }))
            }
            onMouseDown={() => {
              if (selections[category] === null) {
                setSelections(prev => ({
                  ...prev,
                  [category]: 0
                }));
              }
            }}
            className={styles.slider}
            style={{
              accentColor: selections[category] === null ? 'grey' : '#007bff'
            }}
          />
        </div>
      ))}

      <button onClick={handleSubmit} className={styles.button}>
        Complete
      </button>
    </div>
  );
};

export default OnboardingPage;