import express from 'express';
import http from 'http';
import { Server } from "socket.io";

const usersConnect = new Set([])

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.get('/', (req, res) => {
    res.send('<h2>¡Este es un mensaje desde el servidor Express!</h2>');
});

io.on('connection', function (socket) {
    let username = 'incognito';

    socket.on('userRegister', (newUsername) => {
        if (usersConnect.size < 2) {
            username = newUsername;
            usersConnect.add(newUsername)
            console.log('user Connnect ' + newUsername + ' id:' + socket.id)
            socket.emit('updateUsers', Array.from(usersConnect));
        } else {
            socket.emit('connectionError', 'No se pueden conectar más de 2 usuarios.');
        }
    })

    socket.on('getUpdateUsers', () => {
        socket.emit('updateUsers', Array.from(usersConnect))
    })

    socket.on('playerleft', () => {
        socket.broadcast.emit('playerServerleft')
    })

    socket.on('playerStopleft', () => {
        socket.broadcast.emit('playerServerStopleft')
    })

    socket.on('jumpPlayer', () => {
        socket.broadcast.emit('playerServerJump');
    })

    socket.on('playerRight', () => {
        socket.broadcast.emit('playerServerRight')
    })

    socket.on('playerStopRight', () => {
        socket.broadcast.emit('playerServerStopRight')
    })

    socket.on('disconnect', () => {
        console.log('Usuario desconectado ' + username);

        usersConnect.delete(username);
        console.log('User disconnected: ' + username);

        io.emit('updateUsers', Array.from(usersConnect));
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
}); 