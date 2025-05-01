const { createServer } = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const admin = require('./auth/firebase');
const pool = require('./db/connection_pool');


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

// Routes
app.use('/new', createUserProfileRoute);
app.use('/user', userRoutes);
app.use('/rs', recommendRoutes);
app.use('/chat', chatRoutes);


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
    socket.on('join_friend_chat', async ({ conversationId }) => {
        const room = `F${conversationId}`;
        const result = await pool.query(
        'SELECT 1 FROM friendship WHERE friendship_id = $1 AND (user1_id = $2 OR user2_id = $2)',
        [conversationId, userId]
        );
        if (result.rowCount > 0) {
        socket.join(room);
        }
    });

    // Join group room
    socket.on('join_group_chat', async ({ groupId }) => {
        const room = `G${groupId}`;
        const result = await pool.query(
        'SELECT 1 FROM group_membership WHERE group_id = $1 AND user_id = $2',
        [groupId, userId]
        );
        if (result.rowCount > 0) {
        socket.join(room);
        }
    });

    // Friend message
    socket.on('send_friend_message', async ({ conversationId, content }) => {
        const room = `F${conversationId}`;
        await pool.query(
        'INSERT INTO friendship_message (conversation_id, sender_id, content) VALUES ($1, $2, $3)',
        [conversationId, userId, content]
        );
        io.to(room).emit('receive_friend_message', {
        senderId: userId,
        conversationId,
        content,
        sentAt: new Date(),
        });
    });

    // Group message
    socket.on('send_group_message', async ({ groupId, content, displayName }) => {
        const room = `G${groupId}`;
        await pool.query(
        'INSERT INTO group_message (group_id, sender_id, sender_display_name, content) VALUES ($1, $2, $3, $4)',
        [groupId, userId, displayName, content]
        );
        io.to(room).emit('receive_group_message', {
        senderId: userId,
        groupId,
        displayName,
        content,
        sentAt: new Date(),
        });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${userId}`);
    });
});

// -------------------------------------------------------------------------------------------------------------
// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
