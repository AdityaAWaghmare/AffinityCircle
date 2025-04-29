const router = require('express').Router();
const axios = require('axios');
const pool = require('../db/connection_pool');
const verifyUser = require('../auth/user'); // Import the authUser middleware
const recommenderServiceUrl = process.env.RECOMMENDER_URL; // URL of the recommender service

router.use(verifyUser); // Use the authUser middleware for all routes in this router

// get all three types of recommendations
router.get('/FetchRecommendations', async (req, res) => {
    const acuid = req.user.customClaims.acuid;
    try {
        const friendsQuery = `
            SELECT receiver_id , similarity_score FROM friendship_request WHERE sender_id = $1 AND recommendation_status = 0
        `;
        const friendsResult = await pool.query(friendsQuery, [acuid]);
        // if no recommendations, call the recommender service
        if (friendsResult.rows.length === 0) {
            await axios.get(`${recommenderServiceUrl}/recommend_users`, {
                headers: {'Content-Type': 'application/json',},
                data: {
                    user: acuid,
                },
            });
            friendsResult = await pool.query(friendsQuery, [acuid]);
        }

        const friendRequestQuery = `
            SELECT sender_id, similarity_score FROM friendship_request WHERE receiver_id = $1 AND recommendation_status = 1 AND status = 0
        `;
        const friendRequestResult = await pool.query(friendRequestQuery, [acuid]);

        const groupsQuery = `
            SELECT group_id, similarity_score FROM group_recommendation WHERE user_id = $1 AND recommendation_status = 0
        `;
        const groupsResult = await pool.query(groupsQuery, [acuid]);
        // if no recommendations, call the recommender service
        if (groupsResult.rows.length === 0) {
            await axios.get(`${recommenderServiceUrl}/recommend_groups`, {
                headers: {'Content-Type': 'application/json',},
                data: {
                    user: acuid,
                },
            });
            groupsResult = await pool.query(groupsQuery, [acuid]);
        }

        res.status(200).json({ FriendRecommendations: friendsResult.rows, FriendRequest: friendRequestResult.rows, GroupRecommendation: groupsResult.rows });
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

// fetch friend request // fetch group request // fetct recommendation
router.get('/FetchFriendFecommendations', async (req, res) => {
    const acuid = req.user.customClaims.acuid;
    try {
        const friendsQuery = `
            SELECT receiver_id , similarity_score FROM friendship_request WHERE sender_id = $1 AND recommendation_status = 0
        `;
        const friendsResult = await pool.query(friendsQuery, [acuid]);
        // if no recommendations, call the recommender service
        if (friendsResult.rows.length === 0) {
            await axios.get(`${recommenderServiceUrl}/recommend_users`, {
                headers: {'Content-Type': 'application/json',},
                data: {
                    user: acuid,
                },
            });
            friendsResult = await pool.query(friendsQuery, [acuid]);
        }

        res.status(200).json({ FriendRecommendations: friendsResult.rows });
    } catch (error) {
        console.error('Error fetching friend recommendations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

router.get('/FetchFriendRequest', async (req, res) => {
    const acuid = req.user.customClaims.acuid;
    try {
        const friendRequestQuery = `
            SELECT sender_id, similarity_score FROM friendship_request WHERE receiver_id = $1 AND recommendation_status = 1 AND status = 0
        `;
        const friendRequestResult = await pool.query(friendRequestQuery, [acuid]);
        res.status(200).json({ FriendRequest: friendRequestResult.rows });
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
            SELECT group_id, similarity_score FROM group_recommendation WHERE user_id = $1 AND status = 0
        `;
        const groupsResult = await pool.query(groupsQuery, [acuid]);
        // if no recommendations, call the recommender service
        if (groupsResult.rows.length === 0) {
            await axios.get(`${recommenderServiceUrl}/recommend_groups`, {
                headers: {'Content-Type': 'application/json',},
                data: {
                    user: acuid,
                },
            });
            groupsResult = await pool.query(groupsQuery, [acuid]);
        }

        res.status(200).json({ GroupRecommendation: groupsResult.rows });
    } catch (error) {
        console.error('Error fetching group recommendations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

router.post('/AcceptFriendRecommendation', async (req, res) => {
    const acuid = req.user.customClaims.acuid;
    const { reciever_id } = req.body; // reciever_id is the user who gets the friend request
    if (!reciever_id) return res.status(400).json({ error: 'reciever_id is required' });
    try {
        const updateQuery = `
            UPDATE friendship_request
            SET recommendation_status = 1
            WHERE sender_id = $1 AND receiver_id = $2
        `;
        await pool.query(updateQuery, [acuid, reciever_id]);

        res.status(200).json({ message: 'Friend request sent' });
    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

router.post('/AcceptFriendRequest', async (req, res) => {
    const acuid = req.user.customClaims.acuid;
    const { sender_id } = req.body; // sender_id is the user who sent the friend request
    if (!sender_id) return res.status(400).json({ error: 'sender_id is required' });
    try {
        const updateQuery = `
            UPDATE friendship_request
            SET status = 1
            WHERE sender_id = $1 AND receiver_id = $2
        `;
        await pool.query(updateQuery, [sender_id, acuid]);

        const insertQuery = `
            INSERT INTO friendship (user1_id, user2_id , user1_blocking_status, user2_blocking_status, user1_identity_reveal_status, user2_identity_reveal_status)
            VALUES ($1, $2, 0, 0, 0, 0)
        `;
        // user1_id is the sender_id and user2_id is the reciever_id // not discriminative
        // user1_blocking_status = 0 means not blocked // user2_blocking_status = 0 means not blocked
        // user1_identity_reveal_status = 0 means not identity revealed // user2_identity_reveal_status = 0 means not identity revealed
        await pool.query(insertQuery, [sender_id, acuid]);

        res.status(200).json({ message: 'Friend request accepted' });
    } catch (error) {
        console.error('Error accepting friend request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

router.post('/AcceptGroupRecommendation', async (req, res) => {
    const acuid = req.user.customClaims.acuid;
    const { group_id } = req.body;
    if (!group_id) return res.status(400).json({ error: 'group_id is required' });
    try {
        const updateQuery = `
            UPDATE group_recommendation
            SET status = 1
            WHERE user_id = $1 AND group_id = $2
        `;
        await pool.query(updateQuery, [acuid, group_id]);        
        
        const insertQuery = `
            INSERT INTO group_membership (group_id, user_id , status)
            VALUES ($1, $2, 0)
        `;
        // status = 0 means not blocked // status = 1 means blocked
        await pool.query(insertQuery, [group_id, acuid]);

        res.status(200).json({ message: 'Group request accepted' });
    } catch (error) {
        console.error('Error accepting group request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

router.post('/RejectFriendRecommendation', async (req, res) => {
    const acuid = req.user.customClaims.acuid;
    const { reciever_id } = req.body; // sender_id is the user who sent the friend request
    if (!reciever_id) return res.status(400).json({ error: 'reciever_id is required' });
    try {
        const updateQuery = `
            UPDATE friendship_request
            SET recommendation_status = 2
            WHERE sender_id = $1 AND receiver_id = $2
        `;
        await pool.query(updateQuery, [acuid, reciever_id]);

        res.status(200).json({ message: 'Friend Recommendation rejected' });
    } catch (error) {
        console.error('Error rejecting friend Recommendation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}   
);

router.post('/RejectFriendRequest', async (req, res) => {
    const acuid = req.user.customClaims.acuid;
    const { sender_id } = req.body; // sender_id is the user who sent the friend request
    if (!sender_id) return res.status(400).json({ error: 'sender_id is required' });
    try {
        const updateQuery = `
            UPDATE friendship_request
            SET status = 2
            WHERE sender_id = $1 AND receiver_id = $2
        `;
        await pool.query(updateQuery, [sender_id, acuid]);

        res.status(200).json({ message: 'Friend request rejected' });
    } catch (error) {
        console.error('Error rejecting friend request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

router.post('/RejectGroupRecommendation', async (req, res) => {
    const acuid = req.user.customClaims.acuid;
    const { group_id } = req.body;
    if (!group_id) return res.status(400).json({ error: 'group_id is required' });
    try {
        const updateQuery = `
            UPDATE group_recommendation
            SET status = 2
            WHERE user_id = $1 AND group_id = $2
        `;
        await pool.query(updateQuery, [acuid, group_id]);

        res.status(200).json({ message: 'Group Recommendation rejected' });
    } catch (error) {
        console.error('Error rejecting group Recommendation:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

