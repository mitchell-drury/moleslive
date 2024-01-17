require("dotenv").config();

const dev = process.env.NODE_ENV !== "production";
const { createServer } = require('node:http');
const path = require("path");
const express = require("express");
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, "client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

io.on('connection', (socket) => {
  console.log('socket connection!');
})

server.listen(3000, function () {
  console.log("Server started on :3000");
});
