const express = require('express');
const { Server } = require('socket.io'); // Use this explicit import
const http = require('http');
const stun = require('stun');
require("dotenv").config();


const app = express();
const server = http.createServer(app);

// Configure CORS to allow your React app to connect
const io = new Server(server, {
  cors: {
    origin: '*', // Replace with your React app's URL
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
     io.emit("getallusers", users);
    })
    console.log("Current users:", users);

    socket.on("offer",(data)=>{
    const {senderId,receiverId,offer} =data;
    io.to(receiverId).emit("offer",{senderId,receiverId,offer});
    console.log(senderId,receiverId,offer);
    })

    socket.on("answer",(data)=>{
      const {senderId,receiverId,answer} = data;
        io.to(receiverId).emit("answer",data);
      console.log(data);
      console.log("data");
    })

    socket.on("ice-candidate",(data)=>{
      io.to(data.receiverId).emit("ice-candidate",data);
    })

    socket.on("end-call", (data) => {
      const { receiverId } = data;
      io.to(receiverId).emit("end-call", data);
    })

    socket.on("disconnect", () => {
        // Remove the user from the users object when they disconnect
        for (const [userid, socketId] of Object.entries(users)) {
            if (socketId === socket.id) {
                delete users[userid];
                break;
            }
        }
        console.log("User disconnected...");
        io.emit("getallusers", users);
    });
});



const getOurPublicIpAndPort = async (req, res) => {
  try{
    const  result = await stun.request('stun.l.google.com:19302');
    const { address, port } = result.getXorAddress();
    res.json({ address, port });
  }catch(err){
    console.error("Error getting public IP and port:", err);
    res.status(500).json({ error: "Failed to get public IP and port" });
  }
}

app.set("trust proxy",true);
const sayhello =async(req,res)=>{
  console.log(req.ip);  
  return res.json({reqip:req.ip})
}

app.get('/hello',sayhello);


app.get('/findMyIP', getOurPublicIpAndPort);

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
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