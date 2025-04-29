const router = require('express').Router();
const pool = require('../db/connection_pool');
const { verifyNewUser, setCustomClaims } = require('../auth/newUser'); // Import the auth middleware

router.use(verifyNewUser); // Use the authUser middleware for all routes in this router

// Route to create a new user or profile
router.post('/createUserProfile', async (req, res) => {
    const uid = req.user.uid;
    const email = req.user.email;
    const verified_name = req.user.name;
    const {display_name, bio, hobby_rating} = req.body;

    try {
        // Insert the new user into the users table
        const insertUserQuery = `
            INSERT INTO users (email, verified_name, display_name, bio, hobby_rating)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING user_id
        `;
        const insertUserValues = [email, verified_name, display_name, bio, hobby_rating];
        const insertUserResult = await pool.query(insertUserQuery, insertUserValues);

        // Set custom claims for the user
        const claims = { acuid: insertUserResult.rows[0].user_id };
        await setCustomClaims(uid, claims);

        // Send a success response
        res.status(201).json({ message: 'User profile created successfully' });
    } catch (error) {
        console.error('Error creating user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

module.exports = router;