const prepDiv = document.querySelector('#prep')
const presDiv = document.querySelector('#pres')
const mainText = document.querySelector('#main-text')
const mainImg = document.querySelector('#main-pic')
const submitButton = document.querySelector('#submit-btn')
const slidesInput = document.querySelector('#input-text')
const joinButton = document.querySelector('#join-btn')
const sessionInput = document.querySelector('#input-session')
const sessionId = document.querySelector('#session-id')
  
const socket = new WebSocket('wss://cnrd.computer/knowbase-ws')

socket.addEventListener('message', event => {
  const msg = JSON.parse(event.data)

  if (msg.id === state.id) {
    if (msg.do === 'previous') previous()
    if (msg.do === 'next') next()
    if (msg.do === 'send_state') sendState()
    if (msg.do === 'set_state') setState(msg.state)
  }
})

let state = {
  slides: [],
  current_slide: 0,
  mode: 'prep',
  id: false
}

submitButton.addEventListener('click', () => {
  try {
    state.slides = JSON.parse(slidesInput.value)
    present()
  } catch (err) {
    slidesInput.className = 'invalid'

    setTimeout(() => {
      slidesInput.className = ''
    }, 400)
  }
})

joinButton.addEventListener('click', () => {
  state.id = sessionInput.value
  sessionId.innerText = state.id

  requestState()

  sessionInput.className = 'invalid'

  setTimeout(() => {
    sessionInput.className = ''
  }, 400)
})

document.onkeydown = (event) => {
  if (state.mode === 'pres') {
    if (event.keyCode === 37) {
      const msg = {
        id: state.id,
        do: 'previous'
      }

      socket.send(JSON.stringify(msg))
      previous()
    }

    if (event.keyCode === 39) {
      const msg = {
        id: state.id,
        do: 'next'
      }

      socket.send(JSON.stringify(msg))
      next()
    }

    if (event.keyCode === 38) {
      prepare()
    }
  }
}

function setState (sessionState) {
  state = sessionState
  console.log(state)

  present()
  changeSlide()
}

function sendState () {
  const msg = { 
    id: state.id,
    do: 'set_state',
    state: state
  }

  socket.send(JSON.stringify(msg))
}

function requestState () {
  const msg = { 
    id: state.id,
    do: 'send_state'
  }

  socket.send(JSON.stringify(msg))
}

function generateId () {
  state.id = `${ Math.random().toString(24).replace(/[^a-z]+/g, '').substr(0, 5).toUpperCase() }-${ Math.floor(Math.random() * (999 - 111) + 111) }`
  sessionId.innerText = state.id
}

function prepare () {
  state.mode = 'prep'
  state.current_slide = 0
  state.id = false
  
  prepDiv.style.display = 'block'
  presDiv.style.display = 'none'
}

function present () {
  state.mode = 'pres'
  if (!state.id) generateId()

  prepDiv.style.display = 'none'
  presDiv.style.display = 'flex'

  changeSlide()
}

function changeSlide () {
  if (state.slides[state.current_slide].text) {
    mainText.style.display = 'block'
    mainImg.style.display = 'none'

    mainText.innerText = state.slides[state.current_slide].text
  } else if (state.slides[state.current_slide].img) {
    mainImg.style.display = 'block'
    mainText.style.display = 'none'

    mainImg.src = state.slides[state.current_slide].img
  } else {
    console.log('no valid slide')
  }

  console.log(state.current_slide)
}

function previous () {
  if (state.current_slide === 0) return

  state.current_slide--
  changeSlide()
}

function next () {
  if (state.current_slide === state.slides.length - 1) return

  state.current_slide++
  changeSlide()
}