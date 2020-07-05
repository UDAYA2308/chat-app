const socket = io()

socket.on('Message', (message) => {
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const message = document.querySelector('#message')
    socket.emit('SendMessage', message.value)
    message.value = ''
})

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation)
        return alert('Geolocation is not supported for your browser')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('ShareLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    })
})