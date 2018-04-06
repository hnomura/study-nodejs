const path = require('path');
const http = require('http'); // a part of express
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000; 

var app = express();
var server = http.createServer(app);
var io = socketIO(server); // socket.io

app.use(express.static( publicPath ));

io.on('connection', (socket) => {
    console.log('New user connected');

    // Welcome message to newly connected socket
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app') );
 
    // Notification to everyone except for the newly connected socket 
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));
    
    socket.on('createMessage', (message) => {
        console.log('createMessage', message);

        // To everyone including the socket sending this message
        io.emit('newMessage', generateMessage( message.from, message.text ));

        // // everybody but this socket 
        // socket.broadcast.emit('newMessage', {
        // from: message.from, 
        // text: message.text, 
        // createdAt: new Date().getTime()
        // });
      
    });


    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});