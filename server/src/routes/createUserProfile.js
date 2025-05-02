const router = require('express').Router();
const pool = require('../db/connection_pool');
const { verifyNewUser, setCustomClaims } = require('../auth/newUser'); // Import the auth middleware
const axios = require('axios'); // Import axios for making HTTP requests

router.use(verifyNewUser); // Use the authUser middleware for all routes in this router

// Route to create a new user or profile
router.post('/createUserProfile', async (req, res) => {
    const uid = req.user.uid;
    const email = req.user.email;
    const verified_name = req.user.name;
    const { display_name, bio, hobby_rating } = req.body;

    try {
        if (!display_name) {
            return res.status(400).json({ error: 'Display name is required' });
        }

        // Insert the new user into the users table
        const insertUserQuery = `
            INSERT INTO users (email, verified_name, display_name, bio, hobby_rating)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING user_id
        `;
        const insertUserValues = [email, verified_name, display_name, bio, hobby_rating];
        const insertUserResult = await pool.query(insertUserQuery, insertUserValues);

        const userId = insertUserResult.rows[0].user_id;

        // Set custom claims for the user
        const claims = { acuid: userId };
        await setCustomClaims(uid, claims);

        // Create a new group for every tenth user
        if (userId % 10 === 0) {
            const groupName = `Group_${userId}`;
            try {
                // Call the /create_group API in app.py
                const response = await axios.post('http://localhost:5000/create_group', {
                    group_name: groupName,
                });
                console.log(`Group created successfully: ${response.data.message}`);

                // Add the group to the recommendation system
                const recommenderServiceUrl = process.env.RECOMMENDER_URL || 'http://localhost:5000';
                await axios.post(`${recommenderServiceUrl}/recommend_groups`, {
                    user: userId,
                }, {
                    headers: { 'Content-Type': 'application/json' },
                });
                console.log(`Group added to recommendations for user ${userId}`);
            } catch (groupError) {
                console.error('Error creating group or adding to recommendations:', groupError.response?.data || groupError.message);
            }
        }

        // Send a success response
        res.status(201).json({ message: 'User profile created successfully' });
    } catch (error) {
        console.error('Error creating user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;