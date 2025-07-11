const admin = require('./firebase');

async function verifyUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authentication token' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Check if the user has completed onboarding by checking if acuid is assigned
    if (!decodedToken.acuid) {
      return res.status(409).json({ error: 'User onboarding not complete' });
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

module.exports = verifyUser;