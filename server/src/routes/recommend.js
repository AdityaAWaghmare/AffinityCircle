const router = require('express').Router();
const axios = require('axios');
const pool = require('../db/connection_pool');
const verifyUser = require('../auth/user'); // Import the authUser middleware
const recommenderServiceUrl = process.env.RECOMMENDER_URL; // URL of the recommender service

router.use(verifyUser); // Use the authUser middleware for all routes in this router

// fetch friend request // fetch group request // fetct recommendation
router.get('/FetchFriendFecommendations', async (req, res) => {
    const acuid = req.user.customClaims.acuid;
    try {
        const friendsQuery = `
            SELECT receiver_id , similarity_score FROM friendship_request WHERE sender_id = $1 AND recommendation_status = 0
        `;
        const friendsResult = await pool.query(friendsQuery, [acuid]);
        // Todo: if rec len 0, call recommender service to get new recommendations
        res.status(200).json({ recommendations: friendsResult.rows });
    } catch (error) {
        console.error('Error fetching friend recommendations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

router.get('/FetchFriendFequest', async (req, res) => {
    const acuid = req.user.customClaims.acuid;
    try {
        const friendRequestQuery = `
            SELECT sender_id, similarity_score FROM friendship_request WHERE receiver_id = $1 AND recommendation_status = 1 AND status = 0
        `;
        const friendRequestResult = await pool.query(friendRequestQuery, [acuid]);

        res.status(200).json({ recommendations: friendRequestResult.rows });
    } catch (error) {
        console.error('Error fetching friend requests:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

router.get('/FetchGroupRecommendation', async (req, res) => {
    const acuid = req.user.customClaims.acuid;
    try {
        const groupsQuery = `
            SELECT group_id, similarity_score FROM group_recommendation WHERE user_id = $1 AND recommendation_status = 0
        `;
        const groupsResult = await pool.query(groupsQuery, [acuid]);

        // Todo: if rec len 0, call recommender service to get new recommendations

        res.status(200).json({ recommendations: groupsResult.rows });
    } catch (error) {
        console.error('Error fetching group recommendations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);
