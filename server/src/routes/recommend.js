const router = require('express').Router();
const axios = require('axios');
const pool = require('./db/connection_pool');

const recommenderServiceUrl = process.env.RECOMMENDER_URL;

// post request to get user recommendation
router.post('/recommend_user', async (req, res, next) => { // Make the handler async
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).send('User ID is required');
    }
  
    try {
      console.log(`Forwarding recommendation request for userId: ${userId} to ${recommenderServiceUrl}`);
      const response = await axios.post(recommenderServiceUrl,"recommend_users", {
        user_id: userId // Adjust the key ('user_id') if the recommender expects something different
      });
      
        if (response && response.data) {
            const friendshipQuery = 'SELECT * FROM friendship_requests WHERE user_id = $1';
            const result = await pool.query(friendshipQuery, [userId]);

            console.log('Friendship requests:', result.rows);
    
            return res.status(200).json({
            friendshipRequests: result.rows, // From database
            });
        } else {
            throw new Error('No data received from recommendation service');
        }
    }
    catch (error) {
    console.error('Error calling recommendation service:', error.message);
    if (error.response) {
        console.error('Recommender service error status:', error.response.status);
        console.error('Recommender service error data:', error.response.data);
        res.status(error.response.status).json(error.response.data || { message: 'Error from recommendation service' });
    } else if (error.request) {

        console.error('No response received from recommender service:', error.request);
        res.status(503).json({ message: 'Recommendation service unavailable' }); // Service Unavailable
    } else {
        console.error('Error setting up request to recommender service:', error.message);
        res.status(500).json({ message: 'Internal server error communicating with recommendation service' });
    }
    }
});

router.post('/recommend_groups', async (req, res, next) => { // Make the handler async
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).send('User ID is required');
    }

    try {
        console.log(`Forwarding recommendation request for userId: ${userId} to ${recommenderServiceUrl}`);
        const response = await axios.post(recommenderServiceUrl,"recommend_groups", {
            user_id: userId // Adjust the key ('user_id') if the recommender expects something different
        });
        
        if (response && response.data) {
                const groupquery = 'SELECT * FROM group_requests WHERE user_id = $1';
                const result = await pool.query(groupquery, [userId]);
                console.log('Group requests:', result.rows);

                return res.status(200).json({
                groupRequests: result.rows, // From database
                });
        } else {
                throw new Error('No data received from recommendation service');
        }
        }
        catch (error) {
            console.error('Error calling recommendation service:', error.message);
            if (error.response) {
                console.error('Recommender service error status:', error.response.status);
                console.error('Recommender service error data:', error.response.data);
                res.status(error.response.status).json(error.response.data || { message: 'Error from recommendation service' });
            } else if (error.request) {
        
                console.error('No response received from recommender service:', error.request);
                res.status(503).json({ message: 'Recommendation service unavailable' }); // Service Unavailable
            } else {
                console.error('Error setting up request to recommender service:', error.message);
                res.status(500).json({ message: 'Internal server error communicating with recommendation service' });   
            }
        }
});


module.exports = router; // Ensure the router is exporte
