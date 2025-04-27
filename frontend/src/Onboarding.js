import React, { useState } from 'react';
import screen1 from './images/screen1.png';
import screen2 from './images/screen2.png';
import screen3 from './images/screen3.png';

const screens = [
  {
    image: screen1,
    title: "Your squad, Your way",
    text: "Find friendships that resonate with your vibe and interests.",
    buttonText: "→",
  },
  {
    image: screen2,
    title: "Express Yourself",
    text: "Make your profile pop with funky avatars, a pop of color and a snazzy bio.",
    buttonText: "→"
  },
  {
    image: screen3,
    title: "Start Epic Conversations",
    text: "Mingle, connect, and grow your circle - it's all about the social adventure!",
    buttonText: "Get started →"
  }
];

const Onboarding = ({ onLogin }) => {
  // Onboarding flow state
  const [index, setIndex] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  
  // Form states
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // Manual toggle for testing (remove in production)
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);

  const next = () => {
    if (index < screens.length - 1) {
      setIndex(index + 1);
    } else {
      setShowLogin(true);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate successful login
    alert(`Logged in as: ${loginData.email}`);
    onLogin(isFirstTimeUser); // Pass whether user is first-time
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    // Simulate successful signup
    alert(`Account created for: ${signupData.name}`);
    onLogin(true); // New users are always first-time
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'login') {
      setLoginData(prev => ({ ...prev, [name]: value }));
    } else {
      setSignupData(prev => ({ ...prev, [name]: value }));
    }
  };

  const backgroundColors = ['#302010', '#352515', '#403020'];
  const textColors = ['#C69000', '#C69000', '#C69000'];

  
  // Onboarding Screens
  if (!showLogin && !showSignup) {
    return (
      <div style={{
        height: '100vh',
        padding: '20vw',
        display: 'flex',
        fontSize: '20px',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'center',
        color: textColors[index],
        backgroundColor: backgroundColors[index],
        //bold text
        fontFamily: 'bold'
      }}>
        <div>
          <img src={screens[index].image} alt="Onboarding" style={{ width: '250px', marginTop: '50px' }} />
        </div>

        <div>
          <h2 style={{ fontFamily: 'cursive' }}>{screens[index].title}</h2>
          <p>{screens[index].text}</p>
        </div>

        <button 
          onClick={next}
          style={{
            backgroundColor: '#D69000',
            color: '#333300',
            borderRadius: '20px',
            padding: '24px 24px',
            fontSize: '16px',
            border: 'none',
            marginBottom: '30px'
          }}
        >
          {screens[index].buttonText}
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '20px' }}>
          {screens.map((_, i) => (
            <span key={i} style={{
              height: '8px',
              width: '8px',
              borderRadius: '50%',
              backgroundColor: i === index ? '#396CFF' : '#D0D0D0',
              display: 'inline-block'
            }}></span>
          ))}
        </div>
      </div>
    );
  }

  // Signup Page
  if (showSignup) {
    return (
      <div style={{
        height: '100vh',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <h2 style={{ fontFamily: 'cursive', marginBottom: '30px' }}>Create Account</h2>
        
        <form onSubmit={handleSignup} style={{ width: '100%', maxWidth: '300px' }}>
          <div style={{ marginBottom: '15px', width: '100%' }}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={signupData.name}
              onChange={(e) => handleInputChange(e, 'signup')}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #D0D0D0',
                fontSize: '16px'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '15px', width: '100%' }}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signupData.email}
              onChange={(e) => handleInputChange(e, 'signup')}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #D0D0D0',
                fontSize: '16px'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '15px', width: '100%' }}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signupData.password}
              onChange={(e) => handleInputChange(e, 'signup')}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #D0D0D0',
                fontSize: '16px'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '20px', width: '100%' }}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={signupData.confirmPassword}
              onChange={(e) => handleInputChange(e, 'signup')}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #D0D0D0',
                fontSize: '16px'
              }}
              required
            />
          </div>
          
          <button 
            type="submit"
            style={{
              backgroundColor: '#1B1B1B',
              color: 'white',
              borderRadius: '50px',
              padding: '12px 24px',
              fontSize: '16px',
              border: 'none',
              width: '100%',
              cursor: 'pointer',
              marginBottom: '15px'
            }}
          >
            Sign Up
          </button>
        </form>
        
        <p style={{ color: '#777' }}>
          Already have an account? 
          <button 
            onClick={() => {
              setShowSignup(false);
              setShowLogin(true);
            }}
            style={{
              color: '#396CFF',
              background: 'none',
              border: 'none',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: '0 5px'
            }}
          >
            Login
          </button>
        </p>
      </div>
    );
  }

  // Login Page
  return (
    <div style={{
      height: '100vh',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      backgroundColor: '#504030',
      color: '#E69000'
    }}>
      <h2 style={{ fontFamily: 'cursive', marginBottom: '30px' }}>Welcome Back!</h2>
      
      {/* Manual toggle for testing - remove in production */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '10px' }}>Simulate:</span>
        <button
          onClick={() => setIsFirstTimeUser(true)}
          style={{
            padding: '8px 16px',
            background: isFirstTimeUser ? '#396CFF' : '#eee',
            color: isFirstTimeUser ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            marginRight: '8px',
            cursor: 'pointer'
          }}
        >
          First-time User
        </button>
        <button
          onClick={() => setIsFirstTimeUser(false)}
          style={{
            padding: '8px 16px',
            background: !isFirstTimeUser ? '#396CFF' : '#eee',
            color: !isFirstTimeUser ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Returning User
        </button>
      </div>
      
      <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '300px' }}>
        <div style={{ marginBottom: '20px', width: '100%' }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) => handleInputChange(e, 'login')}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #D0D0D0',
              fontSize: '16px'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '30px', width: '100%' }}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) => handleInputChange(e, 'login')}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #D0D0D0',
              fontSize: '16px'
            }}
            required
          />
        </div>
        
        <button 
          type="submit"
          style={{
            backgroundColor: '#808080',
            color: 'black',
            borderRadius: '50px',
            padding: '12px 24px',
            fontSize: '16px',
            border: 'none',
            width: '100%',
            cursor: 'pointer',
            marginBottom: '15px'
          }}
        >
          Login
        </button>
      </form>
      

    </div>
  );
};

export default Onboarding;