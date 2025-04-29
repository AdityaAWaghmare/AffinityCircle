const router = require('express').Router();
const pool = require('../db/connection_pool');
const verifyUser = require('../auth/user'); // Import the auth middleware

router.use(verifyUser); // Use the authUser middleware for all routes in this router

// Fetch own profile
router.get('/fetchProfile', async (req, res) => {
    const acuid = req.user.customClaims.acuid; // Get the acuid from the token

    try {
        // Fetch the user's own profile
        const fetchProfileQuery = `
            SELECT * FROM users WHERE user_id = $1
        `;
        const fetchProfileValues = [acuid];
        const fetchProfileResult = await pool.query(fetchProfileQuery, fetchProfileValues);

        res.status(200).json(fetchProfileResult.rows[0]);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);