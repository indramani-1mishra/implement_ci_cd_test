const express = require('express');
const { Server } = require('socket.io'); // Use this explicit import
const http = require('http');


const app = express();
const server = http.createServer(app);

// Configure CORS to allow your React app to connect
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your React app's URL
    methods: ["GET", "POST"]
  }
});
const users={};
io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id); 

    socket.on("join",(data)=>{
       const {userid} =data;
       users[userid]=socket.id;
      
        socket.join(userid);
     console.log("User joined with ID:", userid);
    })
    console.log("Current users:", users);

    socket.on("disconnect", () => {
        // Remove the user from the users object when they disconnect
        for (const [userid, socketId] of Object.entries(users)) {
            if (socketId === socket.id) {
                delete users[userid];
                break;
            }
        }
        console.log("User disconnected...");
    });
});

app.get('/', (req, res) => {
    res.send('<h1 style="text-align: center;">server is running</h1>');
});

app.get('/users', (req, res) => {
    res.json({name: "John Doe", email: "john.doe@example.com"});
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        const fallbackPort = port + 1;
        console.log(`Port ${port} is busy. Trying ${fallbackPort} instead...`);
        server.listen(fallbackPort, () => {
            console.log(`Server is running on port ${fallbackPort}`);
        });
    } else {
        console.error(err);
        process.exit(1);
    }
});