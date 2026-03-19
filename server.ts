import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  // Socket.io logic
  const rooms = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
      
      const room = rooms.get(roomId) || { players: [] };
      if (!room.players.includes(socket.id)) {
        room.players.push(socket.id);
      }
      rooms.set(roomId, room);

      // Notify room about players
      io.to(roomId).emit("room-info", {
        players: room.players,
        yourId: socket.id
      });
    });

    socket.on("make-move", ({ roomId, move }) => {
      socket.to(roomId).emit("remote-move", move);
    });

    socket.on("reset-game", (roomId) => {
      socket.to(roomId).emit("remote-reset");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      // Cleanup rooms could be added here
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
