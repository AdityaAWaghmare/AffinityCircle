import React from 'react';

const EditPreference = ({ onBackClick }) => {
  const [bio, setBio] = React.useState("Tech geek by day, adventurer by night. Ready to connect and explore.");

  const handleSave = () => {
    // Here you would typically save the bio to your state or backend
    alert("Preferences saved!");
    onBackClick();
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      padding: '20px',
      maxWidth: '500px',
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      <h2 style={{
        fontSize: '20px',
        marginBottom: '5px',
        color: '#333',
        textAlign: 'center'
      }}>Edit Preferences</h2>
      <p style={{
        fontSize: '14px',
        color: '#666',
        marginBottom: '20px',
        textAlign: 'center'
      }}>You can edit your profile settings here.</p>

      {/* Bio Editor */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{
          fontSize: '14px',
          marginBottom: '8px',
          color: '#333'
        }}>Edit your bio</h4>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '14px',
            marginBottom: '12px'
          }}
        />
      </div>

      {/* Save Button */}
      <button 
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#8e24aa',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          marginBottom: '12px'
        }}
        onClick={handleSave}
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditPreference;