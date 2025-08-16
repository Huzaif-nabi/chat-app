import express from 'express';
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from './lib/db.js';
import userRouter from './routes/user.routes.js';
import messageRouter from './routes/message.routes.js';
import {Server} from 'socket.io'
import { log } from 'console';


// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Middleware setup
app.use(express.json({limit: "4mb"}))  // Can upload images of max 4mb limit
app.use(cors());

// Initialize socket.io server
 export const io = new Server(server, {  //  Creates a Socket.IO server that works on top of your HTTP server (server).
    cors: {origin: '*'} //  Allows any frontend to connect to your backend via WebSocket
 })

 // Store online users
 export const userSocketmap = {}; // {userId : socketId} This is just an object acting like a dictionary.nThe key = userId (your app’s user’s ID from DB)nThe value = socket.id (the unique ID that Socket.IO assigns to a connected socket).

 // Socket.io connection handler
 io.on("connection", (socket) => {  // this runs whenever a new user connects to the Socket.IO server. socket = that user's live connection. socket.handshake.query.userId → This means your frontend is sending the userId when connecting
    const userId = socket.handshake.query.userId;
    console.log("User connected", userId);

    if(userId){
        userSocketmap[userId] = socket.id;  // Saves userId → socket.id in userSocketmap so you can: Send messages directly to that user later. Know who is online.
    }

    // Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketmap));  // Object.keys(userSocketmap) → gives an array of all online user IDs. io.emit → sends this to all connected clients so everyone knows who’s online.

    socket.on("disconnect", ()=>{  // When a user closes the browser or loses connection: delete userSocketmap[userId] → remove them from the online list. Broadcast the updated list of online users to everyone again.
        console.log("User Disconnected", userId);
        delete userSocketmap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketmap))
    })
 })



// Route setup
app.use("/api/status", (req,res)=> res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter)

// Connect to MongoDB
await connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server is running on PORT: " + PORT);
});



