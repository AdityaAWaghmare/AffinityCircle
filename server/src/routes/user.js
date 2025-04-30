const router = require('express').Router();
const pool = require('../db/connection_pool');
const verifyUser = require('../auth/user'); // Import the auth middleware
const { getFullProfile } = require('./commonfn');

router.use(verifyUser); // Use the authUser middleware for all routes in this router

// Fetch own profile
router.get('/fetchProfile', async (req, res) => {
    const acuid = req.user.acuid; // Get the acuid from the token

    try {
        const userProfile = await getFullProfile(acuid); // Fetch the user's full profile
        res.status(200).json(userProfile);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

// Save updated profile
router.post('/saveProfile', async (req, res) => {
    const acuid = req.user.acuid;
    const { display_name, bio, hobby_rating } = req.body;

    try {
        const updateUserQuery = `
            UPDATE users
            SET display_name = $1, bio = $2, hobby_rating = $3
            WHERE user_id = $4
        `;
        const updateUserValues = [display_name, bio, hobby_rating, acuid];
        await pool.query(updateUserQuery, updateUserValues);

        // Send a success response
        res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

module.exports = router