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

    // Check if the user has completed onboarding by checking if acuid is assigned
    if (decodedToken.customClaims && decodedToken.customClaims.acuid) {
      return res.status(409).json({ error: 'User already onboarded' });
    }

    req.user = decodedToken; // attach user info to request
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
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