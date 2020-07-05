const socket = io()

const $messages = document.querySelector('#messages')

const messageTemplate = document.querySelector('#message-template').innerHTML

const locationTemplate = document.querySelector('#location-template').innerHTML

socket.on("LocationMessage", (url) => {
    console.log(url)
    const html = Mustache.render(locationTemplate, { url: url.text, createdAt: moment(message.createdAt).format('h:mm a') })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('Message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const message = document.querySelector('#message')
    socket.emit('SendMessage', message.value, () => {
        console.log("Delivered!")
    })
    message.value = ''
    message.focus()

})

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation)
        return alert('Geolocation is not supported for your browser')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('ShareLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log("Location Shared")
        })
    })
})