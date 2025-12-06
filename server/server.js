import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userrouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import Message from "./models/message.js";
import path from "path";

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
  },
});

// Store online users: { userId: Set<socketId> }
export const userSocketMap = {};

io.on("connection", (socket) => {
  const userid = socket.handshake.query.userId;
  if (!userid) return;

  console.log("User connected:", userid);

  // Add socket to user's set
  if (!userSocketMap[userid]) userSocketMap[userid] = new Set();
  userSocketMap[userid].add(socket.id);

  // Emit online users to all
  io.emit("getonlineusers", Object.keys(userSocketMap));

  // ---------------------
  // Send message
  // ---------------------
  socket.on("sendMessage", async ({ receiverId, text, image }) => {
    try {
      const senderId = userid;

      // Save message to DB
      const newMessage = await Message.create({
        senderId,
        receiverId,
        text,
        image,
      });

      // ONLY emit to receiver sockets - sender already has optimistic update
      userSocketMap[receiverId]?.forEach((sockId) =>
        io.to(sockId).emit("newMessage", newMessage)
      );

      // Remove this line - it was causing the duplicate:
      // io.to(socket.id).emit("newMessage", newMessage);
    } catch (err) {
      console.error("sendMessage error:", err.message);
    }
  });

  // ---------------------
  // Mark messages as seen
  // ---------------------
  socket.on("markSeen", async ({ senderId }) => {
    try {
      const myId = userid;
      await Message.updateMany(
        { senderId, receiverId: myId, seen: false },
        { seen: true }
      );

      // Notify sender
      userSocketMap[senderId]?.forEach((sockId) => {
        io.to(sockId).emit("messagesSeen", { by: myId });
      });
    } catch (err) {
      console.error("markSeen error:", err.message);
    }
  });

  // ---------------------
  // Disconnect
  // ---------------------
  socket.on("disconnect", () => {
    console.log("User disconnected:", userid);
    if (userSocketMap[userid]) {
      userSocketMap[userid].delete(socket.id);
      if (userSocketMap[userid].size === 0) delete userSocketMap[userid];
    }
    io.emit("getonlineusers", Object.keys(userSocketMap));
  });
});

// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
  })
);

// DB + Routes
await connectDB();
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userrouter);
app.use("/api/messages", messageRouter);

// Optional: serve client build when deployed together on Render
// if (process.env.NODE_ENV === "production") {
//   const __dirname = path.resolve();
//   app.use(express.static(path.join(__dirname, "../client/dist"))); // if server root is /server
//   app.get("/*", (req, res) =>
//     res.sendFile(path.join(__dirname, "../client/dist/index.html"))
//   );
// }

console.log("JWT_SECRET loaded:", process.env.JWT_SECRET ? "YES" : "NO");

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server running on PORT:", PORT));
