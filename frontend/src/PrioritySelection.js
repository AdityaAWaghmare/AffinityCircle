import React, { useState } from 'react';
// import {Slider} from 'rsuite';

const PrioritySelection = ({ onComplete }) => {
  const categories = [
    "Fitness",
    "Music",
    "Study habits",
    "Animal interest",
    "Languages",
    "Alcohol consumption",
    "Spirituality"
  ];

  const [selections, setSelections] = useState(
    categories.reduce((acc, category) => {
      acc[category] = null;
      return acc;
    }, {})
  );

  const handleSelection = (category, priority) => {
    setSelections(prev => ({
      ...prev,
      [category]: priority
    }));
  };

  const isComplete = () => {
    return true;
  };

  return (
    <div style={{
      padding: '40px',
      maxWidth: '700px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f9f9f9',
      borderRadius: '12px',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{
        fontSize: '32px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '25px',
        color: '#007bff',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
        letterSpacing: '1.5px',
        lineHeight: '1.2'
      }}>
        Sync your signals
      </h2>
      <p style={{
        fontSize: '24px',
        textAlign: 'center',
        marginBottom: '35px',
        color: '#555'
      }}>
        Let's dial in what makes your Den tick. Adjust the sliders to set your priorities (0-10).
      </p>

      {categories.map(category => (
        <div key={category} style={{
          marginBottom: '35px',
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '10px',
          boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <h3
              style={{
                fontSize: '32px',
                color: selections[category] === null ? 'grey' : '#333',
                flex: 1,
                cursor: 'pointer',
                margin: 0
              }}
              onClick={() => {
                setSelections(prev => ({
                  ...prev,
                  [category]: prev[category] === null ? 0 : null
                }));
              }}
            >
              {category}
            </h3>
            <p style={{
              fontSize: '22px',
              color: selections[category] === null ? 'grey' : '#333',
              marginLeft: '10px',
              flexShrink: 0,
              textAlign: 'right',
              margin: 0
            }}>
              Priority: {selections[category] === null ? 'Disabled' : selections[category]}
            </p>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={selections[category] === null ? 0 : selections[category]}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setSelections(prev => ({
                ...prev,
                [category]: value
              }));
            }}
            onMouseDown={() => {
              if (selections[category] === null) {
                setSelections(prev => ({
                  ...prev,
                  [category]: 0
                }));
              }
            }}
            handleStyle={{
               borderRadius: '0',
               color : '#000000',
               width : '32', // Increased width for slider button
                height : '32', // Increased height for slider button
            }}
            style={{
              width: '100%',
              marginTop: '15px',
              accentColor: selections[category] === null ? 'grey' : '#007bff',
                appearance: 'meter',
                height: '8px', // Increased height for slider button
              // opacity: 0.9, // Reduced transparency
              borderRadius: '8px',
              outline: 'none',
              boxShadow: '0 4px 4px rgba(0, 0, 0, 0.2)'
            }}
            
            />
          </div>
          ))}
          <button
          onClick={() => {
            if (isComplete()) {
            onComplete(selections);
            } else {
            alert('Please select at least 3 High and 3 Medium priorities.');
            }
          }}
          style={{
            display: 'block',
            margin: '30px auto 0',
            padding: '15px 30px', // Increased button size
            fontSize: '30px', // Increased font size
            fontWeight: 'bold',
            color: '#fff',
            backgroundColor: '#007bff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)'
          }}
          >
          Complete
          </button>
        </div>
        );
};

export default PrioritySelection;
