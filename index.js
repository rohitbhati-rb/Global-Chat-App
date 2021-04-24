const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static(__dirname + '/public'));
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index');
});
const users = {};

io.on('connection', (socket) => {
    // When a user connects
    socket.on('new-user-joined', newUserName => {
        users[socket.id] = newUserName;
        console.log(`${newUserName} joined the chat`);
        socket.broadcast.emit('new-user-joined', newUserName);
    });
    // Sending and Recieving the message
    socket.on('chat message', msg => {
        socket.broadcast.emit('chat message', {msg:msg, name:users[socket.id]});
    });
    // When a user disconnects
    socket.on('disconnect', () => {
        console.log('User Disconnected');
        socket.broadcast.emit('user-disconnected',users[socket.id]);
    });
});

server.listen(3000, () => {
    console.log('Listening on PORT : 3000');
});