const socket = io()

const $messages = document.querySelector('#messages')

const messageTemplate = document.querySelector('#message-template').innerHTML

const locationTemplate = document.querySelector('#location-template').innerHTML

//options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild
        // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
        // Visible height
    const visibleHeight = $messages.offsetHeight
        // Height of messages container
    const containerHeight = $messages.scrollHeight
        // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight
    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

socket.on("LocationMessage", (url) => {
    console.log(url)
    const html = Mustache.render(locationTemplate, {
        url: url.text,
        username: url.username,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('Message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        username: message.username,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
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
    autoscroll()
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = "/"
    }
})