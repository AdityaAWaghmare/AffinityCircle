const router = require('express').Router();

const pool = require('./db/connection_pool');


// all routes 
/*
preferences (post and get)
profile (post and get)
friend_requests (get)
group_recommendation (get)

*/

router.post('/preferences', async (req, res) => {
    const { userId, preferences } = req.body;
    if (!userId || !preferences) {
        return res.status(400).send('User ID and preferences are required');
    }

    try {
        // Assuming preferences is an array of integers
        const query = `
            UPDATE users
            SET hobby_rating = $1
            WHERE user_id = $2
        `;

        await pool.query(query, [preferences, userId]);
        res.status(200).send('Preferences updated successfully');
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).send('Internal server error');
    } finally {
        await pool.end();
    }
}
);

router.post('/profile', async (req, res) => {
    const { userId, displayName, bio } = req.body;
    if (!userId || !displayName || !bio) {
        return res.status(400).send('User ID, display name, and bio are required');
    }

    try {
        const query = `
            UPDATE users
            SET display_name = $1, bio = $2
            WHERE user_id = $3
        `;

        await pool.query(query, [displayName, bio, userId]);
        res.status(200).send('Profile updated successfully');
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('Internal server error');
    } finally {
        await pool.end();
    }
}
);

router.get('/preferences', async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).send('User ID is required');
    }

    try {
        const query = `
            SELECT hobby_rating
            FROM users
            WHERE user_id = $1
        `;

        const result = await pool.query(query, [userId]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error fetching preferences:', error);
        res.status(500).send('Internal server error');
    } finally {
        await pool.end();
    }
}
);

router.get('/profile', async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).send('User ID is required');
    }

    try {
        const query = `
            SELECT display_name, bio
            FROM users
            WHERE user_id = $1
        `;

        const result = await pool.query(query, [userId]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).send('Internal server error');
    } finally {
        await pool.end();
    }
}
);

router.get('/friend_requests', async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).send('User ID is required');
    }

    try {
        const query = `
            SELECT * 
            FROM friendship_requests 
            WHERE receiver_id = $1
            AND recommendation_status = 2
        `;

        const result = await pool.query(query, [userId]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).send('No friend requests found');
        }
    } catch (error) {
        console.error('Error fetching friend requests:', error);
        res.status(500).send('Internal server error');
    } finally {
        await pool.end();
    }
}
);

router.get('/group_recommendation', async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).send('User ID is required');
    }

    try {
        const query = `
            SELECT * 
            FROM group_requests 
            WHERE user_id = $1
            AND recommendation_status = 0
        `;

        const result = await pool.query(query, [userId]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).send('No group requests found');
        }
    } catch (error) {
        console.error('Error fetching group requests:', error);
        res.status(500).send('Internal server error');
    } finally {
        await pool.end();
    }
}
);
