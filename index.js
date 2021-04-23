const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

app.set('views', './views')
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index');
});

io.on('connection', (socket) => {
    // When a user connects
    console.log('A User Connected');
    // When a message is sent
    socket.on('chat message', msg => {
        // console.log(`Message: ${msg}`);
    });
    // Sending the message to others
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });
    // When a user disconnects
    socket.on('disconnect', () => {
        console.log('User Disconnected');
    });
});

server.listen(3000, () => {
    console.log('Listening on PORT : 3000');
});