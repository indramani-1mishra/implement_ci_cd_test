const  express = require('express');
const app = express();


app.get('/',(req,res)=>{
  res.send('<h1 style="color: blue; text-align: center;">Welcome to the WhatsApp Messaging API Server</h1>');
});
 
app.listen(3000,async ()=>{
 
  console.log('Server is running on port 3000');
})