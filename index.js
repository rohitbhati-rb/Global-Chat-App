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
let totalUsers;

io.on('connection', (socket) => {
    // When a user connects
    socket.on('new-user-joined', username => {
        users[socket.id] = username;
        totalUsers = Object.keys(users).length;
        socket.broadcast.emit('new-user-joined', username);
        io.emit('updateUserCount',totalUsers);
    });
    // Sending and Recieving the message
    socket.on('chat message', message => {
        socket.broadcast.emit('chat message', {message:message, username:users[socket.id]});
    });
    // When a user disconnects
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected',users[socket.id]);
        delete users[socket.id];
        totalUsers = Object.keys(users).length;
        io.emit('updateUserCount',totalUsers);
    });
});

server.listen(3000, () => {
    console.log('Listening on PORT : 3000');
});