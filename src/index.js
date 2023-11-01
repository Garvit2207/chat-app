const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const port = process.env.PORT || 3000
const server = http.createServer(app)
const io = socketio(server)
const Filter = require('bad-words')

const { generateMessage } = require('./utils/messages.js')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users.js')

const PublicDirectory = path.join(__dirname, '../public')

app.use(express.static(PublicDirectory))

    io.on('connection', (socket)=>{
        console.log('New web socket connection')
      
        socket.on('join', ({username, room}, callback)=>{
            const {error, user} = addUser({id: socket.id, username, room})

            if(error){
                return callback(error)
            }

            socket.join(user.room)
            
            socket.emit('message', generateMessage('Admin', 'Welcome!'))
            socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined`))
            
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
            
            callback()
        })

        socket.on('chat', (message, callback)=>{
            const filter = new Filter()
            if(filter.isProfane(message)){
                return callback('Profanity is not allowed')
            }

            const user = getUser(socket.id)
            console.log(user)
            socket.broadcast.to(user.room).emit('message', generateMessage(user.username, message))
            socket.emit('message', generateMessage('You', message))
            callback()
        })

        socket.on('disconnect', ()=>{
            const user = removeUser(socket.id)
            if(user){
                io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
                        
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
            }
        })


    })


server.listen(port, ()=>{
    console.log('Server is up')
})


