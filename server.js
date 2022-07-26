const express = require("express");
const app = express();
const path = require("path");
const server = require("http").Server(app);
const io = require("socket.io")(server);
// the above line means
// const {server} = require('socekt.io');
// const io = new Server();
const { v4: uuidv4 } = require("uuid");
//
//
// run peerJs sever
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// we use this to tell the server that my javascript file is in public folder.
app.use(express.static("public"));
//what peer server you need to use.
app.use("/peerjs", peerServer);

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomid: req.params.room });
});

// Intializing socket.io making the connection ready.
io.on("connection", (socket) => {
  console.log("this is the socket", socket);
  console.log("socket is ready to be connected");
  // listening event
  socket.on("join-room", (roomid, userId) => {
    // join-room is the event listener name. you can give it whatever you want
    console.log("we have join the room");
    // we are joining the room.
    socket.join(roomid);
    // responding to event
    socket.to(roomid).emit("user-connected", userId);
    // socket.to(roomid).broadcast.emit("user-connected", userId);

    socket.on("message", (message) => {
      io.to(roomid).emit("createMessage", message);
    });
  });
});

server.listen(process.env.PORT || 3030, () => console.log("server is active"));
