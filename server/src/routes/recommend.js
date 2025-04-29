const router = require('express').Router();
const axios = require('axios');
const pool = require('../db/connection_pool');
const authUser = require('../auth/user'); // Import the authUser middleware
const recommenderServiceUrl = process.env.RECOMMENDER_URL; // URL of the recommender service

router.use(authUser); // Use the authUser middleware for all routes in this router

// Route to get user recommendations
router.post('/recommend_users', async (req, res) => {
    const userId = req.user.customClaims.acuid; // Assuming authUser middleware attaches user info to req.user
    try {
        const response = await axios.post(`${recommenderServiceUrl}/recommend_users`, { user: userId });
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// Route to get group recommendations
router.post('/recommend_groups', async (req, res) => {
    const userId = req.user.customClaims.acuid; // Assuming authUser middleware attaches user info to req.user
    try {
        const response = await axios.post(`${recommenderServiceUrl}/recommend_groups`, { user: userId });
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

module.exports = router;