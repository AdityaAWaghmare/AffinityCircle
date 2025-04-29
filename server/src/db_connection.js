const { Pool } = require('pg');
require('dotenv').config(); // Make sure to install dotenv: npm install dotenv

/**
 * Create a connection pool to the PostgreSQL database.
 * @returns {Pool} The connection pool instance.
 */
function createConnectionPool() {
    try {
        const connectionPool = new Pool({
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: 5432, // Default PostgreSQL port
            // Optional pool configuration settings:
            // max: 20, // max number of clients in the pool
            // idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
            // connectionTimeoutMillis: 2000, // how long to wait for a connection to be established
        });

        // Optional: Test the connection
        connectionPool.connect((err, client, release) => {
            if (err) {
                console.error('Error acquiring client from pool:', err.stack);
                throw new Error("Failed to connect to the database."); // Re-throw or handle appropriately
            }
            console.log('Connection pool initialized successfully and connected to database.');
            client.release(); // Release the client back to the pool
        });

        // Handle pool errors
        connectionPool.on('error', (err, client) => {
            console.error('Unexpected error on idle client', err);
            process.exit(-1); // Exit the application on pool error
        });

        return connectionPool;

    } catch (error) {
        console.error("Error initializing connection pool:", error);
        // In a real application, you might want more sophisticated error handling
        // than just exiting, but for direct translation:
        console.error("Failed to initialize database connection pool. Exiting.");
        process.exit(1); // Exit the application
    }
}

// Export the pool creation function or the pool itself depending on your needs
// module.exports = createConnectionPool(); // Export the created pool instance
module.exports = { createConnectionPool }; // Export the function to create the pool