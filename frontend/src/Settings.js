import React from 'react';
import EditPreference from './EditPreference';

const Settings = ({  }) => {

  const [showEditPreference, setShowEditPreference] = React.useState(false);

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      padding: '20px',
      maxWidth: '95%',
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      {!showEditPreference ? (
        <>
          {/* Header */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <h2 style={{
              fontSize: '20px',
              marginBottom: '5px',
              color: '#333'
            }}>Final touches</h2>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: 0
            }}>Here's how your profile will look.</p>
          </div>

          {/* Profile Card */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px'
            }}>
              {/* Avatar */}
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#8e24aa',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '24px'
              }}>CV</div>
              
              {/* Profile Info */}
              <div>
                <h3 style={{
                  margin: '0 0 5px 0',
                  fontSize: '18px',
                  color: '#333'
                }}>CoolVenom.55</h3>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#666'
                }}>22, she/her</p>
                <p style={{
                  margin: '8px 0 0 0',
                  fontSize: '14px',
                  color: '#333'
                }}>Tech geek by day, adventurer by night. Ready to connect and explore.</p>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{
              fontSize: '14px',
              marginBottom: '8px',
              color: '#333'
            }}>Add a bio that lets your pack know you</h4>
            <div style={{
              background: '#eeeeee',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '14px',
              color: '#333'
            }}>
              Tech geek by day, adventurer by night. Ready to connect and explore.
            </div>
          </div>

          {/* Edit Button */}
          <nav>
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
                cursor: 'pointer'
              }}
              onClick={() => setShowEditPreference(true)}
            >
              Edit Preferences
            </button>
          </nav>
        </>
      ) : (
        <EditPreference onClose={() => setShowEditPreference(false)} />
      )}
    </div>
  );
};

export default Settings;