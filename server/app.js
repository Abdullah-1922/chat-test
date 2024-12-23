import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
const port = process.env.PORT || 3001;
const app = express();

const server = new createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send("Hello World");
});

// io is full Circuit and the socket is Individual connection.
io.on("connection", (socket) => {
  console.log("User connected", socket.id);
  //   socket.emit("welcome",`Welcome to the server`)
  //   socket.broadcast.emit("welcome",` ${socket.id} joined the server `)

  socket.on("message", (data) => {
    console.log(data);
    io.emit("message-receive", data);
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected `, socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

