const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { Socket } = require('dgram')

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

    socket.emit('Message', 'Welcome')
    socket.broadcast.emit('Message', "New User has joined")

    socket.on("SendMessage", (message, callback) => {
        io.emit("Message", message)
        callback()
    })

    socket.on("ShareLocation", (cords, callback) => {
        io.emit("Message", `https://google.com/maps?q=${cords.latitude},${cords.longitude}`)
        callback()
    })

})
server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})