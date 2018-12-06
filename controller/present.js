const previousDiv = document.querySelector('#previous')
const nextDiv = document.querySelector('#next')

const socket = new WebSocket('ws://192.168.0.234:3001')

previousDiv.addEventListener('click', () => {
  socket.send('previous')
})

nextDiv.addEventListener('click', () => {
  socket.send('next')
})