const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'examples')));

function onConnection(socket) {
    socket.on('drawing', data => socket.broadcast.emit('drawing', data));
    // socket.on('drawing', data => socket.emit('drawing', data));
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
