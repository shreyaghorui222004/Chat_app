import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

export const app = express();
export const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: ENV.CLIENT_URL,
    credentials: true,
  },
});

// Apply auth middleware
io.use(socketAuthMiddleware);

// Store online users
const userSocketMap = {}; // { userId: socketId }

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.user.fullName);

  //  IMPORTANT FIX
  const userId = socket.user._id.toString();

  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.user.fullName);

    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});