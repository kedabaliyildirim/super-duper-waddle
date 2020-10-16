const socketio = require('socket.io');
const io = socketio();

const socketApi= { };
socketApi.io =io;

const users = {};
//helpers
const randomColor = require('../helpers/rondomColors')

io.on('connection', (socket) => {

    
    socket.on('newUser', (data) =>{
        const defulData = {
            id: socket.id,
            position: {
                x: 0,
                y: 0
            },
            color: randomColor()
        };
        const userData = Object.assign(data, defulData);
        users[socket.id]= userData;
        socket.emit('initPlayers', users);
        
        socket.broadcast.emit('newUser', users[socket.id])
    })
    socket.on('disconnect', ()=> {
        socket.broadcast.emit('disUser', users[socket.id] )
        delete users[socket.id];
    })
    
    socket.on('animate', (data) => {
        try {
            users[socket.id].position.x=data.x;
        users[socket.id].position.y=data.y;

        socket.broadcast.emit('moveIt', {
            socketId:socket.id,
            x: data.x,
            y: data.y
        })
        } catch (error) {
            console.log(error);
            
        }

    })
    socket.on('newMessage', data => {
        const messageData = Object.assign({socketId: socket.id}, data)
        socket.broadcast.emit('newMessage', messageData);
    })


})
module.exports= socketApi;