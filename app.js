const express = require("express");
const app = express();
const path = require("path");
const http = require("http");

const socketio = require("socket.io");
const server = http.createServer(app); // this will create a server where i am passing app variable
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public"))); // this will connect all our static files(css, images) with express

io.on("connection", function (socket) {
    socket.on("send-location", function (data) {
        io.emit("receive-location", { id: socket.id, ...data });
    });
    
    socket.on("disconnect", function(){
        io.emit("user-disconnected", socket.id);
    });
    console.log("a new client connected");
});

app.get("/", function (req, res) {
    res.render("index");
});

server.listen(process.env.PORT || 4000, function(){
    console.log("Server listening at port 4000");
});