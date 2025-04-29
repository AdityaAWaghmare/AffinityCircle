const router = require('express').Router();
const axios = require('axios');
const { Pool } = require('pg');

const recommenderServiceUrl = process.env.RECOMMENDER_URL || 'http://recommender:8000/';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://ac:ac@db:5432/ac',
  });

// post request to get user recommendation
router.post('/', async (req, res, next) => { // Make the handler async
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).send('User ID is required');
    }
  
    try {
      // Send request to recommendation service
      // Assuming the recommender service expects a POST request with { "user_id": userId }
      console.log(`Forwarding recommendation request for userId: ${userId} to ${recommenderServiceUrl}`);
      const response = await axios.post(recommenderServiceUrl,"recommend_users", {
        user_id: userId // Adjust the key ('user_id') if the recommender expects something different
      });
      
        if (responce && response.data) {
            console.log('Recommendation service response:', response.data);


            const friendshipQuery = 'SELECT * FROM friendship_requests WHERE user_id = $1';
            const result = await pool.query(friendshipQuery, [userId]);
    
            // Handle the friendship requests
            console.log('Friendship requests:', result.rows);
    
            return res.status(200).json({
            recommendations: response.data, // From recommender service
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

  module.exports = router; // Ensure the router is exporte
