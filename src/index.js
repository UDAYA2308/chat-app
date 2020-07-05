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

    socket.on("SendMessage", (message) => {
        io.emit("Message", message)
    })

})
server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})