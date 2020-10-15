const socketio = require('socket.io');
const io = socketio();

const socketApi= { };
socketApi.io =io;

const users = {};

io.on('connection', (socket) => {
    console.log('user connected');

    
    socket.on('newUser', (data) =>{
        const defulData = {
            id: socket.id,
            position: {
                x: 0,
                y: 0
            }
        };
        const userData = Object.assign(data, defulData);
        users[socket.id]= userData;
        socket.emit('initPlayers', users);
        
        socket.broadcast.emit('newUser', users[socket.id])
    } )
    socket.on('disconnect', ()=> {
        socket.broadcast.emit('disUser', users[socket.id] )
        delete users[socket.id];
        console.log(users);
    })
})
module.exports= socketApi;