const router = require('express').Router();
import verifyFirebaseToken from '../auth/auth.js';

router.post('/incoming', (req, res, next) => {
// sending user email and password to the auth service
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }
    // firebase auth
    return verifyFirebaseToken(req, res, next);

});

module.exports = router;