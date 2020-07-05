const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { Socket } = require('dgram')
const { generateMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/user')

const app = express()
    // Create the HTTP server using the Express app
const server = http.createServer(app)
    // Connect socket.io to the HTTP server
const io = socketio(server)
const port = process.env.PORT
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))
    // Listen for new connections to Socket.io

io.on('connection', (socket) => {

    socket.on("SendMessage", (message, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit("Message", generateMessage(user.username, message))
        callback()
    })

    socket.on('join', ({ username, room }, callback) => {

        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('Message', generateMessage(user.username, 'Welcome!'))
        socket.broadcast.to(user.room).emit('Message', generateMessage(`${user.username} has joined`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()

    })

    socket.on("ShareLocation", (cords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit("LocationMessage", generateMessage(user.username, `https://google.com/maps?q=${cords.latitude},${cords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit("Message", generateMessage(`${user.username} has left`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})
server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})