const pool = require('../db/connection_pool');

// If identity of fetched user is revealed to the user
async function identityRevealedStatus(acuid, fetch_acuid) {
    if (acuid === fetch_acuid) {
        // If the user is fetching their own profile, return true
        return true;
    }

    try {
        const query = `
            SELECT 
                CASE 
                    WHEN f.user1_id = $1 AND f.user2_id = $2 THEN f.user1_identity_reveal_status
                    WHEN f.user1_id = $2 AND f.user2_id = $1 THEN f.user2_identity_reveal_status
                    ELSE NULL
                END AS identity_reveal_status
            FROM friendship f
            WHERE (f.user1_id = $1 AND f.user2_id = $2) 
               OR (f.user1_id = $2 AND f.user2_id = $1)
        `;
        const values = [acuid, fetch_acuid];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            // No friendship exists between the users
            return false;
        }

        const identityRevealStatus = result.rows[0].identity_reveal_status;
        return identityRevealStatus === 1; // Full profile can be viewed if status is 1
    } catch (error) {
        console.error('Error checking profile view permission:', error);
        throw new Error('Internal server error');
    }
}