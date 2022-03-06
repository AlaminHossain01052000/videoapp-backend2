const express = require('express');
var cors = require('cors');
const http = require('http');
const app = express();
const port = 5000;
const server = http.createServer(app);
app.use(cors())

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});


//Connect two people

io.on("connection", (socket) => {
    socket.emit("me", socket.id); //Generet id

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded");
    })

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name });
    })

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    })
})
server.listen(port, () => console.log('Server is Running in 5000 smoothly'));
