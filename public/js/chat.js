const socket = io()

// Elements
const $message_Form = document.querySelector('form')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Otions
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = ()=>{
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const $newMessageStyle = getComputedStyle($newMessage)
    const $newMessageMargin = parseInt($newMessageStyle.marginBottom)
    const $newMessageHeight = $newMessage.offsetHeight + $newMessageMargin

    console.log($newMessageHeight)

    // Visible Height
    const visibleHeight = $messages.offsetHeight

    // Height of the messages container
    const containerHeight = $messages.scrollHeight

    // How far we have scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - $newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }

}

socket.on('message', (message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({room, users})=>{
    const html = Mustache.render(sidebarTemplate, {
        room, users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$message_Form.addEventListener('submit', (e)=>{
    e.preventDefault()

    //disable button
    $messageFormButton.setAttribute('disabled', 'disabled')
    // $messageFormButton.disabled = true

    const message = e.target.message.value

    socket.emit('chat', message, (error)=>{
        
        // enable button
        $messageFormButton.removeAttribute('disabled')
        // $messageFormButton.disabled = false

        $messageFormInput.value = ''
        $messageFormInput.focus()    
    
        if(error){
            return console.log(error)
        }
        console.log('Message Delivered!')
    })

})

socket.emit('join', {username, room}, (error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})

