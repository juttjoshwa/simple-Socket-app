/**
 * This is a simple chat server built using Node.js, Express, and Socket.IO.
 * It allows users to join a chat room, send messages, and receive real-time updates.
 */

// Import required modules
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");
const Dot = require("dotenv");

// Create an Express app and enable CORS
const app = express();
app.use(cors());
Dot.config()
app.get("/", (req, res) => {
  res.send("HELL ITS WORKING");
});

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Array to store connected users
const users = [{}];

// Initialize Socket.IO with the server
const io = socketIO(server);

// Socket.IO event: 'connection'
io.on("connection", (socket) => {
  /**
   * When a user joins the chat room.
   * @param {Object} user - The user information (name, id, etc.).
   */
  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    socket.broadcast.emit("userJoind", {
      user: "Admin",
      message: `${users[socket.id]} has joined`,
    });
    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome to the chat, ${users[socket.id]}`,
    });
  });

  /**
   * When a user sends a message.
   * @param {Object} data - The message data (message, id, etc.).
   */
  socket.on("message", ({ message, id }) => {
    io.emit("sendMessage", { user: users[id], message, id });
  });

  /**
   * When a user disconnects from the chat.
   */
  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", { user: "Admin", message: "User has left" });
  });
});

// Define the server port
// const PORT = 2235;

// Start the server and listen on the specified port
server.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

// Set up a simple route for the root URL
app.get("/", (req, res) => {
  res.send("Server is working!!!");
});
