const router = require('express').Router();
const pool = require('../db/connection_pool');
const verifyUser = require('../auth/user'); // Import the auth middleware

router.use(verifyUser); // Use the authUser middleware for all routes in this router

// Todo: fetchProfile(themself and others), saveProfile

