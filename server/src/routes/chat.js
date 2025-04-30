const router = require('express').Router();
const pool = require('../db/connection_pool');
const verifyUser = require('../auth/user'); // Import the auth middleware
const { getFullProfile, getAnonProfile } = require('./commonfn'); // Import the common functions

router.use(verifyUser); // Apply the auth middleware to all routes in this file

// Todo: leaveGroup, unfriendUser

router.get('/fetchFriendsAndGroups', async (req, res) => {
    const acuid = req.user.customClaims.acuid; // Get the authenticated user's acuid from the token
    try {
        // Fetch friends
        const friendsQuery = `
            SELECT 
            f.friendship_id, 
            CASE 
            WHEN f.user1_id = $1 THEN f.user2_id 
            ELSE f.user1_id 
            END AS friend_id,
            CASE 
            WHEN f.user1_id = $1 THEN f.user1_reveal_status 
            ELSE f.user2_reveal_status 
            END AS user_reveal_status,
            CASE 
            WHEN f.user1_id = $1 THEN f.user2_reveal_status 
            ELSE f.user1_reveal_status 
            END AS friend_reveal_status
            FROM friendship f
            WHERE 
            (f.user1_id = $1 OR f.user2_id = $1) 
            AND f.user1_blocking_status = 0 
            AND f.user2_blocking_status = 0
        `;
        const friends = await pool.query(friendsQuery, [acuid]);

        // Fetch profile details for each friend
        const friendsWithProfiles = await Promise.all(
            friends.rows.map(async (friend) => {
            const profile =
                friend.friend_reveal_status === 1
                ? await getFullProfile(friend.friend_id)
                : await getAnonProfile(friend.friend_id);
            return {
                ...friend,
                profile,
            };
            })
        );

        // Fetch groups
        const groupsQuery = `
            SELECT 
            gm.group_id, 
            g.group_name
            FROM group_membership gm
            JOIN groups g ON gm.group_id = g.group_id
            WHERE gm.user_id = $1 and gm.status = 0
        `;
        const groups = await pool.query(groupsQuery, [acuid]);

        res.json({
            friends: friendsWithProfiles,
            groups: groups.rows
        });
    } catch (error) {
        console.error('Error fetching friends and groups:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

router.post('/leaveGroup', async (req, res) => {
    const acuid = req.user.customClaims.acuid; // Get the authenticated user's acuid from the token
    const { group_id } = req.body; // Get the group ID from the request body

    try {
        // Leave the group by updating the status to 1 (indicating left)
        const leaveGroupQuery = `
            UPDATE group_membership 
            SET status = 1 
            WHERE user_id = $1 AND group_id = $2
        `;
        await pool.query(leaveGroupQuery, [acuid, group_id]);

        res.status(200).json({ message: 'Successfully left the group' });
    } catch (error) {
        console.error('Error leaving group:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

router.post('/unfriendUser', async (req, res) => {
    const acuid = req.user.customClaims.acuid; // Get the authenticated user's acuid from the token
    const { friend_id } = req.body; // Get the friend's ID from the request body

    try {
        // Unfriend the user by updating the blocking status
        const unfriendQuery = `
            UPDATE friendship 
            SET 
            user1_blocking_status = CASE WHEN user1_id = $1 THEN 1 ELSE user1_blocking_status END,
            user2_blocking_status = CASE WHEN user2_id = $1 THEN 1 ELSE user2_blocking_status END
            WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)
        `;
        await pool.query(unfriendQuery, [acuid, friend_id]);

        res.status(200).json({ message: 'Successfully unfriended the user' });
    } catch (error) {
        console.error('Error unfriending user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

module.exports = router