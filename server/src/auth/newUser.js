const admin = require('./firebase');

async function verifyNewUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Check if the email ends with @iith.ac.in
    if (!decodedToken.email || !decodedToken.email.endsWith('@iith.ac.in')) {
      return res.status(403).json({ error: 'Access restricted to @iith.ac.in emails only' });
    }

    if (!decodedToken.name){
      return res.status(403).json({ error: 'Google Account Name is required as Verified Name.' });
    }

    // Check if the user has completed onboarding by checking if acuid is assigned
    if (decodedToken.acuid) {
      return res.status(409).json({ error: 'Email already Registered/Onboared.' });
    }

    req.user = decodedToken; // attach user info to request
    next();
  } catch (error) {
    console.error('Token verification failed:', error);

    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Token expired. Please re-authenticate.' });
    }
    
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

// Set custom claims for a user
async function setCustomClaims(uid, claims) {
  try {
    await admin.auth().setCustomUserClaims(uid, claims);
    console.log(`Custom claims set for user ${uid}:`, claims);
  } catch (error) {
    console.error('Error setting custom claims:', error);
  }
}

module.exports = {
  verifyNewUser,
  setCustomClaims
};