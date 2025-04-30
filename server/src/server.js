const { createServer } = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const { query } = require('./db/connection_pool'); // Import the query function from connection_pool.js

// -------------------------------------------- Routes and Middleware --------------------------------------------

// Import routes
const chatRoutes = require('./routes/chat');
const createUserProfileRoute = require('./routes/createUserProfile');
const recommendRoutes = require('./routes/recommend');
const userRoutes = require('./routes/user');

const app = express();
const server = createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: '*', // Adjust this to your frontend's origin
//         methods: ['GET', 'POST'],
//     },
// });

const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/createUserProfile', createUserProfileRoute);
app.use('/api/userPage', userRoutes);
app.use('/api/recommendPage', recommendRoutes);
app.use('/api/chatPage', chatRoutes);

// -------------------------------------------------- Chat Logic --------------------------------------------------

// // Socket.io implementation for real-time chatting
// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);

//     // Listen for join room event
//     socket.on('joinRoom', (room) => {
//         socket.join(room);
//         console.log(`User ${socket.id} joined room: ${room}`);
//     });

//     // Listen for chat messages
//     socket.on('chatMessage', async ({ room, message, sender }) => {
//         console.log(`Message from ${sender} in room ${room}: ${message}`);

//         // Save the message to the database
//         try {
//             const queryText = `
//                 INSERT INTO friendship_message (conversation_id, sender_id, content)
//                 VALUES ($1, $2, $3) RETURNING *;
//             `;
//             const values = [room, sender, message];
//             const result = await query(queryText, values);

//             // Emit the message to the room
//             io.to(room).emit('chatMessage', { sender, message });
//         } catch (error) {
//             console.error('Error saving message to database:', error);
//         }
//     });

//     // Fetch chat history for a room
//     socket.on('fetchChatHistory', async (room) => {
//         try {
//             const queryText = `
//                 SELECT sender_id, content, sent_at
//                 FROM friendship_message
//                 WHERE conversation_id = $1
//                 ORDER BY sent_at ASC;
//             `;
//             const values = [room];
//             const result = await query(queryText, values);

//             // Send chat history to the client
//             socket.emit('chatHistory', result.rows);
//         } catch (error) {
//             console.error('Error fetching chat history:', error);
//         }
//     });

//     // Handle user disconnect
//     socket.on('disconnect', () => {
//         console.log('A user disconnected:', socket.id);
//     });
// });

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
