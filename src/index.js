const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { Socket } = require('dgram')
const { generateMessage } = require('./utils/messages')

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
    console.log('New WebSocket connection')

    socket.on("SendMessage", (message, callback) => {
        io.to('kumar').emit("Message", generateMessage(message))
        callback()
    })

    socket.on('join', ({ username, room }) => {
        socket.join(room)
        socket.emit('Message', generateMessage('Welcome'))
        socket.broadcast.to(room).emit('Message', generateMessage(`${username} has joined`))

    })

    socket.on("ShareLocation", (cords, callback) => {
        io.emit("LocationMessage", generateMessage(`https://google.com/maps?q=${cords.latitude},${cords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        io.emit("Message", generateMessage('User has left'))
    })
})
server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})