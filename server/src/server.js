const { createServer } = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const admin = require('./auth/firebase');
const pool = require('./db/connection_pool');
const path = require('path');


// -------------------------------------------- Routes and Middleware --------------------------------------------

// Import routes
const chatRoutes = require('./routes/chat');
const createUserProfileRoute = require('./routes/createUserProfile');
const recommendRoutes = require('./routes/recommend');
const userRoutes = require('./routes/user');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
});

const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the build folder
const buildPath = path.join(__dirname, '../build'); // Adjust the path if needed
app.use(express.static(buildPath));
console.log('Serving static files from:', buildPath);

// // Catch-all route to serve the frontend's index.html for unknown routes
// app.get('*', (req, res) => {
//     res.sendFile(path.join(buildPath, 'index.html'));
// });

// Routes
app.use('/api/new', createUserProfileRoute);
app.use('/api/user', userRoutes);
app.use('/api/rs', recommendRoutes);
app.use('/api/chat', chatRoutes);


//-------------------------------------------- Socket.IO Setup --------------------------------------------

io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      if (!decoded.acuid) return next(new Error('User not onboarded'));
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
});
  
io.on('connection', (socket) => {
    const userId = socket.user.acuid;

    console.log(`User connected: ${userId}`);

    // Join friendship room
    socket.on('join_friend_chat', async ({ conversation_id }) => {
        const room = `F${conversation_id}`;
        const result = await pool.query(
        'SELECT 1 FROM friendship WHERE friendship_id = $1 AND (user1_id = $2 OR user2_id = $2)',
        [conversation_id, userId]
        );
        if (result.rowCount > 0) {
        socket.join(room);
        }
    });

    // Join group room
    socket.on('join_group_chat', async ({ group_id }) => {
        const room = `G${group_id}`;
        const result = await pool.query(
        'SELECT 1 FROM group_membership WHERE group_id = $1 AND user_id = $2',
        [group_id, userId]
        );
        if (result.rowCount > 0) {
        socket.join(room);
        }
    });

    // Friend message
    socket.on('send_friend_message', async ({ conversation_id, content }) => {
        const room = `F${conversation_id}`;
        await pool.query(
        'INSERT INTO friendship_message (conversation_id, sender_id, content) VALUES ($1, $2, $3)',
        [conversation_id, userId, content]
        );
        io.to(room).emit('receive_friend_message', {
        sender_id: userId,
        content:content,
        sent_at: new Date(),
        });
    });

    // Group message
    socket.on('send_group_message', async ({ group_id, content, sender_display_name }) => {
        const room = `G${group_id}`;
        await pool.query(
        'INSERT INTO group_message (group_id, sender_id, sender_display_name, content) VALUES ($1, $2, $3, $4)',
        [group_id, userId, sender_display_name, content]
        );
        io.to(room).emit('receive_group_message', {
        sender_id: userId,
        sender_display_name:sender_display_name,
        content:content,
        sent_at: new Date(),
        });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${userId}`);
    });
});

// -------------------------------------------------------------------------------------------------------------
// Start the server
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});