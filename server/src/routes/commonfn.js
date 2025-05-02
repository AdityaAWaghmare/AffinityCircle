const pool = require('../db/connection_pool');

async function getFullProfile(acuid) {
    try {
        // Get the user's full profile
        const fetchProfileQuery = `
            SELECT * FROM users WHERE user_id = $1
        `;
        const fetchProfileValues = [acuid];
        const fetchProfileResult = await pool.query(fetchProfileQuery, fetchProfileValues);

        return fetchProfileResult.rows[0];
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw new Error('Internal server error');
    }
}

async function getAnonProfile(acuid) {
    try {
        // Get the user's anonymous profile
        const fetchProfileQuery = `
            SELECT user_id, display_name, bio, hobby_rating FROM users WHERE user_id = $1
        `;
        const fetchProfileValues = [acuid];
        const fetchProfileResult = await pool.query(fetchProfileQuery, fetchProfileValues);

        return fetchProfileResult.rows[0];
    } catch (error) {
        console.error('Error fetching anonymous user profile:', error);
        throw new Error('Internal server error');
    }
}

module.exports = {
    getFullProfile,
    getAnonProfile
};